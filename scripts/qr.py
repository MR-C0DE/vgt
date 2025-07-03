import qrcode
from PIL import Image

# Lien à encoder
url = "https://voiceofgodtabernacle.com/events?id=f47ac10b-58cc-4372-a567-0e02b2c3d479d3a1bcf4&lang=en"

# Création du QR code avec une meilleure résolution
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # meilleure tolérance à l'erreur
    box_size=20,  # agrandir les cases du QR
    border=4
)

qr.add_data(url)
qr.make(fit=True)

# Création de l'image avec contraste élevé
img = qr.make_image(fill_color="black", back_color="white")

# Sauvegarde avec haute résolution
img.save("qr_code.png", format="PNG")
