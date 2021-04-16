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

        [HttpPost]
        [Route("WriteBoard")]
        public async Task<IActionResult> WriteBoard([FromBody] MBoard input)
        {

            try
            {
                _mssqlDapper.BeginTransaction();

                int r = await input.InsertBoard(_mssqlDapper);

                if (r < 1)
                {
                    throw new Exception("게시글 작성 중 오류가 발생했습니다. 관리자에게 문의해주세요");
                }

                _mssqlDapper.Commit();
                return Json(new { msg = "OK" });
            }
            catch (Exception ex)
            {
                _mssqlDapper.Rollback();
                return Json(new { msg = "FAIL", exceptionMsg = ex.Message });
            }
        }
    }
}
