import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";
import { LanguageProvider } from "@/components/contexts/LanguageContext";
import { useTranslation } from "next-i18next";
import UsefulLinks from "@/components/UsefulLinks";
import styles from "@/styles/privacy.module.css"; // Import du CSS module

export default function Privacy() {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t("privacy_head_title")}</title>
                <meta name="description" content={t("privacy_head_description")} />
                <meta name="keywords" content={t("privacy_head_keywords")} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:title" content={t("privacy_head_title")} />
                <meta property="og:description" content={t("privacy_head_description")} />
                <meta property="og:image" content="/images/privacy.jpg" />
                <meta property="og:url" content="https://voiceofgodtabernacle.com/privacy" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t("privacy_head_title")} />
                <meta name="twitter:description" content={t("privacy_head_description")} />
                <meta name="twitter:image" content="/images/privacy.jpg" />
                <link rel="canonical" href="https://voiceofgodtabernacle.com/privacy" />
            </Head>
            <Header />

            <div className={styles["privacy-policy"]}>
                <h1>{t("privacy_title")}</h1>
                <p><strong>{t("effective_date")}: 21 mars 2025</strong></p>
                <p>{t("privacy_intro")}</p>

                <h2>{t("summary_title")}</h2>
                <p>{t("summary_text")}</p>

                <h2>{t("cookies_and_tracking_title")}</h2>
                <p>{t("cookies_and_tracking_text")}</p>

                <h2>{t("google_analytics_title")}</h2>
                <p>{t("google_analytics_text")}</p>

                <h2>{t("data_protection_title")}</h2>
                <p>{t("data_protection_text")}</p>

                <h2>{t("contact_title")}</h2>
                <p>{t("contact_text")}</p>
            </div>

            <UsefulLinks />
            <Footer />
        </>
    );
}
