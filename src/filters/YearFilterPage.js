import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './YearFilterPage.module.css';

const YearFilterPage = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [movies, setMovies] = useState([]);
  const [filterType, setFilterType] = useState('exact');
  const [yearRange, setYearRange] = useState({ start: null, end: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = '6e9e4df1f8d6a6a540ccf27bb6efc253';

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i);
    setYears(yearsArray);
  }, []);

  const fetchMovies = useCallback(async (page = 1) => {
    if (!selectedYear && filterType !== 'range') return;

    setIsLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`;
      
      switch (filterType) {
        case 'exact':
          url += `&primary_release_year=${selectedYear}`;
          break;
        case 'older':
          url += `&primary_release_date.lte=${selectedYear}-12-31`;
          break;
        case 'newer':
          url += `&primary_release_date.gte=${selectedYear}-01-01`;
          break;
        case 'range':
          if (yearRange.start && yearRange.end) {
            url += `&primary_release_date.gte=${yearRange.start}-01-01&primary_release_date.lte=${yearRange.end}-12-31`;
          }
          break;
        default:
          break;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, filterType, yearRange]);

  useEffect(() => {
    if (selectedYear !== null || (filterType === 'range' && yearRange.start && yearRange.end)) {
      fetchMovies(currentPage);
    }
  }, [selectedYear, filterType, yearRange, currentPage, fetchMovies]);

  //pagination
  const paginationRange = useMemo(() => {
    const delta = 2;
    const range = [];
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    return {
      first: 1,
      last: totalPages,
      range,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages
    };
  }, [currentPage, totalPages]);

  return (
    <div className={styles.yearFilterPage}>
      <h1>Filter Movies by Year</h1>
      
      {/* Filter Type Selector */}
      <div className={styles.filterOptions}>
        {['exact', 'older', 'newer', 'range'].map(type => (
          <label key={type}>
            <input
              type="radio"
              value={type}
              checked={filterType === type}
              onChange={() => {
                setFilterType(type);
                setMovies([]);
                setCurrentPage(1);
              }}
            />
            {type === 'exact' && 'Exact Year'}
            {type === 'older' && 'Older Than'}
            {type === 'newer' && 'Newer Than'}
            {type === 'range' && 'Choose Range'}
          </label>
        ))}
      </div>

      {/* Year Range Inputs for Range Filter */}
      {filterType === 'range' && (
        <div className={styles.yearRangeInputs}>
          <input 
            type="number" 
            placeholder="Start Year" 
            onChange={(e) => setYearRange(prev => ({ ...prev, start: e.target.value }))} 
          />
          <input 
            type="number" 
            placeholder="End Year" 
            onChange={(e) => setYearRange(prev => ({ ...prev, end: e.target.value }))} 
          />
          <button 
            onClick={() => fetchMovies()}
            className={styles.yearButton}
          >
            Apply Range
          </button>
        </div>
      )}

      {/* Year Selector */}
      <div className={styles.yearList}>
        {years.map(year => (
          <button 
            key={year} 
            onClick={() => {
              setSelectedYear(year);
              setCurrentPage(1);
            }}
            className={`${styles.yearButton} ${selectedYear === year ? styles.selected : ''}`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{textAlign: 'center', color: 'black', padding: '2rem'}}>Loading movies...</div>
      )}

      {/* Movies Grid */}
      {!isLoading && movies.length > 0 && (
        <div className={styles.moviesSection}>
          <div className={styles.moviesList}>
            {movies.slice(0, 16).map(movie => (
              <div 
                key={movie.id} 
                className={styles.movieCard}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                />
                <h3>{movie.title}</h3>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button 
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!paginationRange.hasPrevious}
            >
              <ChevronLeft />
            </button>

            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!paginationRange.hasNext}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* No Movies Found State */}
      {!isLoading && movies.length === 0 && (
        <div style={{textAlign: 'center', color: 'black', padding: '2rem'}}>
          No movies found for the selected criteria.
        </div>
      )}
    </div>
  );
};

export default YearFilterPage;