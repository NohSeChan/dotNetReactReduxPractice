using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Project1.Services
{
    public class UserSetting
    {
        public Dictionary<string, string> ConnectionString = new Dictionary<string, string>();
        static string settingFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "usersetting.json");

        public static UserSetting GetUserSetting()
        {
            return JsonConvert.DeserializeObject<UserSetting>(File.ReadAllText(settingFilePath));
        }
    }
}
