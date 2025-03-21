import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import UsefulLinks from "@/components/UsefulLinks";
import Banner from "@/components/home/Banner";
import Blockquote from "@/components/home/Blockquote";
import Schedule from "@/components/home/Schedule";
import Annonce from "@/components/home/Annonce";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        {/* Title dynamique */}
        <title>{t("title")}</title>

        {/* Description dynamique */}
        <meta name="description" content={t("description")} />

        {/* Keywords dynamique */}
        <meta name="keywords" content={t("keywords")} />

        {/* Vueport configuration */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph pour les réseaux sociaux */}
        <meta property="og:title" content={t("title")} />
        <meta property="og:description" content={t("description")} />
        <meta property="og:image" content="/images/cover.jpg" />
        <meta property="og:url" content="https://voiceofgodtabernacle.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("title")} />
        <meta name="twitter:description" content={t("description")} />
        <meta name="twitter:image" content="/images/cover.jpg" />

        {/* Canonical */}
        <link rel="canonical" href="https://voiceofgodtabernacle.com" />
      </Head>
      <Header />
      <main>
        <Banner />
        <Blockquote />
        <Schedule />
        <Annonce />
        <UsefulLinks />
      </main>
      <Footer />
    </>
  );
}