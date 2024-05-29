import React from 'react';

import styles from "./stylesheets/Program.module.css";

const Program = () => {
  return (
    
      <div className={styles.container}>
        <div className={styles.info}>
          <h3 className={styles.title}>Réunion d'adoration</h3>
          <h4 className={styles.time}>DIMANCHE - 11:00</h4>
          <p className={styles.description}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam incidunt magni distinctio error beatae non, repellat cumque explicabo earum et aperiam atque esse. Quos doloribus eligendi repellendus necessitatibus nihil tempore!</p>
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>Réunion de prière</h3>
          <h4 className={styles.time}>MERCREDI - 17:00</h4>
          <p className={styles.description}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad temporibus molestias et nam, magnam amet accusamus aspernatur! Minus quisquam a tempora saepe explicabo? Saepe, ratione consectetur quibusdam asperiores eligendi inventore!</p>
        </div>
      </div>
   
  );
};

export default Program;
