import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom'; 
import './styles/PopularMovies.css';

function PopularMovies({ movies }) {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    centerMode: true,
    variableWidth: false,
    speed: 500,
    slidesToShow: 5,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
        }
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="popular-movies-slider">
      <h2 className="popular-movies-title">Popular Movies</h2>
      <div className="separator"></div>
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie.id} className="popular-movie-card" onClick={() => handleMovieClick(movie.id)}> {/* Make card clickable */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="popular-movie-poster"
            />
            {/* <h3 className="movie-title">{movie.title}</h3> */}
          </div>
        ))}
      </Slider>
      <div className="separator"></div>
    </div>
  );
}

export default PopularMovies;