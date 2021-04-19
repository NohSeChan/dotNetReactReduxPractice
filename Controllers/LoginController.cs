using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project1.Models.User;
using Project1.Services.SQL;
using Project1.Services.Util;
using System;
using System.Security.Claims;
using System.Threading.Tasks;


namespace Project1.Controllers
{
    [Authorize]
    public class LoginController : Controller
    {
        private MSSQLDapper _mssqlDapper;

        public LoginController(MSSQLDapper mssqlDapper)
        {
            _mssqlDapper = mssqlDapper;
        }

        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginPost([FromBody] MUser input)
        {
            MUser user = await MUser.GetUserById(input.Id);

            if (user == null)
                return Json(new { msg = "FAIL", exceptionMsg = "아이디가 틀렸습니다." });
            else if (await MUser.GetUserByPw(input.Id, input.PASSWORD) == null)
                return Json(new { msg = "FAIL", exceptionMsg = "비밀번호가 틀렸습니다." });

            

            ClaimsIdentity identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, input.Id));
            identity.AddClaim(new Claim(ClaimTypes.Name, input.Id));
            identity.AddClaim(MyExtention.MyUserType.USERNAME, user.USERNAME);

            ClaimsPrincipal principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return Json(new { msg = "OK", id = user.Id, userName = user.USERNAME });
        }

        [HttpPost]
        [Route("Logout")]
        public async Task<IActionResult> LogoutPost()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return Json(new { msg = "OK" });
        }

        [HttpPost]
        [Route("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterPost([FromBody] MUser input)
        {
            if (input.PASSWORD != input.PASSWORD2)
                return Json(new { msg = "비밀번호와 비밀번호 확인을 일치시켜주세요!" });

            try
            {
                _mssqlDapper.BeginTransaction();

                var r = await input.InsertUser(_mssqlDapper);

                if (r < 1)
                    throw new Exception("회원등록오류 관리자에게 문의하세요");

                _mssqlDapper.Commit();

            }
            catch (Exception ex)
            {
                _mssqlDapper.Rollback();
                throw ex;
            }

            

            return await LoginPost(input);
        }

        [HttpGet]
        [Route("SelectUserById")]
        [AllowAnonymous]
        public async Task<IActionResult> SelectUserById(string id)
        {
            try
            {
                var userInfo = await MUser.GetUserById(id);
                
                if (userInfo != null)
                {
                    return Json(new { msg = "DUPLICATE" });
                } else
                {
                    return Json(new { msg = "OK" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { msg = "FAIL", exceptionMsg = ex.Message });
            }
        }

        [HttpGet]
        [Route("SelectUserByUserName")]
        [AllowAnonymous]
        public async Task<IActionResult> SelectUserByUserName(string userName)
        {
            try
            {
                var userInfo = await MUser.GetUserByUserName(userName);

                if (userInfo != null)
                {
                    return Json(new { msg = "DUPLICATE" });
                }
                else
                {
                    return Json(new { msg = "OK" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { msg = "FAIL", exceptionMsg = ex.Message });
            }
        }
    }
}
