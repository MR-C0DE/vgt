// i18n.js
import i18n from "i18next";
import {
  initReactI18next
} from "react-i18next";
import enTranslation from "/public/locales/en/common.json";
import frTranslation from "/public/locales/fr/common.json";
import enMenu from "/public/locales/en/menu.json";
import frMenu from "/public/locales/fr/menu.json";
import enContact from "/public/locales/en/contact.json";
import frContact from "/public/locales/fr/contact.json";
import enHome from "/public/locales/en/home.json";
import frHome from "/public/locales/fr/home.json";
import enService from "/public/locales/en/services.json";
import frService from "/public/locales/fr/services.json";
import enHistory from "/public/locales/en/history.json";
import frHistory from "/public/locales/fr/history.json";

import frHeadHome from '/public/locales/fr/header/FRHome.json'
import enHeadHome from '/public/locales/en/header/ENHome.json'
import frHeadContact from '/public/locales/fr/header/FRContact.json'
import enHeadContact from '/public/locales/en/header/ENContact.json'
import frHeadServices from '/public/locales/fr/header/FRServices.json'
import enHeadServices from '/public/locales/en/header/ENServices.json'
import frHeadHistory from '/public/locales/fr/header/FRHistory.json'
import enHeadHistory from '/public/locales/en/header/ENHistory.json'

const english = {
  ...enTranslation,
  ...enMenu,
  ...enContact,
  ...enHome,
  ...enService,
  ...enHistory,
  ...enHeadHome,
  ...enHeadContact,
  ...enHeadServices,
  ...enHeadHistory
};
const francais = {
  ...frTranslation,
  ...frMenu,
  ...frContact,
  ...frHome,
  ...frService,
  ...frHistory,
  ...frHeadHome,
  ...frHeadContact,
  ...frHeadServices,
  ...frHeadHistory,
};


i18n
  .use(initReactI18next) // initialise react-i18next
  .init({
    resources: {
      en: {
        translation: english,
      },
      fr: {
        translation: francais,
      },
    },
    lng: "en", // langue par défaut
    fallbackLng: "en", // langue de secours
    interpolation: {
      escapeValue: false, // évite l'échappement des caractères HTML dans les traductions
    },
  });

export default i18n;