using API.Interfaces;
using ATT.Logger.Library;
using AutoMapper;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        private readonly ILoggerService _loggerService;
        
        public UnitOfWork(DataContext context, IMapper mapper, ILoggerService loggerService)
        {
            _context = context;
            _mapper = mapper;
            _loggerService = loggerService;
            
        }
        public IUserRepository UserRepository => new UserRepository(_context, _mapper, _loggerService);//{ get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public IMessageRepository MessageRepository => new MessageRepository(_context, _mapper); //{ get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public ILikeRepository LikeRepository => new LikeRepository(_context, _mapper); //{ get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public bool HasChanges ()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}