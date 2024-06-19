using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Model;
using ATT.Logger.Library;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private  readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILoggerService _loggerService;
        public UserRepository(DataContext context, IMapper mapper, ILoggerService loggerService)
        {
            _loggerService = loggerService;
            _context = context;   
            _mapper = mapper;
        }

        public async Task<MemberDto> GetMemberAsync(string userName)
        {
            return await _context.Users.Where(x => x.UserName == userName)
                .Include(x => x.Photos)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserSpecParams paginationParams)
        {
            // return await _context.Users
            //     .Include(x => x.Photos)
            //     .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            //     .ToListAsync();

            // var query = _context.Users
            //                     .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            //                     .AsNoTracking();
            var minAge = DateOnly.FromDateTime(DateTime.Today.AddYears(-paginationParams.AgeTo -1));
            var maxAge = DateOnly.FromDateTime(DateTime.Today.AddYears(-paginationParams.AgeFrom));
            _loggerService.LogInformation(minAge.ToString() + "   "+ maxAge);
            var query = _context.Users.AsEnumerable().AsQueryable();
            query = query.Where(u => u.UserName != paginationParams.UserName);
            query = query.Where(u => u.Gender == paginationParams.Gender);
            query = query.Where(u => u.DateOfBirth >= minAge && u.DateOfBirth <= maxAge);     

            query = paginationParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.CreatedDate),
                _ => query.OrderByDescending(u => u.LastActive)
            };       
            _loggerService.LogInformation(query.ToString());
            var result = await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking(), 
                                                            paginationParams.PageIndex, 
                                                            paginationParams.PageSize);
            _loggerService.LogJson(result);
            return result;
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(x => x.Photos)               
                .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(x => x.Photos)
                .ToListAsync();
        }

        // public async Task<bool> SaveAllAsync()
        // {
        //     return await _context.SaveChangesAsync() > 0;
        // }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<string> GetUserGender(string username)
        {
            return await _context.Users
                    .Where(x => x.UserName == username)
                    .Select(x => x.Gender).FirstOrDefaultAsync();
        }
    }
}