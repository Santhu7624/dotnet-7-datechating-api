using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Entities;
using API.Helpers;
using API.Model;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);

        //Task<bool> SaveAllAsync();

        Task<IEnumerable<AppUser>> GetUsersAsync();

        Task<AppUser> GetUserByIdAsync(int id);

        Task<AppUser> GetUserByUsernameAsync(string userName);

        //Task<IEnumerable<MemberDto>> GetMembersAsync();
        Task<PagedList<MemberDto>> GetMembersAsync(UserSpecParams paginationParams);

        Task<MemberDto> GetMemberAsync(string userName);

        Task<string> GetUserGender(string username);

    }
}