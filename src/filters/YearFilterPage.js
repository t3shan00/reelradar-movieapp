import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './YearFilterPage.css';

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

  const fetchMovies = async (page = 1) => {
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
      const data = await response.json();
      
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear !== null || (filterType === 'range' && yearRange.start && yearRange.end)) {
      fetchMovies(currentPage);
    }
  }, [selectedYear, filterType, yearRange, currentPage]);

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
    <div className="year-filter-page">
      <h1>Movie Year Filter</h1>
      
      {/* Filter Type Selector */}
      <div className="filter-options">
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
        <div className="year-range-inputs" style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          <input 
            type="number" 
            placeholder="Start Year" 
            style={{padding: '0.5rem', borderRadius: '0.5rem'}}
            onChange={(e) => setYearRange(prev => ({ ...prev, start: e.target.value }))} 
          />
          <input 
            type="number" 
            placeholder="End Year" 
            style={{padding: '0.5rem', borderRadius: '0.5rem'}}
            onChange={(e) => setYearRange(prev => ({ ...prev, end: e.target.value }))} 
          />
          <button 
            onClick={() => fetchMovies()}
            className="year-button"
          >
            Apply Range
          </button>
        </div>
      )}

      {/* Year Selector */}
      <div className="year-list">
        {years.map(year => (
          <button 
            key={year} 
            onClick={() => {
              setSelectedYear(year);
              setCurrentPage(1);
            }}
            className={`year-button ${selectedYear === year ? 'selected' : ''}`}
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
        <div className="movies-section">
          <div className="movies-list">
            {movies.map(movie => (
              <div 
                key={movie.id} 
                className="movie-card"
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
          <div className="pagination">
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