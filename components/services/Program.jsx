import React from 'react';

import styles from "./stylesheets/Program.module.css";

const Program = () => {
  return (
    
      <div className={styles.container}>
        <div className={styles.info}>
          <h3 className={styles.title}>Réunion d'adoration</h3>
          <h4 className={styles.time}>DIMANCHE - 11:00</h4>
          <p className={styles.description}>La réunion d'adoration est un moment spécial où nous nous rassemblons pour louer et adorer Dieu. Venez vous joindre à nous alors que nous chantons des chants de louange et élevons nos cœurs et nos voix vers le Seigneur.</p>
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>Réunion de prière</h3>
          <h4 className={styles.time}>MERCREDI - 17:00</h4>
          <p className={styles.description}>La réunion de prière est un temps où nous nous rassemblons pour prier ensemble. C'est une occasion pour nous de partager nos fardeaux, nos joies et nos préoccupations avec Dieu et les uns avec les autres. Rejoignez-nous alors que nous cherchons la présence et la direction de Dieu dans nos vies et dans notre communauté.</p>
        </div>
      </div>
   
  );
};

export default Program;
