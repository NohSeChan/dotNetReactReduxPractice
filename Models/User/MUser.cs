using Project1.Services.SQL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project1.Models.User
{
    public class MUser
    {
        public string Id { get; set; }
        public string Password { get; set; }

        public static async Task<MUser> GetUserById(string id)
        {
            return (await MSSQLDapper.Instance.GetFromXmlQueryAsync<MUser>("User.xml", "GetUserById", new { id = id })).FirstOrDefault();
        }
    }

    
}
