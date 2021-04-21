using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Project1.Models.Board;
using Project1.Models.User;
using Project1.Services.SQL;
using Project1.Services.Util;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;


namespace Project1.Controllers
{
    [Authorize]
    public class BoardController : Controller
    {
        private MSSQLDapper _mssqlDapper;
        private IHttpContextAccessor _httpContextAccessor;
        private IWebHostEnvironment _webHostEnvironment;

        public BoardController(MSSQLDapper mssqlDapper, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment webHostEnvironment)
        {
            _mssqlDapper = mssqlDapper;
            _httpContextAccessor = httpContextAccessor;
            _webHostEnvironment = webHostEnvironment;
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
                var principal = new ClaimsPrincipal(_httpContextAccessor.HttpContext.User.Identity);
                var loginId = principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
                input.BOARDUSERID = loginId;

                _mssqlDapper.BeginTransaction();
                int r = await input.InsertBoard(_mssqlDapper);

                if (r < 1)
                {
                    throw new Exception("게시글 작성 중 오류가 발생했습니다. 관리자에게 문의해주세요");
                }

                _mssqlDapper.Commit();

                //int maxBoardNo = await MBoard.GetMaxBoardNo();
                //return Json(new { msg = "OK", maxBoardNo=maxBoardNo });

                
                return Json(new { msg = "OK"});
            }
            catch (Exception ex)
            {
                _mssqlDapper.Rollback();
                return Json(new { msg = "FAIL", exceptionMsg = ex.Message });
            }
        }

        [HttpGet]
        [Route("BoardDetail")]
        [AllowAnonymous]
        public async Task<IActionResult> BoardDetail(int boardNo)
        {
            try
            {
                _mssqlDapper.BeginTransaction();
                var r = await MBoard.UpdateBoardView(_mssqlDapper, boardNo);
                
                if (r < 1)
                {
                    throw new Exception("조회수 갱신중에 오류가 발생했습니다. 관리자에게 문의해주세요");
                }
                _mssqlDapper.Commit();

                var boardDetail = await MBoard.GetBoardDetail(boardNo);
                if (boardDetail != null && r == 1)
                {
                    return Json(new { msg = "OK", boardDetail= boardDetail });
                }
                else
                {
                    return Json(new { msg = "FAIL", exceptionMsg = "조회된 게시글이 없습니다" });
                }
            }
            catch (Exception ex)
            {
                _mssqlDapper.Rollback();
                return Json(new { msg = "FAIL", exceptionMsg = ex.Message });
            }
        }


        
        [HttpPost]
        [Route("UpdateBoard")]
        public async Task<IActionResult> UpdateBoard([FromBody] MBoard input)
        {
            try
            {
                _mssqlDapper.BeginTransaction();

                int r = await input.UpdateBoard(_mssqlDapper);

                if (r < 1)
                {
                    throw new Exception("게시글 수정 중 오류가 발생했습니다. 관리자에게 문의해주세요");
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


        [HttpPost]
        [Route("DeleteBoard")]
        public async Task<IActionResult> DeleteBoard([FromBody] MBoard input)
        {
            try
            {
                _mssqlDapper.BeginTransaction();

                int r = await input.DeleteBoard(_mssqlDapper);

                if (r < 1)
                {
                    throw new Exception("게시글 삭제 중 오류가 발생했습니다. 관리자에게 문의해주세요");
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

        [HttpGet]
        [Route("GetBoardReply")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBoardReply(int boardNo)
        {
            try
            {
                var boardReply = await MBoard.GetBoardReply(boardNo);
                if (boardReply != null)
                {
                    return Json(new { msg = "OK", boardReply = boardReply });
                }
                else
                {
                    return Json(new { msg = "EMPTY"});
                }
            }
            catch (Exception ex)
            {
                return Json(new { msg = "FAIL", exceptionMsg = ex.Message });
            }
        }

        [HttpPost]
        [Route("WriteBoardReply")]
        public async Task<IActionResult> WriteBoardReply([FromBody] MBoard input)
        {
            try
            {
                var principal = new ClaimsPrincipal(_httpContextAccessor.HttpContext.User.Identity);
                var loginUsername = principal.Claims.FirstOrDefault(x => x.Type == "USERNAME")?.Value;
                input.BOARDREPLYUSERNAME = loginUsername;

                _mssqlDapper.BeginTransaction();
                int r = await input.InsertBoardReply(_mssqlDapper);

                if (r < 1)
                {
                    throw new Exception("댓글 작성 중 오류가 발생했습니다. 관리자에게 문의해주세요");
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

        [HttpPost]
        [Route("WriteBoardReplyReply")]
        public async Task<IActionResult> WriteBoardReplyReply([FromBody] MBoard input)
        {

            try
            {
                var principal = new ClaimsPrincipal(_httpContextAccessor.HttpContext.User.Identity);
                var loginUsername = principal.Claims.FirstOrDefault(x => x.Type == "USERNAME")?.Value;
                input.BOARDREPLYUSERNAME = loginUsername;

                _mssqlDapper.BeginTransaction();
                int r = await input.InsertBoardReplyReply(_mssqlDapper);

                if (r < 1)
                {
                    throw new Exception("댓글 작성 중 오류가 발생했습니다. 관리자에게 문의해주세요");
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


        [HttpPost]
        [RequestSizeLimit(52428800)] //50MB
        [Route("UploadSummernoteImageFile")]
        public async Task<IActionResult> UploadSummernoteImageFile()
        {
            try
            {
                //if (json_data.IsNull() == false)
                //{
                //    input = JsonConvert.DeserializeObject<MTestJson>(json_data);
                //}

                /*
                 * 파일 저장위치는 저장 테스트용이며
                 * 실제 저장시는 파일명 중복 검증 및 업로드 파일형식 (exe, js 등) 제한하여야합니다
                 * 파일명 중복문제 -> DB를 통한 filename 및 fullpath 분리관리로 해결 등
                 */

                foreach (var file in Request.Form.Files)
                {
                    if (file.Length > 0)
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var filePath = Path.Combine(_webHostEnvironment.ContentRootPath, "UploadFiles", fileName); //파일 저장위치는 소스와 분리해야하나 일단 테스트용으로 놔둠;;

                        Directory.CreateDirectory(Path.GetDirectoryName(filePath)); //exist 하고 없으면 create 함

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        return Json(new { url = "http://"+ Request.Host.Value+ "/UploadFiles/" + fileName });
                    }
                }
                return Json(new { });
                
            }
            catch (Exception ex)
            {
                return Json(new { msg = ex.Message });
            }

        }
    }
}
