import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db, auth, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  const [updatedTitle, setUpdatedTitle]= useState("");
  const moviesCollectionRef = collection(db, "movies");
  const [fileUpload, setFileUpload] = useState(null);
  const deleteMovie = async (id) => {
    const MovieDoc = doc(db, "movies", id);
    await deleteDoc(MovieDoc)
  };

  const updateMovieTitle = async (id) => {
    const MovieDoc = doc(db, "movies", id);
    await updateDoc(MovieDoc, {title: updatedTitle});
  };

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, [movieList])
  
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch(err) {
      console.error(err);
    }
  };
  const uploadFile = async () => {
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, 'projectFile/' + fileUpload.name);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };
  //he has video to how to shows images back to the project.
  
  return (
    <div className="App">
      <Auth />
      <div>
        <input onChange={(e) => setNewMovieTitle(e.target.value)} placeholder='Movie title'></input>
        <input onChange={(e) => setNewReleaseDate(Number(e.target.value))} placeholder='Release date (year)' type='number'></input>
        <input type='checkbox' checked={isNewMovieOscar} onChange={(e) => setIsNewMovieOscar(e.target.checked)}></input>
        <label>Received an oscar</label>
        <button onClick={onSubmitMovie}>Submit movie</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{color: movie.receivedAnOscar ? "green" : "red"}}> {movie.title} </h1>
            <p> Date: {movie.releaseDate} </p>
            <button onClick={() => deleteMovie(movie.id)}>
              Delete movie
            </button>
            <input placeholder='new title' onChange={(e) => setUpdatedTitle(e.target.value)}></input>
            <button onClick={() => updateMovieTitle(movie.id)}>Update title</button>
          </div>
        ))}
      </div>
      <div>
        <input type='file' onChange={(e) => setFileUpload(e.target.files[0])}></input>
        <button onClick={uploadFile}>Upload file</button>
      </div>
    </div>
  );
}

export default App;
