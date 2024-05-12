using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Serilog;
using Serilog.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Xml.Serialization;


namespace ATT.Logger.Library
{
    public class LoggerService : ILoggerService
    {
        private readonly ILogger<LoggerService> _logger;

        //Log.Logger log = new Log.Logger();

        public LoggerService(ILogger<LoggerService> logger, IConfiguration configuration)
        {
           
            //IConfigurationBuilder builder = new ConfigurationBuilder();
            //builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.logger.json"));
            _logger = logger;           
        }
             

        public void LogError(string message)
        {
           _logger.LogError(message);
        }

        public void LogInformation(string message)
        {
            _logger.LogInformation(message);
        }

        public void LogJson(object message)
        {
            if(message == null)
            {
                _logger.LogInformation("Cannot Dump Null Object!");
            }

            string jsonString = JsonConvert.SerializeObject(message, Newtonsoft.Json.Formatting.Indented);

            _logger.LogInformation($"{jsonString}");
        }

        public void LogXML(Object messageObj)
        {
            if(messageObj == null)
            {
                _logger.LogInformation("Cannot Dump Null Object!");
            }

            XmlSerializer xmlSerializer = new XmlSerializer(typeof(LoggerService));
            var xmlData = string.Empty;

            using(var xmlstringWriter = new StringWriter())
            {
                xmlSerializer.Serialize(xmlstringWriter, messageObj);
                xmlData = xmlstringWriter.ToString();
            }
            _logger.LogInformation(xmlData);
        }

        public void LogWarning(string message)
        {
            _logger.LogWarning(message);
        }
    }
}
