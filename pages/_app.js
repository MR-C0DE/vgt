import "@/styles/reset.css";
import "@/styles/globals.css";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import { ScreenSizeProvider } from "@/components/contexts/ScreenSizeContext";
import { LanguageProvider } from "@/components/contexts/LanguageContext";
import { RoleProvider } from "@/contexts/RoleContext";

export default function App({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <ScreenSizeProvider>
          <RoleProvider>
            {isClient && <Component {...pageProps} />}
          </RoleProvider>
        </ScreenSizeProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}