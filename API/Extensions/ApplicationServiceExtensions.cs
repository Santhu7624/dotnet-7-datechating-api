using API.Data;
using API.DTO;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<DataContext>(options => {
                var connString = config.GetConnectionString("DefaultConnection");
                options.UseSqlite(connString);
                
                /*
                * Microsoft sql server (Microsoft.EntityFrameworkCore.SqlServer)
                */
                //options.UseSqlServer(connString);
            });

            services.AddCors(options => {
                options.AddPolicy("CORSPolicy", builder => {
                    builder.AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials()
                            .SetIsOriginAllowed((hosts) => true);
                });
             });

             services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

             return services;
        }
    }
}