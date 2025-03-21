module.exports = {
    siteUrl: 'https://voiceofgodtabernacle.com',
    generateRobotsTxt: true,  // Génère un fichier robots.txt
    sitemapSize: 7000,  // Limite de pages par fichier sitemap
    changefreq: 'weekly',  // Fréquence de mise à jour
    priority: 0.7,  // Priorité des pages
    additionalPages: [
        '/services',
        '/history',
        '/contact',
    ],
    // La configuration pour générer un seul fichier sitemap.xml
    outDir: './public',  // Le répertoire où les fichiers seront générés
    sitemapFilename: 'sitemap.xml',  // Nom du fichier généré (assurez-vous que ce soit sitemap.xml)
};
