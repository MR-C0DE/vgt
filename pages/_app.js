import "@/styles/reset.css";
import "@/styles/globals.css";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { ScreenSizeProvider } from "@/components/contexts/ScreenSizeContext";


export default function App({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(()=> {
    setIsClient(true);
  }, [])
  return (
    <I18nextProvider i18n={i18n}>
      <ScreenSizeProvider>
        {isClient && <Component {...pageProps} />}
      </ScreenSizeProvider>
      
    </I18nextProvider>
  );
}
