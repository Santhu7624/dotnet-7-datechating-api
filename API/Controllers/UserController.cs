
using API.Data;
using API.DTO;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]    
    public class UserController : BaseApiController
    {

        private readonly IUserRepository _userRepo;

       
        public UserController(IUserRepository iUserRepo)
        {
            _userRepo = iUserRepo;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IEnumerable<MemberDto>> GetUsers()
        {
            var result = await _userRepo.GetMembersAsync();
            return result;
        }

        [HttpGet("{username}")]
        public async Task<MemberDto> GetUser(string username)
        {
            return await _userRepo.GetMemberAsync(username);
        }
    }
}