import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const API_URL = 'http://127.0.0.1:8000'; // Base de la API
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500';

  // Variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [movie, setMovie] = useState(null);
  const [playing, setPlaying] = useState(false);

  // Buscar películas
  const fetchMovies = async (searchKey) => {
    try {
      const type = searchKey ? "movie_by_name" : "movies";
      const { data } = await axios.get(`${API_URL}/${type}`, {
        params: { query: searchKey },
      });

      if (data.length > 0) {
        setMovies(data);
        setMovie(data[0]); // Selecciona la primera película como destacada
        await fetchMovie(data[0].id);
      } else {
        setMovies([]);
        setMovie(null);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  // Obtener detalles de una película
  const fetchMovie = async (id) => {
    try {
      const { data } = await axios.get(`${API_URL}/movies/${id}`);
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  // Seleccionar película
  const selectMovie = async (movie) => {
    await fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  // Buscar películas en el submit
  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey);
  };

  // Cargar películas al iniciar la aplicación
  useEffect((e) => {
    fetchMovies();
  }, []);

  return (
    <div>
      {/* Buscador */}
      <form className="container mb-4 mt-4" onSubmit={searchMovies}>
        <input 
          type="text" 
          placeholder="Buscar película" 
          onChange={(e) => setSearchKey(e.target.value)} 
        />
        <button className="btn btn-primary">Buscar</button>
      </form>
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.poster_path}")`,
              }}
            >
              {playing ? ("") : (
                <div className="container">
                  <div>
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <h2 className="text-center text-white">No se encontraron películas</h2>
          )}
        </main>
      </div>

      {/* Contenedor de las películas */}
      <div className="container mt-3">
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-3" onClick={() => selectMovie(movie)}>
              <img src={`${IMAGE_PATH + movie.poster_path}`} alt={movie.title} height={600} width="100%"/>
              <h4 className="text-center">{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
