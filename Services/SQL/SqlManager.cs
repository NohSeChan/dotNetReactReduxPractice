using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;

namespace Project1.Services.SQL
{
    // SQL/*.xml 파일의 쿼리를 Dictionary에 저장하는 클래스
    public class SqlManager
    {
        public static string RootPath { get; set; }
        private Dictionary<string, string> _sqlDictionary = new Dictionary<string, string>();
        private string _xmlPath = null;

        public SqlManager(string xmlFile)
        {
            _xmlPath = Path.Combine(RootPath, "Services", "SQL", "Query", xmlFile);
            DictionarySetting();
        }

        private void DictionarySetting()
        {
            XmlDocument xml = new XmlDocument();
            xml.LoadXml(File.ReadAllText(_xmlPath));

            _sqlDictionary.Clear();
            foreach (XmlNode node in xml["mapper"].ChildNodes)
            {
                _sqlDictionary[node.Attributes["id"].Value] = node.InnerText.Trim();
            }
        }

        public string GetQuery(string sqlId)
        {
            if (_sqlDictionary.Count == 0) DictionarySetting();

            return _sqlDictionary[sqlId];
        }
    }
}
