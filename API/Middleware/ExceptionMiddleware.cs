using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Error;
using SQLitePCL;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {

        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next,ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try{
                await _next(context);
            }catch(Exception ex){
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var exc = _env.IsDevelopment()
                            ? new APIException(ex.Message, (int)HttpStatusCode.InternalServerError, ex.ToString()):
                             new APIException(ex.Message, (int)HttpStatusCode.InternalServerError, "Internal Server Error");

                var options = new JsonSerializerOptions{
                    PropertyNamingPolicy =JsonNamingPolicy.CamelCase
                };

                var jsonObj = JsonSerializer.Serialize(exc, options);

                await context.Response.WriteAsync(jsonObj);
            }
        }
    }
}