using Project1.Services.SQL;
using Project1.Services.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project1.Models.User
{
    public class MUser
    {
        public string Id { get; set; }
        public string PASSWORD { get; set; }
        public string PASSWORD2 { get; set; }
        public string USERNAME { get; set; }

        public static async Task<MUser> GetUserById(string id)
        {
            return (await MSSQLDapper.Instance.GetFromXmlQueryAsync<MUser>("User.xml", "GetUserById", new { id = id })).FirstOrDefault();
        }

        public static async Task<MUser> GetUserByPw(string id, string password)
        {
            string shaPassword = UtilSHA256.SHA256Hash(password);

            return (await MSSQLDapper.Instance.GetFromXmlQueryAsync<MUser>("User.xml", "GetUserByPw", new { id = id, password = shaPassword })).FirstOrDefault();
        }

        public async Task<int> InsertUser(MSSQLDapper mssqlDapper)
        {
            string shaPassword = UtilSHA256.SHA256Hash(this.PASSWORD2);
            this.PASSWORD2 = shaPassword;

            return await mssqlDapper.ExecuteFromXmlAsync("User.xml", "InsertUser", this);
        }

        public static async Task<MUser> GetUserByUserName(string userName)
        {
            return (await MSSQLDapper.Instance.GetFromXmlQueryAsync<MUser>("User.xml", "GetUserByUserName", new { userName = userName })).FirstOrDefault();
        }
    }
}
