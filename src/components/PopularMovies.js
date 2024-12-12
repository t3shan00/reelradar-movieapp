import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom'; 
import styles from './styles/PopularMovies.module.css';

function PopularMovies({ movies }) {
  const navigate = useNavigate();

  const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  centerMode: true,
  variableWidth: false,
  slidesToShow: 5,
  autoplay: true,
  autoplaySpeed: 4000,
  responsive: [
    {
      breakpoint: 1800,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={styles.popularMoviesSlider}>
      <h2 className={styles.popularMoviesTitle}>Popular Movies</h2>
      <div className={styles.separator}></div>
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.popularMovieCard} onClick={() => handleMovieClick(movie.id)}> {/* Make card clickable */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className={styles.popularMoviePoster}
            />
            {/* <h3 className={styles.movieTitle}>{movie.title}</h3> */}
          </div>
        ))}
      </Slider>
      <div className={styles.separator}></div>
    </div>
  );
}

export default PopularMovies;