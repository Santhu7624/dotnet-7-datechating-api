using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultcontext = await next();
            if(!resultcontext.HttpContext.User.Identity.IsAuthenticated) return;

            var userRepo = resultcontext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
            var userId = resultcontext.HttpContext.User.GetUserId();
            var user = await userRepo.GetUserByIdAsync(userId);

            user.LastActive = DateTime.UtcNow;

            await userRepo.SaveAllAsync();
        }
    }
}