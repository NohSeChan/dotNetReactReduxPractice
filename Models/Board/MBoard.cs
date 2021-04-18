using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Project1.Services.SQL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Project1.Models.Board
{
    public class MBoard
    {
        public int BOARDNO { get; set; }
        public string BOARDTITLE { get; set; }
        public string BOARDAUTHOR { get; set; }
        public string BOARDCONTENTS { get; set; }
        public int BOARDVIEW { get; set; }
        public DateTime CREATE_DATETIME { get; set; }
        public string BOARDUSERID { get; set; }

        public async static Task<IEnumerable<MBoard>> GetBoardList(int page)
        {
            return await MSSQLDapper.Instance.GetFromXmlQueryAsync<MBoard>("Board.xml", "SelectBoardList", new { page = page});
        }

        public async Task<int> InsertBoard(MSSQLDapper mssqlDapper)
        {
            return await mssqlDapper.ExecuteFromXmlAsync("Board.xml", "InsertBoard", this);
        }

        public async static Task<int> GetMaxBoardNo()
        {
            return (await MSSQLDapper.Instance.GetFromXmlQueryAsync<int>("Board.xml", "SelectMaxBoardNo", new { })).FirstOrDefault();
        }

        public async static Task<MBoard> GetBoardDetail(int boardNo)
        {
            return (await MSSQLDapper.Instance.GetFromXmlQueryAsync<MBoard>("Board.xml", "SelectBoardDetail", new { BOARDNO = boardNo })).FirstOrDefault();
        }

        public async Task<int> UpdateBoard(MSSQLDapper mssqlDapper)
        {
            return await mssqlDapper.ExecuteFromXmlAsync("Board.xml", "UpdateBoard", this);
        }

        public async Task<int> DeleteBoard(MSSQLDapper mssqlDapper)
        {
            return await mssqlDapper.ExecuteFromXmlAsync("Board.xml", "DeleteBoard", this);
        }
    }
}
