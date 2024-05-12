using System.Text.Json;
using API.Helpers;

namespace API.Extensions
{
    public static class HttpHeaderExtensions
    {
        public static void AddHttpPaginationHeader(this HttpResponse response, Pagination pagination)
        {
            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(pagination, jsonOptions));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}