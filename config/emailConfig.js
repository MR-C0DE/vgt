// Configuration des emails pour Voice of God Tabernacle
const emailConfig = {
    // Informations de l'église
    church: {
      name: "Voice of God Tabernacle",
      address: "2285 Boulevard Saint-Laurent, unit-D10, Ottawa, ON",
      phone: "+1 (613) 322-9508",
      email: "vgt@live.ca",
      website: "https://voiceofgodtabernacle.com",
      logoUrl: "https://voiceofgodtabernacle.com/logos.png",
    },
    
    // Configuration SMTP (à remplacer avec vos identifiants)
    smtp: {
      host: "smtp.gmail.com", // ou votre serveur SMTP
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER, // andremulaja@gmail.com ou autre
        pass: process.env.GMAIL_APP_PASSWORD, // mot de passe d'application
      },
    },
    
    // Destinataires des notifications
    notificationEmails: [
      "mulajaandre@gmail.com",
      "andremulaja@yahoo.com",
      "vgt@live.ca",
      "pierreb010@hotmail.com",
     // "vgt@live.ca", // ajoutez l'email de l'église
    ],
  };
  
  module.exports = emailConfig;