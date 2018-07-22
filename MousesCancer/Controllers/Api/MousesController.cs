using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Xml;
using System.Xml.Linq;
using Newtonsoft.Json;

namespace MousesCancer.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/mouses")]
    public class MousesController : Controller
    {
        public async Task<IActionResult> Get()
        {
            var result = new Dictionary<string, double>();

            string strFilePath = "http://91.232.241.66:92/api/v1/study/89b4effb-40f8-44d9-ba25-c9cbe7602a95/measurements/tasks/3ba2733b-6274-4bee-93ac-6af4eab90e72/?authorization=Basic%20dGVzdF92YWNhbnRpb246dGVzdF92YWNhbnRpb24=";
            string xmlStr = "";
            HttpClient h = new HttpClient();
            var xmlDoc = new XmlDocument();

            xmlStr = await h.GetStringAsync(strFilePath);

            xmlDoc.LoadXml(xmlStr);
            var sessions = xmlDoc.GetElementsByTagName("session");
            foreach (XmlNode session in sessions)
            {
                DateTime date = DateTime.ParseExact(session.ChildNodes[0].InnerText,
                    "MM/dd/yyyy HH:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture);

                var datums = new List<double>();
                foreach (XmlElement xmlElement in session.LastChild)
                {
                    datums.Add(Convert.ToDouble(xmlElement.LastChild.ChildNodes[0].ChildNodes[0].InnerText, System.Globalization.CultureInfo.InvariantCulture));
                }

                result.Add(date.ToString("yyyy-MM-dd"), datums.Average());
            }
            return Json(result);
        }
    }
}