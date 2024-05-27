using API.DTO;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Model;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context, IMapper mapper)
        {
           
            _context = context;
            _mapper = mapper;
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                            .OrderByDescending(x => x.MessageSent)
                            .AsQueryable();
            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => x.RecipientUsername == messageParams.Username   &&
                                x.RecipientDeleted == false),
                "Outbox" => query.Where(x => x.SenderUsername == messageParams.Username &&
                                x.SenderDeleted ==false),
                _ => query.Where(x => x.RecipientUsername == messageParams.Username &&
                        x.RecipientDeleted== false && x.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            return PagedList<MessageDto>.CreateAsync(messages,messageParams.PageIndex, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName)
        {
            var query = _context.Messages
                        .Include(u => u.Sender).ThenInclude(p => p.Photos)
                        .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                        .Where(
                            m=> m.RecipientUsername == currentUserName && 
                            m.RecipientDeleted == false &&
                            m.SenderUsername == recipientUserName
                            ||
                            m.RecipientUsername == recipientUserName &&
                            m.SenderDeleted == false &&
                            m.SenderUsername == currentUserName
                        ).OrderBy(m => m.MessageSent)
                        .AsQueryable();
            var unReadMessages = query.Where(m => m.DateRead == null &&
                                    m.RecipientUsername == currentUserName).ToList();

            if(unReadMessages.Any())
            {
                foreach(var item in unReadMessages)
                {
                    item.DateRead = DateTime.UtcNow;
                }
                await _context.SaveChangesAsync();
            }

            return await query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider).ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}