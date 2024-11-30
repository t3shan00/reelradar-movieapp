import React, { useEffect, useState } from 'react';
import "./styles/ShowTimes.css";
import ShareShowtimeButton from './ShareShowtimeButton';

function ShowTimes() {
    const [cinemaAreas, setCinemaAreas] = useState([]);
    const [currentArea, setCurrentArea] = useState('');
    const [currentShows, setCurrentShows] = useState([]);

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
        setCurrentArea(areaId);
        fetchCinemaShows(areaId);
    };

    return (
        <div className='movie-showtimes-container'>
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

            <div className="showtimes-display">
                {currentShows.length > 0 ? (
                    currentShows.map((show) => (
                        <div key={show.id} className="show-item">
                            <img src={show.imageUrl} alt={show.title} />
                            <div className='show-info'>
                                <h3>{show.title}</h3>
                                <p>Cinema: {show.theatre}</p>
                                <p>Auditorium: {show.auditorium}</p>
                                <p>Start Time: {new Date(show.startTime).toLocaleString()}</p>
                                <ShareShowtimeButton showtime={show} />
                            </div>
                        </div>
                    ))
                ) : ("")}
            </div>
        </div>
    );
}

export default ShowTimes;