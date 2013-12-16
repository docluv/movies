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
    var model = new MoviesModel();

    HttpContext.Response.Cache.SetLastModified(DateTime.UtcNow);


    if (SpaHelper.HasEscapeFragment())
    {

        foreach (string key in queryString.AllKeys.Where(key => key != null))
        {
            model.SetRoute(queryString[key]);
        }

        switch (model.MainRoute.ToLower())
        {

            case "":

                break;

            case "movies":

                var movieType = model.movieTypes[model.RouteParams[1]];

                model.Title = movieType;
                model.Description = "Current " + movieType + " movies";
                break;

            case "movie":

                model.Title = Server.UrlDecode(model.RouteParams[1]);
                model.Description = "This is where you would want to include the first paragraph or two of the movie synopsis.";
                break;

            case "about":
                model.Title = "About Modern Movie Web";
                break;

            case "theater":
                model.Title = Server.UrlDecode(model.RouteParams[1]);
                model.Description = "A list of movie showtimes for the " + Server.UrlDecode(model.RouteParams[1]) + " theater.";
                break;

            case "reviews":
                model.Title = "Modern Movie Web Reviews";
                break;

            case "privacy":
                model.Title = "Modern Movie Web Privacy Policy";
                break;

            case "search":
                model.Title = "Search Modern Movie Web";
                break;

            default:
                model.Title = "Modern Movie Web - Not Found";
                model.Description = "It seems you might be lost. Let the Usher Help you find what you are seeking";
                break;
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
