// Templates d'emails pour Voice of God Tabernacle

const churchInfo = {
    name: "Voice of God Tabernacle",
    address: "2285 Boulevard Saint-Laurent, unit-D10, Ottawa, ON",
    phone: "+1 (613) 322-9508",
    email: "vgt@live.ca",
    website: "https://voiceofgodtabernacle.com",
  };
  
  // Template pour la notification admin
  const getAdminNotificationTemplate = (formData, language = 'fr') => {
    const date = new Date().toLocaleString(language === 'fr' ? 'fr-CA' : 'en-CA');
  
    return {
      subject: language === 'fr'
        ? `Nouveau message de ${formData.firstname} ${formData.lastname}`
        : `New message from ${formData.firstname} ${formData.lastname}`,
  
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nouveau message - Voice of God Tabernacle</title>
        </head>
        <body style="margin:0; padding:0; font-family:'Helvetica', 'Arial', sans-serif; background-color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:30px auto; background-color:#ffffff; border-radius:12px; border:1px solid #e0e0e0;">
            
            <!-- En-tête -->
            <tr>
              <td style="background-color:#ffffff; padding:35px 20px; text-align:center; border-radius:12px 12px 0 0; border-bottom:2px solid #ffc107;">
                <img src="https://voiceofgodtabernacle.com/logos.png" alt="Voice of God Tabernacle" style="max-width:220px; height:auto; margin-bottom:10px;">
                <h1 style="color:#272727; margin:10px 0 0; font-size:24px; font-weight:400;">Voice of God Tabernacle</h1>
                <p style="color:#ffc107; margin:5px 0 0; font-size:14px;">"The Voice of God"</p>
              </td>
            </tr>
  
            <!-- Contenu -->
            <tr>
              <td style="padding:35px 25px; background-color:#ffffff;">
                <h2 style="color:#272727; margin-top:0; margin-bottom:25px; font-size:20px; font-weight:500; border-bottom:2px solid #ffc107; padding-bottom:12px;">
                  ${language === 'fr' ? '📬 Nouveau message reçu' : '📬 New message received'}
                </h2>
  
                <p style="color:#555555; line-height:1.7; margin-bottom:25px; font-size:15px;">
                  ${language === 'fr' 
                    ? `Vous avez reçu un nouveau message via le formulaire de contact.` 
                    : `You have received a new message via the contact form.`}
                </p>
  
                <table width="100%" cellpadding="12" style="background-color:#f9f9f9; border-radius:8px; margin-bottom:25px; border:1px solid #e0e0e0;">
                  <tr>
                    <td style="font-weight:600; color:#ffc107; width:120px;">${language === 'fr' ? 'Prénom' : 'First name'}</td>
                    <td style="color:#272727;">${formData.firstname}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:600; color:#ffc107;">${language === 'fr' ? 'Nom' : 'Last name'}</td>
                    <td style="color:#272727;">${formData.lastname}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:600; color:#ffc107;">Email</td>
                    <td style="color:#272727;"><a href="mailto:${formData.email}" style="color:#ffc107; text-decoration:none;">${formData.email}</a></td>
                  </tr>
                  <tr>
                    <td style="font-weight:600; color:#ffc107;">${language === 'fr' ? 'Téléphone' : 'Phone'}</td>
                    <td style="color:#272727;">${formData.telephone || (language === 'fr' ? 'Non fourni' : 'Not provided')}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:600; color:#ffc107;">${language === 'fr' ? 'Objet' : 'Subject'}</td>
                    <td style="color:#272727;">${formData.object}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:600; color:#ffc107;">${language === 'fr' ? 'Date' : 'Date'}</td>
                    <td style="color:#272727;">${date}</td>
                  </tr>
                </table>
  
                <div style="background-color:#f0f0f0; padding:20px; border-left:4px solid #ffc107; margin-bottom:30px;">
                  <h3 style="color:#ffc107; margin-top:0; margin-bottom:12px; font-size:16px; font-weight:600;">${language === 'fr' ? 'Message' : 'Message'}</h3>
                  <p style="color:#555555; line-height:1.7; margin:0; font-size:14px;">${formData.message.replace(/\n/g, '<br>')}</p>
                </div>
  
                <p style="text-align:center; margin:35px 0 15px;">
                  <a href="https://voiceofgodtabernacle.com/admin/messages" style="background-color:#ffc107; color:#272727; padding:12px 30px; text-decoration:none; border-radius:30px; font-weight:500; font-size:14px; display:inline-block;">
                    ${language === 'fr' ? 'Voir tous les messages' : 'View all messages'}
                  </a>
                </p>
              </td>
            </tr>
  
            <!-- Pied de page -->
            <tr>
              <td style="background-color:#ffffff; color:#272727; padding:30px 20px; text-align:center; border-radius:0 0 12px 12px; border-top:1px solid #e0e0e0;">
                <p style="margin:0 0 15px; font-size:16px; color:#ffc107;">${churchInfo.name}</p>
                <p style="margin:0 0 8px; font-size:14px; color:#555555;">${churchInfo.address}</p>
                <p style="margin:0 0 8px; font-size:14px; color:#555555;">📞 ${churchInfo.phone}</p>
                <p style="margin:0 0 15px; font-size:14px; color:#555555;">✉️ ${churchInfo.email}</p>
                <div style="height:1px; width:60px; background-color:#ffc107; margin:20px auto;"></div>
                <p style="margin:20px 0 0; font-size:12px; color:#999999;">
                  © ${new Date().getFullYear()} Voice of God Tabernacle
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };
  };
  
  // Template pour la réponse automatique à l'utilisateur
  const getUserAutoReplyTemplate = (formData, language = 'fr') => {
    return {
      subject: language === 'fr'
        ? `Confirmation de réception - Voice of God Tabernacle`
        : `Receipt confirmation - Voice of God Tabernacle`,
  
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation - Voice of God Tabernacle</title>
        </head>
        <body style="margin:0; padding:0; font-family:'Helvetica','Arial',sans-serif; background-color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:30px auto; background-color:#ffffff; border-radius:12px; border:1px solid #e0e0e0;">
            
            <!-- En-tête -->
            <tr>
              <td style="background-color:#ffffff; padding:35px 20px; text-align:center; border-radius:12px 12px 0 0; border-bottom:2px solid #ffc107;">
                <img src="https://voiceofgodtabernacle.com/logos.png" alt="Voice of God Tabernacle" style="max-width:220px; height:auto; margin-bottom:10px;">
                <h1 style="color:#272727; margin:10px 0 0; font-size:24px; font-weight:400;">Voice of God Tabernacle</h1>
                <p style="color:#ffc107; margin:5px 0 0; font-size:14px;">"The Voice of God"</p>
              </td>
            </tr>
  
            <!-- Contenu -->
            <tr>
              <td style="padding:35px 25px; background-color:#ffffff;">
                
                <p style="color:#272727; line-height:1.8; margin-bottom:20px; font-size:15px;">
                  Salutations dans le nom précieux de notre Seigneur Jésus Christ,
                </p>
  
                <p style="color:#555555; line-height:1.8; margin-bottom:20px; font-size:15px;">
                  Ce message est dans le but de vous notifier que nous avons reçu votre message, que nous le traitons et nous vous reviendrons dans le plus bref délai. 
                  D'ici là, que la grâce et la paix du Seigneur Jésus Christ soient avec vous.
                </p>
  
                <p style="color:#272727; line-height:1.8; margin-bottom:25px; font-size:15px;">
                  Que Dieu vous bénisse.
                </p>
  
                <div style="background-color:#f9f9f9; padding:20px; border-left:4px solid #ffc107; margin-bottom:30px;">
                  <h3 style="color:#ffc107; margin-top:0; margin-bottom:12px; font-size:16px; font-weight:600;">
                    Voici le résumé de votre message :
                  </h3>
                  <p style="color:#555555; line-height:1.7; margin:0; font-size:14px;">
                    <strong>Objet :</strong> ${formData.object}<br>
                    <strong>Message :</strong><br> ${formData.message.replace(/\n/g,'<br>')}
                  </p>
                </div>
  
                <p style="color:#272727; font-weight:400; margin:30px 0 5px; font-size:16px;">
                  Dans l'amour du Christ,
                </p>
                <p style="color:#ffc107; font-weight:500; margin:0; font-size:18px;">Voice of God Tabernacle</p>
              </td>
            </tr>
  
            <!-- Pied de page -->
            <tr>
              <td style="background-color:#ffffff; color:#272727; padding:20px; text-align:center; border-radius:0 0 12px 12px;">
                <p style="margin:0; font-size:12px; color:#999999;">
                  © ${new Date().getFullYear()} Voice of God Tabernacle
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };
  };
  
  module.exports = {
    getAdminNotificationTemplate,
    getUserAutoReplyTemplate,
  };