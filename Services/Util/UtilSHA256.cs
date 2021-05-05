using System.Security.Cryptography;
using System.Text;

namespace Project1.Services.Util
{
    public class UtilSHA256
    {
        public static string SHA256Hash(string data)
        {
            SHA256 sha = new SHA256Managed();
            byte[] hash = sha.ComputeHash(Encoding.ASCII.GetBytes(data));
            StringBuilder stringBuilder = new StringBuilder();
            foreach (byte b in hash)
            {
                // {0:x2} 의미 : 바이트값을 16진수로 전환
                stringBuilder.AppendFormat("{0:x2}", b);
            }
            return stringBuilder.ToString();
        }
    }
}
