import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UsefulLinks from "@/components/UsefulLinks";
import Calendrier from "@/components/meetings/Calendrier";

import Banner from "@/components/meetings/Banner";

export default function CalendrierPage() {
  const events = [
    {
      title: "Réunion de prière",
      start: "2025-12-20T10:00",
      end: "2025-12-20T12:00",
      location: "Salle principale",
      leader: "Sœur Esther",
      audience: "Toutes les sœurs",
      notes: "Apporter son carnet de prière.",
      category: "Prière",
    },
    {
      title: "Étude biblique",
      start: "2025-12-23T17:00",
      end: "2025-12-23T18:30",
      location: "Salle des sœurs",
      leader: "Sœur Marie",
      audience: "Groupe enseignement",
      notes: "Lecture préalable : Jean 15.",
      category: "Enseignement",
    },
  ];

  return (
    <>
      <Head>
        {/* TITLE */}
        <title>Calendrier des réunions | Voice of God Tabernacle</title>

        {/* META DESCRIPTION */}
        <meta
          name="description"
          content="Calendrier officiel des réunions des sœurs de l’église Voice of God Tabernacle : dates, horaires et informations importantes."
        />

        {/* KEYWORDS */}
        <meta
          name="keywords"
          content="calendrier église, réunions des sœurs, réunions chrétiennes, Voice of God Tabernacle"
        />

        {/* VIEWPORT */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* OPEN GRAPH */}
        <meta
          property="og:title"
          content="Calendrier des réunions | Voice of God Tabernacle"
        />
        <meta
          property="og:description"
          content="Consultez le calendrier officiel des réunions des sœurs : dates, horaires et lieux."
        />
        <meta property="og:image" content="/images/calendar.jpg" />
        <meta
          property="og:url"
          content="https://voiceofgodtabernacle.com/calendrier"
        />
        <meta property="og:type" content="website" />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Calendrier des réunions | Voice of God Tabernacle"
        />
        <meta
          name="twitter:description"
          content="Calendrier officiel des réunions des sœurs."
        />
        <meta name="twitter:image" content="/images/calendar.jpg" />

        {/* CANONICAL */}
        <link
          rel="canonical"
          href="https://voiceofgodtabernacle.com/calendrier"
        />
      </Head>

      <Header />

      <main>
        <Banner />
        {/* COMPOSANT CALENDRIER */}
        <Calendrier
          events={events}
          title="Calendrier des réunions des sœurs"
          subtitle="Dates officielles, horaires et informations importantes"
        />

        {/* LIENS UTILES (comme sur services) */}
        <UsefulLinks />
      </main>

      <Footer />
    </>
  );
}
