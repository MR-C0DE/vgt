import { useEffect, useState } from 'react';

const Time = () => {
  const [temps, setTemps] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('/api/jeffersonvilletime');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTemps(data.currentTime);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      // Gérer les erreurs de connexion SSE ici
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Heure actuelle de Jeffersonville</h1>
      <p>{temps}</p>
    </div>
  );
};

export default Time;
