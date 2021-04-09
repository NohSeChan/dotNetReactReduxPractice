using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Project1.Models.Test;
using Project1.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Project1.Controllers
{
    public class LoginController : Controller
    {
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> LoginPost([FromBody] User input)
        {


            ClaimsIdentity identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, input.Id));
            identity.AddClaim(new Claim(ClaimTypes.Name, input.Id));

            ClaimsPrincipal principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return Json( new  { msg = "OK"});
        }
    }
}
