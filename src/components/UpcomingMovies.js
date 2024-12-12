import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import styles from './styles/UpcomingMovies.module.css';

const UpcomingMovies = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      const url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_TMDB_BEARER_TOKEN}`
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setUpcomingMovies(data.results);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      }
    };

    fetchUpcomingMovies();
  }, []);

  const settings = {
    dots: false,
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
    ],
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={styles.upcomingMoviesSlider}>
      <h2 className={styles.upcomingMoviesTitle}>Upcoming Movies</h2>
      <div className={styles.separator}></div>
      <Slider {...settings}>
        {upcomingMovies.map((movie) => (
          <div key={movie.id} className={styles.upcomingMovieCard} onClick={() => handleMovieClick(movie.id)}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className={styles.upcomingMoviePoster}
            />
          </div>
        ))}
      </Slider>
      <div className={styles.separator}></div>
    </div>
  );
}

export default UpcomingMovies;