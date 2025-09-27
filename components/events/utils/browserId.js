// utils/browserId.js
export function getBrowserId() {
    if (typeof window === "undefined") return null;

    let browserId = localStorage.getItem("browserId");

    if (!browserId) {
        // Génère un ID unique "à la main"
        const randomPart = Math.random().toString(36).substring(2, 10); // partie aléatoire
        const timePart = Date.now().toString(36); // partie temporelle
        browserId = `${timePart}-${randomPart}`;
        localStorage.setItem("browserId", browserId);
    }

    return browserId;
}
