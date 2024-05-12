using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ATT.Logger.Library;
using AutoMapper;

namespace API.Controllers
{
    
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        private readonly ITokenService _tokenService;

        private readonly ILoggerService _logger;

        private readonly IMapper _mapper;


        public AccountController(DataContext context, ITokenService tokenService, ILoggerService logger, IMapper mapper)
        {
            _context =  context;
            _tokenService = tokenService;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            _logger.LogInformation("========================= Register Api call received");
            _logger.LogJson(registerDto);
            if(await UserExists(registerDto.Username))
                return BadRequest("Username is taken");
            using var hMAC = new HMACSHA512();
            // var user = new AppUser
            // {
            //     UserName = registerDto.Username.ToLower(),
            //     PasswordHash = hMAC.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            //     PasswordSalt = hMAC.Key,
            //     knownAs = registerDto.KnownAs,
            //     Gender = registerDto.Gender,
            //     City = registerDto.City,
            //     Country = registerDto.Country,
            //     DateOfBirth = (DateOnly)registerDto.DateOfBirth
            // };

            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username.ToLower();
            user.PasswordHash = hMAC.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hMAC.Key;
            _logger.LogInformation("========================= Register details after mapping with entity");
            _logger.LogJson(user);
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Register Api call responded");
            //_logger.LogJson(registerDto);
            return new UserDto
            {
                Username = registerDto.Username,
                Token = _tokenService.CreateToken(user),
                KnownAs= registerDto.KnownAs,
                Gender = registerDto.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                            .Include(p => p.Photos)
                            .SingleOrDefaultAsync(u => u.UserName == loginDto.Username.ToLower());
            
            if(user == null)
                return Unauthorized("Invalid User");

            using var hMAC = new HMACSHA512(user.PasswordSalt);
            var computHash = hMAC.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for(int i = 0; i < computHash.Length; i++)
            {
                if(computHash[i] != user.PasswordHash[i])
                    return Unauthorized("Invalid password");
            }

            return new UserDto
            {
                Username = loginDto.Username,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.knownAs,
                Gender = user.Gender
            };
        }
        private async Task<bool> UserExists(string userName)
        {
            return await _context.Users.AnyAsync( u => u.UserName == userName.ToLower());
        }

        
    }
}