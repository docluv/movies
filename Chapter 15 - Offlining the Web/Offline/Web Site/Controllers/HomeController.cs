using SPAHelper;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web_Site.Models;

namespace Web_Site.Controllers
{
    public class HomeController : Controller
    {
        
        public ActionResult Index()
        {
            NameValueCollection queryString = HttpContext.Request.QueryString;
            var model = new SPAModel();

            if (SpaHelper.HasEscapeFragment())
            {

                foreach (string key in queryString.AllKeys.Where(key => key != null))
                {
                    model.SetRoute(queryString[key]);
                }
            }

            return View(model);
        }

        [HttpPost]
        public ActionResult Review(FormCollection review)
        {

            return new RedirectResult("~", false);
        }

    }
}
