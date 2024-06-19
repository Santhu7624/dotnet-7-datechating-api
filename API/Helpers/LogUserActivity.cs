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

            var uow = resultcontext.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();
            var userId = resultcontext.HttpContext.User.GetUserId();
            var user = await uow.UserRepository.GetUserByIdAsync(userId);

            user.LastActive = DateTime.UtcNow;

            await uow.Complete();
        }
    }
}