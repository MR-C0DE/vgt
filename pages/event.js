import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";

import { LanguageProvider, useLanguage } from "@/components/contexts/LanguageContext";
import UsefulLinks from "@/components/UsefulLinks";
import EventError from "@/components/events/EventError";
import Blockquote from "@/components/history/Blockquote";
import Story from "@/components/history/Story";
import Album from "@/components/history/Album";
import { useTranslation } from "next-i18next";
import Banner from "@/components/events/Banner";

export default function History() {

    const { t } = useTranslation();
    const { language } = useLanguage();

    return (
        <>
            <Head>
                {/* Title dynamique */}
                <title>{t("history_head_title")}</title>

                {/* Description dynamique */}
                <meta name="description" content={t("history_head_description")} />

                {/* Keywords dynamique */}
                <meta name="keywords" content={t("history_head_keywords")} />

                {/* Vueport configuration */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />

                {/* Open Graph pour les réseaux sociaux */}
                <meta property="og:title" content={t("history_head_title")} />
                <meta property="og:description" content={t("history_head_description")} />
                <meta property="og:image" content="/images/cover1.jpg" />
                <meta property="og:url" content="https://voiceofgodtabernacle.com/history" />
                <meta property="og:type" content="website" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t("history_head_title")} />
                <meta name="twitter:description" content={t("history_head_description")} />
                <meta name="twitter:image" content="/images/cover1.jpg" />

                {/* Canonical */}
                <link rel="canonical" href="https://voiceofgodtabernacle.com/history" />
            </Head>
            <Header />
            <main>
                <Banner />
                <EventError />
                <UsefulLinks />
            </main>
            <Footer />
        </>
    );
}
