﻿using Microsoft.AspNetCore.Authentication;
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
            identity.AddClaim(MyExtention.MyUserType.USER_NAME, user.USER_NAME);

            ClaimsPrincipal principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return Json(new { msg = "OK", id = user.Id, userName = user.USER_NAME });
        }

        [HttpPost]
        [Route("Logout")]
        public async Task<IActionResult> LogoutPost()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return Json(new { msg = "OK" });
        }
    }
}
