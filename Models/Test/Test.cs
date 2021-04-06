using Project1.Services.SQL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project1.Models.Test
{
    public class Test
    {
        public string A { get; set; }

        public static async Task<IEnumerable<Test>> GetQueryTest()
        {
            var model = await MSSQLDapper.Instance.GetQueryAsync<Test>("SELECT A FROM DBO.TEST", new { });

            return model;
        }
    }
}
