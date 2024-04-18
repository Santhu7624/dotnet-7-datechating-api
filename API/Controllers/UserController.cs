
using System.Security.Claims;
using API.Data;
using API.DTO;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]    
    public class UserController : BaseApiController
    {

        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;

       
        public UserController(IUserRepository iUserRepo, IMapper mapper)
        {
            _userRepo = iUserRepo;
            _mapper = mapper;
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

        [HttpPut]

        public async Task<ActionResult> UpdateMember(MemberupdatedDto memberupdatedDto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await _userRepo.GetMemberAsync(username);

            if(user ==null) return NotFound();

            _mapper.Map(memberupdatedDto, user);

            if(await _userRepo.SaveAllAsync()) return NoContent();

            return BadRequest();
        }
    }
}