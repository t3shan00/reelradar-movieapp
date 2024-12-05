import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/ShowTimes.module.css';
import ShareShowtimeButton from './ShareShowtimeButton';

function ShowTimes() {
    const [cinemaAreas, setCinemaAreas] = useState([]);
    const [currentShows, setCurrentShows] = useState([]);
    const navigate = useNavigate();

    const parseCinemaTheatres = (xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        const theatres = xmlDoc.getElementsByTagName('TheatreArea');
        const tempAreas = [];

        for (let i = 0; i < theatres.length; i++) {
            tempAreas.push({
                id: theatres[i].getElementsByTagName('ID')[0].textContent,
                name: theatres[i].getElementsByTagName('Name')[0].textContent,
            });
        }
        setCinemaAreas(tempAreas);
    };

    useEffect(() => {
        fetch('https://www.finnkino.fi/xml/TheatreAreas/')
            .then((response) => response.text())
            .then((xml) => parseCinemaTheatres(xml))
            .catch((error) => console.log(error));
    }, []);

    const parseCinemaShows = (xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        const shows = xmlDoc.getElementsByTagName('Show');
        const tempShows = [];

        for (let i = 0; i < shows.length; i++) {
            tempShows.push({
                id: shows[i].getElementsByTagName('ID')[0].textContent,
                title: shows[i].getElementsByTagName('Title')[0].textContent,
                startTime: shows[i].getElementsByTagName('dttmShowStart')[0].textContent,
                theatre: shows[i].getElementsByTagName('Theatre')[0].textContent,
                auditorium: shows[i].getElementsByTagName('TheatreAuditorium')[0].textContent,
                imageUrl: shows[i].getElementsByTagName('EventSmallImagePortrait')[0].textContent,
            });
        }
        setCurrentShows(tempShows);
    };

    const fetchCinemaShows = (areaId) => {
        fetch(`https://www.finnkino.fi/xml/Schedule/?area=${areaId}`)
            .then((response) => response.text())
            .then((xml) => parseCinemaShows(xml))
            .catch((error) => console.log(error));
    };

    const handleAreaSelection = (e) => {
        const areaId = e.target.value;
        fetchCinemaShows(areaId);
    };

    const fetchMovieIdByTitle = async (title) => {
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTllNGRmMWY4ZDZhNmE1NDBjY2YyN2JiNmVmYzI1MyIsIm5iZiI6MTczMjAyNTU0Mi43Nzg4NDksInN1YiI6IjY3MzlmODRlNmEwMmEyNGQ3YjIxODE2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fXqSiWv07snaUkxoAsWteUTZNE1hdIuNNodLDtkC1nM'
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].id;
            } else {
                throw new Error('No matching movie found');
            }
        } catch (error) {
            console.error("Error fetching movie ID:", error);
            return null;
        }
    };

    const handleMovieClick = async (title) => {
        const movieId = await fetchMovieIdByTitle(title);
        if (movieId) {
            navigate(`/movie/${movieId}`);
        } else {
            alert('Movie not found');
        }
    };

    return (
        <div className={styles.movieShowtimesContainer}>
            <h1>Movie Showtimes</h1>
            <label htmlFor="cinema-select">Select Area:</label>
            <select id="cinema-select" onChange={handleAreaSelection}>
                <option value="">--Choose an Area--</option>
                {cinemaAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                        {area.name}
                    </option>
                ))}
            </select>

            <div className={styles.showtimesDisplay}>
                {currentShows.length > 0 ? (
                    currentShows.map((show) => (
                        <div key={show.id} className={styles.showItem}>
                            <img src={show.imageUrl} alt={show.title} />
                            <div className={styles.showInfo}>
                                <h3>
                                    <Link to="#" onClick={() => handleMovieClick(show.title)}>
                                        {show.title}
                                    </Link>
                                </h3>
                                <p>Cinema: {show.theatre}</p>
                                <p>Auditorium: {show.auditorium}</p>
                                <p>Start Time: {new Date(show.startTime).toLocaleString()}</p>
                                <ShareShowtimeButton showtime={show} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No showtimes available for the selected area.</p>
                )}
            </div>
        </div>
    );
}

export default ShowTimes;