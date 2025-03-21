import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";

import { LanguageProvider } from "@/components/contexts/LanguageContext";
import Banner from "@/components/contacts/Banner";
import Form from "@/components/contacts/Form";
import UsefulLinks from "@/components/UsefulLinks";
import Information from "@/components/contacts/Information";
import { useTranslation } from "next-i18next";
export default function Contact() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        {/* Title dynamique */}
        <title>{t("contact_head_title")}</title>

        {/* Description dynamique */}
        <meta name="description" content={t("contact_head_description")} />

        {/* Keywords dynamique */}
        <meta name="keywords" content={t("contact_head_keywords")} />

        {/* Vueport configuration */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph pour les réseaux sociaux */}
        <meta property="og:title" content={t("contact_head_title")} />
        <meta property="og:description" content={t("contact_head_description")} />
        <meta property="og:image" content="/images/cover.jpg" />
        <meta property="og:url" content="https://voiceofgodtabernacle.com/contact" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("contact_head_title")} />
        <meta name="twitter:description" content={t("contact_head_description")} />
        <meta name="twitter:image" content="/images/cover.jpg" />

        {/* Canonical */}
        <link rel="canonical" href="https://voiceofgodtabernacle.com/contact" />
      </Head>
      <Header />

      <main>
        <Banner />
        <Form />
        <Information />
        <UsefulLinks />
      </main>
      <Footer />
    </>
  );
}
