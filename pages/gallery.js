import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InnovativeAlbum from '@/components/InnovativeAlbum';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

export default function Gallery() {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t('gallery_title')} | Voice of God Tabernacle</title>
                <meta name="description" content={t('gallery_description')} />
            </Head>
            <Header />
            <main>
                <InnovativeAlbum />
            </main>
            <Footer />
        </>
    );
}