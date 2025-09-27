export function getBrowserId() {
    let browserId = localStorage.getItem("browserId");
    if (!browserId) {
      browserId = crypto.randomUUID(); // identifiant unique
      localStorage.setItem("browserId", browserId);
    }
    return browserId;
  }
  