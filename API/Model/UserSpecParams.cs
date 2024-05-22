using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;

namespace API.Model
{
    public class UserSpecParams : PaginationParams
    {
        

        public string  UserName { get; set; }
        public string  Gender { get; set; }

        public int AgeFrom { get; set; } = 18;

        public int AgeTo { get; set; } = 100;

        public string OrderBy { get; set; }
    }
}