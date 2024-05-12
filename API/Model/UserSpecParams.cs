using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Model
{
    public class UserSpecParams
    {
        private const int MaxPageSize = 30;        
        public int PageIndex {get; set;} = 1;
                
        private int _pageSize = 6;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public string  UserName { get; set; }
        public string  Gender { get; set; }

        public int AgeFrom { get; set; } = 18;

        public int AgeTo { get; set; } = 100;
    }
}