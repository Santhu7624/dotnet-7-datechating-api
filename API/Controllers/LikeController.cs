using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Model;
using ATT.Logger.Library;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class LikeController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        
        private readonly IMapper _mapper;
        private readonly ILoggerService _logger;
        public LikeController(IUnitOfWork uow, IMapper mapper, ILoggerService logger)
        {
            _mapper = mapper;
            _uow = uow;           
            _logger = logger;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _uow.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _uow.LikeRepository.GetUserWithLikes(sourceUserId);

            if(likedUser == null ) return NotFound();

            if(sourceUser.UserName == username) return BadRequest("You cannot like yourself");

            var userLike = await _uow.LikeRepository.GetUserLike(sourceUserId, likedUser.Id);

            if(userLike != null) return BadRequest("You already like this user");

            userLike = new UserLike{
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id
            };
            sourceUser.LikedUsers.Add(userLike);

            if(await _uow.Complete()) return Ok();

            return BadRequest("Failed to like user");

        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {
            _logger.LogInformation("======================= GetUser API Call Received. predicate : ");
            _logger.LogJson(likesParams);

            likesParams.UserId = User.GetUserId();

            var users = await _uow.LikeRepository.GetUserLikes(likesParams);
            Response.AddHttpPaginationHeader(new Pagination(users.Currentpage, users.PageSize, users.TotalCount, users.TotalPages));

            _logger.LogInformation("======================= GetUser API Call Response");
            _logger.LogJson(users);
            
            return Ok(users);
        }
    }
}