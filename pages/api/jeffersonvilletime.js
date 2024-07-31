import axios from 'axios';

export default async function handler(req, res) {
  // Assurez-vous que la demande accepte les événements SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendTime = async () => {
    try {
      // Faites une requête à l'API WorldTime pour obtenir l'heure actuelle de Jeffersonville
      const response = await axios.get('http://worldtimeapi.org/api/timezone/America/Indiana/Indianapolis');
      const currentTime = response.data.datetime;

      // Envoyer l'heure actuelle en tant qu'événement SSE
      res.write(`data: ${JSON.stringify({ currentTime })}\n\n`);
    } catch (error) {
      console.error('Error fetching time:', error);
    }
  };

  // Envoyer l'heure immédiatement et ensuite toutes les secondes
  sendTime();
  const interval = setInterval(sendTime, 1000);

  // Nettoie l'intervalle lorsque la connexion est fermée
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
}
