import React from 'react';
import styles from "./stylesheets/Program.module.css";

const Program = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h3 className={styles.title}>Culte du dimanche</h3>
        <h4 className={styles.time}>DIMANCHE - 11:00</h4>
        <p className={styles.description}>Joignez-vous à nous pour un moment de louange et d'adoration le dimanche à 11h.</p>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>Réunion de prière</h3>
        <h4 className={styles.time}>MERCREDI - 17:00</h4>
        <p className={styles.description}>Rejoignez-nous pour un temps de prière et de partage le mercredi à 17h.</p>
      </div>
    </div>
  );
};

export default Program;
