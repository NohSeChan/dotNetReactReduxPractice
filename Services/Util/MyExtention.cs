using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Project1.Services.Util
{
    public static class MyExtention
    {
        public enum MyUserType
        {
              UID,
              USERNAME,
        }

        public static void AddClaim(this ClaimsIdentity identity, MyUserType myUserType, string str)
        {
            identity.AddClaim(new Claim(MyExtention.EnumToString(myUserType), str));
        }

        public static string EnumToString(MyUserType myUserType)
        {
            switch (myUserType)
            {
                case MyUserType.UID:
                    return "UID";
                case MyUserType.USERNAME:
                    return "USERNAME";
            }

            return null;
        }
    }
}
