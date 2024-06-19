using API.Entities;
using ATT.Logger.Library;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
   
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        private readonly ILoggerService _loggerService;

        public AdminController(UserManager<AppUser> userManager, ILoggerService loggerService)
        {
            _loggerService = loggerService;
            _userManager = userManager;
        }


        [Authorize(Policy ="RequiredAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                                        .OrderBy(u => u.UserName)
                                        .Select(u => new
                                        {
                                            u.Id,
                                            Username = u.UserName,
                                            Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                                        }).ToListAsync();
            return Ok(users);


        }
        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery]string roles)
        {
            _loggerService.LogInformation(roles.ToString());
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select atleast one role");

            var selectedRoles = roles.Split(',').ToArray();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound();

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove roles");

            return Ok(await _userManager.GetRolesAsync(user));

        }

        [Authorize(Policy="ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration() 
        {
            return Ok("Admin and Moderator Can vie this");
        
        }
    }
}
