using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class BuggyController : BaseApiController
    {
        public DataContext _context { get; }

        public BuggyController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "ok";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var contextUser = _context.Users.Find(-1);

            if(contextUser == null) return NotFound();

            return contextUser;
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var contextuser = _context.Users.Find(-1);

            var user = contextuser.ToString();

            return user;
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("Bad request");
        }
    }
}