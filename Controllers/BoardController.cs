using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project1.Models.Board;
using Project1.Models.User;
using Project1.Services.SQL;
using Project1.Services.Util;
using System;
using System.Security.Claims;
using System.Threading.Tasks;


namespace Project1.Controllers
{
    [Authorize]
    public class BoardController : Controller
    {
        private MSSQLDapper _mssqlDapper;

        public BoardController(MSSQLDapper mssqlDapper)
        {
            _mssqlDapper = mssqlDapper;
        }

        [HttpGet]
        [Route("BoardList")]
        [AllowAnonymous]
        public async Task<IActionResult> BoardList(int pageNum = 1)
        {
            try 
            {
                var boardList = await MBoard.GetBoardList(pageNum);

                if (boardList != null)
                {
                    return Json(new { msg = "OK", boardList = boardList });
                } 

                else
                {
                    return Json(new { msg = "FAIL", exceptionMsg = "게시판 리스트 요청 오류입니다" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { msg = "FAIL", exceptionMsg = ex.Message });
            }
        }
    }
}
