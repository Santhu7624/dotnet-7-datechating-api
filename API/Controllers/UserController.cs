
using System.Security.Claims;
using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
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

        private readonly IPhotoService _photoService;

       
        public UserController(IUserRepository iUserRepo, IMapper mapper, IPhotoService photoService)
        {
            _userRepo = iUserRepo;
            _mapper = mapper;
            _photoService = photoService;
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
            var username = User.GetUserName();
            var user = await _userRepo.GetMemberAsync(username);

            if(user ==null) return NotFound();

            _mapper.Map(memberupdatedDto, user);

            if(await _userRepo.SaveAllAsync()) return NoContent();

            return BadRequest();
        }


        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var username = User.GetUserName();

            var user = await _userRepo.GetUserByUsernameAsync(User.GetUserName());

            if(user == null) NotFound();

            var result = await _photoService.UploadPhotoAsync(file);

            if(result.Error != null)    return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                Publicid = result.PublicId
            };

            if(user.Photos.Count == 0 ) photo.IsMain =true;

            user.Photos.Add(photo);

            if(await _userRepo.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetUser), new {username = user.UserName}, _mapper.Map<PhotoDto>(photo));
                // return _mapper.Map<PhotoDto>(photo);
            }               

            return BadRequest("Photo upload failed");
        }

        [HttpPut("set-main-photo/{photoId}")]

        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUserName());

            if(user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if(photo == null) return NotFound();

            if(photo.IsMain) return BadRequest("This is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x=> x.IsMain);

            if(currentMain != null) currentMain.IsMain =false;

            photo.IsMain =true;

            if(await _userRepo.SaveAllAsync()) return NoContent();

            return BadRequest("Probelm in setting the main photo");

        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUserName());

            if(user == null) NotFound();

            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            var result = await _photoService.DeletePhotoAsync(photo.Publicid);

            if(photo.IsMain) return BadRequest("You can not delte main photo");

            if(result.Error != null) return BadRequest(result.Error.Message);

            user.Photos.Remove(photo);

            if(await _userRepo.SaveAllAsync()) return Ok();      

            return BadRequest("Photo deletion failed");          
        }
    }
}