import "@/styles/reset.css";
import "@/styles/globals.css";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import { ScreenSizeProvider } from "@/components/contexts/ScreenSizeContext";
import { LanguageProvider } from "@/components/contexts/LanguageContext";
import Script from "next/script";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag("config", "G-22G28PB844", {
          page_path: url,
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-22G28PB844`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-22G28PB844', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <ScreenSizeProvider>
            {isClient && <Component {...pageProps} />}
          </ScreenSizeProvider>
        </LanguageProvider>
      </I18nextProvider>
    </>
  );
}
