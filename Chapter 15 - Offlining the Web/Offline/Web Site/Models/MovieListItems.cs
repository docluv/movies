using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_Site.Models
{
    public class MovieListItems
    {

        public  MovieListItems()
        {
            Movies.Add(new MovieListItem());
        }

        public MovieListItems(List<MovieListItem> movies)
        {

            foreach (var movie in movies)
            {
                Movies.Add(movie);
            }
            
        }

        private List<MovieListItem> _Movies;

        public List<MovieListItem> Movies { get; set; }


    }
}