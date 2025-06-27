import qrcode

url = "https://voiceofgodtabernacle.com/event?id=9883324&secure=private"  # Remplace par ton lien

qr = qrcode.QRCode(
    version=1,
    box_size=10,
    border=4
)
qr.add_data(url)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("qr_code.png")
