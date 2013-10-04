using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages;

namespace Web_Site.Models
{
    public static class SPAHelper
    {

        public static IHtmlString RenderRequiredViews(this HtmlHelper helper, long prevTime, string[] viewNames)
        {

            var htmlViews = "";

            foreach (var item in viewNames)
            {
                var fileTime = File.GetLastWriteTimeUtc(item).Ticks;

                if (prevTime < fileTime)
                {
                    htmlViews += helper.Raw(File.ReadAllText(item));
                }
   
            }

            return helper.Raw(htmlViews);

        }


        public static IHtmlString RenderRequiredView(this HtmlHelper helper, long prevTime, string viewName)
        {
            var fileTime = File.GetLastWriteTimeUtc(viewName).Ticks;

            if (prevTime < fileTime)
            {
                return helper.Raw(File.ReadAllText(viewName));
            }

            return null;

        }

    }
}