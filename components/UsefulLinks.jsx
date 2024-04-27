import React from "react";
import Link from "next/link";
import styles from "./stylesheets/UsefulLinks.module.css";
import { useLanguage } from "./contexts/LanguageContext";

const UsefulLinks = () => {
  const {language} = useLanguage();
  const links = {
    en:{vgr: "https://branham.org/fr/home", bt: ""},
    fr:{vgr: "https://branham.org/fr/home"}
  };

  return (
    <div className={styles.UsefulLinks}>
      <ul className={styles.LinkList}>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} href="/">
            <img
              src="/logos/BT.png"
              alt="Branham Tabernacle"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Branham Tabernacle</p>
          </Link>
        </li>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} target="_blank" href={links[language]["vgr"]}>
            <img
              src="/logos/VGR-WHEAT.png"
              alt="VGR"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Voice of God Recording</p>
          </Link>
        </li>

        <li className={styles.LinkItem}>
          <Link className={styles.Link} href="/">
            <img
              src="/logos/YF.png"
              alt="YF"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Young Fondation</p>
          </Link>
        </li>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} href="/">
            <img
              src="/logos/themessage.png"
              alt="Creation"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>TheMessage.net</p>
          </Link>
        </li>

        <li className={styles.LinkItem}>
          <Link className={styles.Link} href="/">
            <img
              src="/logos/creations.png"
              alt="creation"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Creation.net</p>
          </Link>
        </li>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} href="/">
            <img
              src="/logos/BT.png"
              alt="VGR"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Streaming BT</p>
          </Link>
        </li>
        <li className={styles.LinkItem}>
          <Link className={styles.Link} href="/">
            <img
              src="/logos/BT.png"
              alt="VGR"
              className={styles.LinkImage}
            />
            <p className={styles.LinkText}>Lettre Bro Josepth</p>
          </Link>
        </li>
        {/* Ajoutez plus de liens ici */}
      </ul>
    </div>
  );
};

export default UsefulLinks;
