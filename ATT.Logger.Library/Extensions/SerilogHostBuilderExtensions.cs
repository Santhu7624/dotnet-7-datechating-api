using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Serilog;
using Microsoft.Extensions.Configuration;

namespace ATT.Logger.Library
{
    public static class SerilogHostBuilderExtensions
    {
        public static IHostBuilder UseSerilogExtension(this IHostBuilder hostBuilder)
        {
            var config = new ConfigurationBuilder()
                   .SetBasePath(Directory.GetCurrentDirectory())
                   .AddJsonFile("appsettings.logger.json", optional: false, reloadOnChange: true)
                   .Build();

            var logger = new LoggerConfiguration()
                    .ReadFrom.Configuration(config)
                    .Enrich.FromLogContext()
                    .CreateLogger();

            
            hostBuilder.UseSerilog(logger);
            return hostBuilder;
        }
    }
}
