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
        private readonly IUnitOfWork _uow;
        
        private readonly IMapper _mapper;

        public MessageController(IUnitOfWork uow,IMapper mapper)
        {

            _uow = uow;
            
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var user = User.GetUserName();
            if(user == createMessageDto.RecipientUsername)
                return BadRequest("You cannot send message to yourself");

            var sender = await _uow.UserRepository.GetUserByUsernameAsync(user);
            var recipient = await _uow.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

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

            _uow.MessageRepository.AddMessage(message);

            if(await _uow.Complete())
                return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDto>>>GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUserName();

            var message = await _uow.MessageRepository.GetMessagesForUser(messageParams);
            Response.AddHttpPaginationHeader(new Pagination(message.Currentpage, message.PageSize, message.TotalCount,message.TotalPages));

            return message;
        }
        // [HttpGet("thread/{username}")]
        // public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string userName)
        // {
        //     var currentUserName = User.GetUserName();

        //     return Ok(await _uow.MessageRepository.GetMessageThread(currentUserName, userName));
        // }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var user = User.GetUserName();

            var message = await _uow.MessageRepository.GetMessage(id);

            if(message.SenderUsername != user && message.RecipientUsername != user)
                return Unauthorized();

            if(message.SenderUsername == user) message.SenderDeleted = true;
            if(message.RecipientUsername == user) message.RecipientDeleted =true;
            if(message.SenderDeleted && message.RecipientDeleted)
            {
                _uow.MessageRepository.DeleteMessage(message);

            }

            if(await _uow.Complete())return Ok();

            return BadRequest("Failed to delete message");
        }
    }
}