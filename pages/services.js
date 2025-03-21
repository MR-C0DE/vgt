import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";
import { LanguageProvider } from "@/components/contexts/LanguageContext";
import UsefulLinks from "@/components/UsefulLinks";
import Banner from "@/components/services/Banner";
import Program from "@/components/services/Program";
import { useTranslation } from "next-i18next";

export default function Services() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        {/* Title dynamique */}
        <title>{t("services_head_title")}</title>

        {/* Description dynamique */}
        <meta name="description" content={t("services_head_description")} />

        {/* Keywords dynamique */}
        <meta name="keywords" content={t("services_head_keywords")} />

        {/* Vueport configuration */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph pour les réseaux sociaux */}
        <meta property="og:title" content={t("services_head_title")} />
        <meta property="og:description" content={t("services_head_description")} />
        <meta property="og:image" content="/images/services.jpg" />
        <meta property="og:url" content="https://voiceofgodtabernacle.com/services" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("services_head_title")} />
        <meta name="twitter:description" content={t("services_head_description")} />
        <meta name="twitter:image" content="/images/cover_.jpg" />

        {/* Canonical */}
        <link rel="canonical" href="https://voiceofgodtabernacle.com/services" />
      </Head>
      <Header />
      <main>
        <Banner />
        <Program />
        <UsefulLinks />
      </main>
      <Footer />
    </>
  );
}
