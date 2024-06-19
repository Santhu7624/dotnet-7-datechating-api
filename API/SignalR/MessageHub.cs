using API.DTO;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        private readonly IHubContext<PresenceHub> _presenceHub;
        public MessageHub(IMessageRepository messageRepository, IUserRepository userRepository, IMapper mapper, IHubContext<PresenceHub> presenceHub)
        {
            _mapper = mapper;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _presenceHub = presenceHub;
            
        }
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];
            var groupName = GetGroupName(Context.User.GetUserName(), otherUser);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroup(groupName);

            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await _messageRepository.GetMessageThread(Context.User.GetUserName(), otherUser);
            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);

        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var user = Context.User.GetUserName();
            if(user == createMessageDto.RecipientUsername)
                throw new HubException("You cannot send message to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(user);
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if(recipient == null) throw new HubException("User Not Found");
                
            
            var message = new Message
            {
                Sender =sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _messageRepository.GetMessageGroup(groupName);

            if(group.Connections.Any(x => x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections =await PresenceTracker.GetConnectionForUser(recipient.UserName);
                if(connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", 
                        new {username = sender.UserName, knownAs = sender.knownAs});
                }
            }

            _messageRepository.AddMessage(message);



            if(await _messageRepository.SaveAllAsync())
            {
                //var group = GetGroupName(sender.UserName, recipient.UserName);
                await Clients.Group(groupName).SendAsync("NewMessage",_mapper.Map<MessageDto>(message));
                    
            }

            //return BadRequest("Failed to send message");
        }

        

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare? $"{caller} - {other}" : $"{other} - {caller}";
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var group = await RemoveFromMessageGroup();
            //await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup");
            await base.OnDisconnectedAsync(ex);
        }

        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUserName());

            if(group == null)
            {
                group = new Group(groupName);
                _messageRepository.AddGroup(group);
            }
            group.Connections.Add(connection);

            if( await _messageRepository.SaveAllAsync()) return group;

            throw new HubException("Failed to add to group");
        }

        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await _messageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionID == Context.ConnectionId);
            _messageRepository.RemoveConnection(connection);
            if (await _messageRepository.SaveAllAsync()) return group;

            throw new HubException("Failed to remove from group");
        }
    }
}