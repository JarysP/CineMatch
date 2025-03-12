import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Youtube from 'react-youtube'
import './App.css';

function App() {
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '4f5f43495afcc67e9553f6c684a82f84'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/w500'

  //variables de estado 
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies"});
  const [playing, setPlaying] = useState(false);

  // Funcion que realiza la peticion get a la API
  const fetchMovies = async(searchKey) =>{
    const type = searchKey ? "search" : "discover"
    const {data: { results }
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    setMovies(results)
    setMovie(results[0])

    if(results.length) {
      await fetchMovie(results[0].id)
    }

  }

  // Funicion para la peticion de una sola pelicula y mostrar en el video
  const fetchMovie = async(id)=>{
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
         api_key: API_KEY,
         append_to_response: "videos",
      }
    });

    if(data.videos && data.videos.results){
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  }

  const selectMovie = async(movie)=>{
    fetchMovie(movie.id)
    setMovie(movie)
    window.scrollTo(0, 0);
  }

  // Funicion para buscar peliculas
  const searchMovies = (e)=>{
    e.preventDefault();
    fetchMovies(searchKey)
  } 

  useEffect(()=>{
    fetchMovies().catch(console.error);
  },[])

  return (
    <div>
      {/* Buscador */}
      <form className='container mb-4 mt-4' onSubmit={searchMovies} >
        <input type="text" placeholder='search' onChange={(e)=> setSearchKey(e.target.value)} /> 
        <button className='btn btn-primary'>Search</button>
      </form>

      {/* Aqui va todo el contenedor del banner y del reproductor de video */}
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <Youtube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div>
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* Contenedor que mostrara los posters de las peliculas */}
      <div className='container mt-3'>
        <div className='row'>
          {movies.map((movie)=>
            <div key={movie.id} className='col-md-4 mb-3' onClick={() => selectMovie(movie)}>
              <img src={`${URL_IMAGE + movie.poster_path}`} alt={movie.title} height={600} width="100%" />
              <h4 className='text-center'>{movie.title}</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
