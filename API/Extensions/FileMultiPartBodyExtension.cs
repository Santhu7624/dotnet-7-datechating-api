
using Microsoft.AspNetCore.Http.Features;

namespace API.Extensions
{
    public static class FileMultiPartBodyExtension
    {
        public static IServiceCollection AddMultiPartBodyLength(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<FormOptions>(options =>
            {
                options.ValueLengthLimit = int.MaxValue;
                options.MultipartBodyLengthLimit = int.MaxValue;
                options.MemoryBufferThreshold = int.MaxValue;
            });

            return services;
        }
    }
}