import React from 'react';
import styles from './stylesheets/Story.module.css';

const Story = () => {
  return (
    <div className={styles.historyContainer}>
     
      <div className={styles.historyImage}>
        <img src="./images/ajust/13.jpg" alt="Church in the basement" />
      </div>

      
      <div className={styles.historyText}>
        <p>
          Voice of God Tabernacle a été fondée par le Pasteur Jean-Claude Dupuy en 1995, après avoir déménagé dans la capitale, Ottawa, la même année. N'ayant trouvé aucune congrégation chrétienne croyant au Message de l'heure, il se sentit obligé de commencer de modestes réunions avec sa famille et d'autres croyants dans le sous-sol de sa maison. Il croyait fermement que c'était un privilège de ramener les enfants de Dieu et sa famille, qui adoraient avec lui, à la source (la Voix, Malachie 4 versets 5 & 6) que le Seigneur Jésus-Christ avait prévue avant la fondation du monde.
        </p>
       </div>
    </div>
  );
}

export default Story;
