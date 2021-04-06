using Microsoft.AspNetCore.Mvc;
using Project1.Models.Test;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project1.Controllers
{
    public class TestController : Controller
    {
        public async Task<IActionResult> Index()
        {
            IEnumerable<Test> model = await Test.GetQueryTest();

            foreach (Test t in model)
            {
                Console.WriteLine(t.A);
            }
            return View();
        }
    }
}
