using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private SymmetricSecurityKey _key;
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            
            _config = config;
        }
        public string CreateToken(AppUser user)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:TokenKey"]));

            var signCeredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new (JwtRegisteredClaimNames.UniqueName, user.UserName),
                new (JwtRegisteredClaimNames.NameId, user.Id.ToString())

            };

            // var token = new JwtSecurityToken(_config["Jwt:Issuer"],
            //     _config["Jwt:Audience"],
            //     claims,
            //     expires: DateTime.Now.AddDays(15),
            //     signingCredentials: signCeredentials);


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                //NotBefore = DateTime.Now.AddSeconds(-30),
                Expires =DateTime.Now.AddDays(3),
                SigningCredentials = signCeredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

        }
    }
}