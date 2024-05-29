import React, { useState } from 'react';
import styles from './stylesheets/Annonce.module.css';
import { useTranslation } from 'react-i18next';

const Annonce = () => {
  const { t } = useTranslation();
  const annonces = [
    {
      expéditeur: "Fr Andre Mulaja",
      message: "Ceci est un message important de l'église. Nous tenons à rappeler à tous nos membres que la messe de dimanche prochain sera suivie d'une réunion communautaire pour discuter des projets à venir. Votre présence est vivement encouragée.",
      date: "2024-05-23"
    },
    {
      expéditeur: "Bureau de soutien",
      message: "Nous sommes heureux d'annoncer le lancement de notre nouveau programme de soutien aux familles. Ce programme offre des ressources et un accompagnement pour les familles en besoin. ",
      date: "2024-05-22"
    }
  ];

  annonces.length =0;
  const MAX_LENGTH = 200;

  return (
    <div className={styles.container}>
      {annonces.length === 0 ? (
        <div>
          <img width={50} src="/no-msg.svg" alt="" />
          <p>{t('noMessages')}</p>
        </div>
      ) : (
        <h2>{t('annoncesTitle')}</h2>
      )}
      {annonces.map((annonce, index) => (
        <div key={index} className={styles.annonce}>
          <p className={styles.exp}><strong>{t('from')}</strong> {annonce.expéditeur}</p>
          <Message 
            text={annonce.message}
            maxLength={MAX_LENGTH} 
          />
          <p><strong>{t('date')}</strong> {annonce.date}</p>
        </div>
      ))}
    </div>
  );
};

const Message = ({ text, maxLength }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldShowButton = text.length > maxLength;

  return (
    <>
      <p>
        {isExpanded || !shouldShowButton ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <div className={styles.buttonContent}>
        {shouldShowButton && (
          <button className={styles.button} onClick={toggleExpansion}>
            {isExpanded ? t('readLess') : t('readMore')}
          </button>
        )}
      </div>
    </>
  );
};

export default Annonce;
