using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.OpenApi.Models;

namespace API.Extensions
{
    public static class SwaggerServiceExtension
    {
        public static IServiceCollection AddSwaggerService(this IServiceCollection services, IConfiguration config)
        {
            services.AddSwaggerGen(options => {
                
                options.SwaggerDoc("v1", new OpenApiInfo{
                    Title = " My API",
                    Version = "Version1",
                    
                });

                options.AddSecurityDefinition("JWT", new OpenApiSecurityScheme{
                    In = ParameterLocation.Header,//ParameterLocation.Header,
                    BearerFormat = "JWT",
                    Description = "Please insert JWT with Bearer into field",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement{
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                            
                        },
                        //new string[] {}
                        Array.Empty<string>()
                    }
                });
                
            });

            return services;
        }
    }
}