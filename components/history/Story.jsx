import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { dataStory } from './data/dataStory';
import styles from './stylesheets/Story.module.css';


const Story = () => {
  const { language } = useLanguage();

  return (
    <div className={styles.historyContainer}>
     
      <div className={styles.historyImage}>
        <img src="./images/ajust/13.jpg" alt="Church in the basement" />
      </div>

      
      <div className={styles.historyText}>
        <p>
        {dataStory[language][0]}
        </p>
       </div>
    </div>
  );
}

export default Story;
