import axios from 'axios';

export default async function handler(req, res) {
  try {
    // Faites une requête à l'API WorldTime pour obtenir l'heure actuelle de Jeffersonville
    const response = await axios.get('http://worldtimeapi.org/api/timezone/America/Indiana/Indianapolis');
    
    // Extraire l'heure actuelle de la réponse
    const currentTime = response.data.datetime;
    
    
    // Envoyer l'heure actuelle en tant que réponse JSON
    res.status(200).json({ currentTime });
  } catch (error) {
    // En cas d'erreur, renvoyer un code d'erreur 500 et un message d'erreur
    res.status(500).json({ error: error.message });
  }
}
