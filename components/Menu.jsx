import React, { useState } from 'react';
import Link from "next/link";
import { FaBars, FaTimes } from 'react-icons/fa'; // Importation des icônes de la bibliothèque react-icons
import { useTranslation } from "next-i18next";
import styles from "./stylesheets/Menu.module.css";

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.Menu}>
      <div onClick={toggleMenu} className={styles.MenuIcon}>
        {menuOpen ? <FaTimes /> : <FaBars />} {/* Utilisation d'icônes pour ouvrir et fermer le menu */}
      </div>
      {menuOpen && (
        <nav className={styles.MenuNav}>
          <ul className={styles.MenuList}>
            <li className={styles.MenuItem}>
              <Link href={"/"}>{t("Home")}</Link>
            </li>
            <li className={styles.MenuItem}>
              <Link href={"/services"}>{t("Services")}</Link>
            </li>
            <li className={styles.MenuItem}>
              <Link href={"/history"}>{t("History")}</Link>
            </li>
            <li className={styles.MenuItem}>
              <Link href={"/contact"}>{t("Contact Us")}</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Menu;
