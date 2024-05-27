using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Model;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessageController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;

        public MessageController(IUserRepository userRepository, IMessageRepository messageRepository, IMapper mapper)
        {

            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var user = User.GetUserName();
            if(user == createMessageDto.RecipientUsername)
                return BadRequest("You cannot send message to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(user);
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if(recipient == null)
                return NotFound();
            
            var message = new Message
            {
                Sender =sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            _messageRepository.AddMessage(message);

            if(await _messageRepository.SaveAllAsync())
                return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message");
        }

        public async Task<ActionResult<PagedList<MessageDto>>>GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUserName();

            var message = await _messageRepository.GetMessagesForUser(messageParams);
            Response.AddHttpPaginationHeader(new Pagination(message.Currentpage, message.PageSize, message.TotalCount,message.TotalPages));

            return message;
        }
        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string userName)
        {
            var currentUserName = User.GetUserName();

            return Ok(await _messageRepository.GetMessageThread(currentUserName, userName));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var user = User.GetUserName();

            var message = await _messageRepository.GetMessage(id);

            if(message.SenderUsername != user && message.RecipientUsername != user)
                return Unauthorized();

            if(message.SenderUsername == user) message.SenderDeleted = true;
            if(message.RecipientUsername == user) message.RecipientDeleted =true;
            if(message.SenderDeleted && message.RecipientDeleted)
            {
                _messageRepository.DeleteMessage(message);

            }

            if(await _messageRepository.SaveAllAsync())return Ok();

            return BadRequest("Failed to delete message");
        }
    }
}