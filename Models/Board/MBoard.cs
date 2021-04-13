using Microsoft.AspNetCore.Mvc;
using Project1.Services.SQL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project1.Models.Board
{
    public class MBoard
    {
        public int BOARDNO { get; set; }
        public string BOARDTITLE { get; set; }
        public string BOARDAUTHOR { get; set; }
        public int BOARDVIEW { get; set; }


        public async static Task<IEnumerable<MBoard>> GetBoardList(int page)
        {
            return await MSSQLDapper.Instance.GetFromXmlQueryAsync<MBoard>("Board.xml", "SelectBoardList", new { page = page});
        }
    }
}
