import React, { useEffect, useState } from 'react';
import axios from 'axios';

const POD_IDS = [1, 2, 3, 4, 5]; // Pod numbers

const App = () => {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the latest image for each pod
  const fetchImages = async () => {
    setLoading(true);
    setError('');
    
    try {
      const imageRequests = POD_IDS.map(async (podId) => {
        try {
          const response = await axios.get(`/api/image/${podId}`, { responseType: 'blob' });
          const url = URL.createObjectURL(response.data);
          return { podId, url };
        } catch (error) {
          console.error(`Error fetching image for pod-${podId}:`, error);
          return { podId, url: null };
        }
      });

      const results = await Promise.all(imageRequests);
      const updatedImages = results.reduce((acc, { podId, url }) => ({ ...acc, [podId]: url }), {});
      setImages(updatedImages);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Erreur lors de la récupération des images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    const interval = setInterval(fetchImages, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(images).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [images]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">
        🎯 Pod Image Dashboard
        <span className="block mt-2 text-lg font-medium text-gray-600">
          Mise à jour toutes les 30 secondes
        </span>
      </h1>

      {loading && (
        <div className="flex flex-col items-center justify-center my-8 space-y-4">
          <span className="loading loading-spinner text-primary loading-lg"></span>
          <p className="text-gray-500">Chargement des images...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error shadow-lg my-4 w-full max-w-xl">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="flex-grow text-left">{error}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 max-w-6xl">
        {POD_IDS.map((podId) => (
          <div key={podId} className="card w-60 shadow-xl bg-base-100 hover:shadow-2xl transition-transform hover:scale-105">
            <figure className="px-4 pt-4">
              {images[podId] ? (
                <img
                  src={images[podId]}
                  alt={`Pod-${podId} Latest`}
                  className="w-full h-40 object-contain rounded-lg"
                />
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400">
                  Pas d'image disponible
                </div>
              )}
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="text-lg font-semibold text-primary">Pod-{podId}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button className="btn btn-primary btn-wide gap-2" onClick={fetchImages} disabled={loading}>
          {!loading ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Rafraîchir
            </>
          ) : (
            'Chargement...'
          )}
        </button>
      </div>
    </div>
  );
};

export default App;