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
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTllNGRmMWY4ZDZhNmE1NDBjY2YyN2JiNmVmYzI1MyIsIm5iZiI6MTczMjAyNTU0Mi43Nzg4NDksInN1YiI6IjY3MzlmODRlNmEwMmEyNGQ3YjIxODE2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fXqSiWv07snaUkxoAsWteUTZNE1hdIuNNodLDtkC1nM'
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
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
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
            {/* <h3 className={styles.movieTitle}>{movie.title}</h3> */}
          </div>
        ))}
      </Slider>
      <div className={styles.separator}></div>
    </div>
  );
}

export default UpcomingMovies;