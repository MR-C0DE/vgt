import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";

import { LanguageProvider, useLanguage } from "@/components/contexts/LanguageContext";
import UsefulLinks from "@/components/UsefulLinks";
import EventError from "@/components/events/EventError";
import Banner from "@/components/events/Banner";
import EventContent from "@/components/events/EventContent";

import events from './data/events.json';
import { useTranslation } from "next-i18next";

export default function Events() {
    const router = useRouter();
    const { t } = useTranslation();
    const { language } = useLanguage();

    // Récupérer l'id dans les paramètres de l'URL
    const { id } = router.query;

    // Trouver l'événement correspondant dans le JSON
    const event = id ? events.find(e => e.id === id) : null;



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

                {/* Si id non fourni ou non trouvé */}
                {!id && <EventError message={t("event_no_id")} />}

                {id && !event && <EventError message={t("event_not_found")} />}

                {/* Si événement trouvé, afficher son contenu */}
                {event && <EventContent data={event} />}

                <UsefulLinks />
            </main>
            <Footer />
        </>
    );
}
