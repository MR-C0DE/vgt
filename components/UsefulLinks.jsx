import React from "react";
import Link from "next/link";
import styles from "./stylesheets/UsefulLinks.module.css";
import { useLanguage } from "./contexts/LanguageContext";
import { useTranslation } from "next-i18next";

const UsefulLinks = () => {
  const {t}= useTranslation();
  const {language} = useLanguage();
console.log(language);

  return (
    <div className={styles.UsefulLinks}>
      <ul className={styles.LinkList}>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} target="_blank" href={"https://branhamtabernacle.org/"+language+"/home"}>
            <img
              src="/logos/BT.png"
              alt="Branham Tabernacle"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Branham Tabernacle</p>
          </Link>
        </li>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} target="_blank" href={"https://branham.org/en/home"}>
            <img
              src="/logos/VGR-WHEAT.png"
              alt="VGR"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Voice of God Recording</p>
          </Link>
        </li>

        <li className={styles.LinkItem}>
          <Link className={styles.Link} target="_blank" href="https://youngfoundations.org/en/home">
            <img
              src="/logos/YF.png"
              alt="YF"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Young Fondation</p>
          </Link>
        </li>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} target="_blank" href="https://themessage.com/en/home">
            <img
              src="/logos/themessage.png"
              alt="Creation"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>TheMessage.net</p>
          </Link>
        </li>

        <li className={styles.LinkItem}>
          <Link className={styles.Link} href="https://youngfoundations.org/en/creations">
            <img
              src="/logos/creations.png"
              alt="creation"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Creation.net</p>
          </Link>
        </li>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} target="_blank" href="https://branhamtabernacle.org/en/streaming">
            <img
              src="/logos/BT.png"
              alt="VGR"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Streaming BT</p>
          </Link>
        </li>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} target="_blank" href="https://branhamtabernacle.org/en/archive">
            <img
              src="/logos/BT.png"
              alt="VGR"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>{t('letter_archive')}</p>
          </Link>
        </li>
        {/* Ajoutez plus de liens ici */}
      </ul>
    </div>
  );
};

export default UsefulLinks;
