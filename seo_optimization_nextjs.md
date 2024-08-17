
# Optimisation SEO pour un site Next.js

## 1. Recherche de Mots Clés
1. **Identifiez les mots clés pertinents**
   - Utilisez des outils comme Google Keyword Planner, SEMrush, ou Ahrefs pour trouver des mots clés pertinents pour votre site.
   - Analysez les mots clés utilisés par vos concurrents.

## 2. Optimisation On-Page
### 2.1. Balises de Titre et Méta-Descriptions
   - Ajoutez des balises de titre uniques et des méta-descriptions pour chaque page.
   - Utilisez les mots clés ciblés dans les balises de titre et les méta-descriptions.

\`\`\`jsx
// pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <title>Votre Titre - Mot Clé Principal</title>
          <meta name="description" content="Votre méta-description avec des mots clés pertinents." />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
\`\`\`

### 2.2. Contenu de Qualité
   - Rédigez du contenu informatif, pertinent et bien structuré qui utilise naturellement les mots clés ciblés.
   - Évitez le bourrage de mots clés.

### 2.3. Balises d'En-tête (H1, H2, H3, etc.)
   - Utilisez des balises d'en-tête pour structurer votre contenu.

\`\`\`jsx
// Exemple dans une page Next.js
export default function Home() {
  return (
    <div>
      <h1>Mot Clé Principal dans le H1</h1>
      <h2>Sous-titre avec des mots clés secondaires</h2>
      <p>Contenu pertinent avec utilisation naturelle des mots clés.</p>
    </div>
  );
}
\`\`\`

### 2.4. URLs Optimisées
   - Utilisez des URLs claires et descriptives qui incluent des mots clés.

### 2.5. Texte Alternatif des Images
   - Ajoutez du texte alternatif descriptif aux images.

\`\`\`jsx
<img src="/image.jpg" alt="Description de l'image avec des mots clés pertinents" />
\`\`\`

## 3. Optimisation Technique
### 3.1. Vitesse du Site
   - Optimisez les images, utilisez la mise en cache et minimisez les fichiers CSS et JavaScript.

### 3.2. Mobile-friendly
   - Assurez-vous que votre site est responsive.

### 3.3. Sitemap et robots.txt
   - Créez et soumettez un sitemap XML à Google.

\`\`\`jsx
// Exemple de sitemap dans Next.js
// pages/sitemap.xml.js
import { getServerSideProps } from 'next';

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const sitemap = \`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://www.votresite.com/</loc>
      <lastmod>\${new Date().toISOString()}</lastmod>
    </url>
    <!-- Ajoutez d'autres URLs ici -->
  </urlset>\`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default Sitemap;
\`\`\`
