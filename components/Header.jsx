import React, { useEffect } from "react";
import Languages from "./Languages";
import styles from "./stylesheets/Header.module.css";
import { useTranslation } from "next-i18next";
import { useLanguage } from "./contexts/LanguageContext";
import Link from "next/link";
import { useScreenSize } from "./contexts/ScreenSizeContext";
import Menu from "./Menu";

const Header = () => {
  const { t } = useTranslation();
  const { width } = useScreenSize();
  return (
    <div className={styles.Header}>
      <Link className={styles.title}  href={"/"}>
        <h1 >Voice of God <br /> Tabernacle</h1>
      </Link>
      {width > 900 && (
        <>
        <nav>
          <ul>
            <li>
              <Link href={"/"}>{t("Home")}</Link>
            </li>
            <li>
              {" "}
              <Link href={"/services"}>{t("Services")}</Link>
            </li>
            <li>
              <Link href={"/history"}>{t("History")}</Link>
            </li>
            <li>
              <Link href={"/contact"}>{t("Contact Us")}</Link>
            </li>
          </ul>
        </nav>
        <Languages />
        </>
      )}

      

      {width <= 900 && (
      <div className={styles.Mini}>
      <Languages />
        <Menu />
      </div>
      )}
    </div>
  );
};

export default Header;
