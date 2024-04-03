using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Error
{
    public class APIException
    {
        
        public APIException(string errorMessage, int errorCode, string errorDetails) 
        {
            ErrorMessage = errorMessage;
            ErrorCode = errorCode;
            ErrorDetails = errorDetails;
   
        }
        public string ErrorMessage { get; set; }

        public int ErrorCode { get; set; }

        public string ErrorDetails { get; set; }
    }
}