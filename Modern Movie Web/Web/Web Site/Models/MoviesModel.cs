using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using SPAHelper;

namespace Web_Site.Models
{
    public class MoviesModel : SPAModel
    {

        public MoviesModel()
        {
            Title = "Modern Web Movies - High Performance Single Page Web Applications";
            Description = "The Modern Movie Web Application is a live demonstration of a Higher Performance Single Page Web Application.";

            movieTypes = new Dictionary<string, string>();

            movieTypes.Add("Opening", "Opening");
            movieTypes.Add("TopBoxOffice", "Top Box Office");
            movieTypes.Add("CommingSoon", "Coming Soon");
            movieTypes.Add("InTheaters", "In Theaters");
        }

        public Dictionary<string, string> movieTypes;


    }
}