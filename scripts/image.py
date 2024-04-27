import os
import requests
from PIL import Image
import imagehash
from io import BytesIO

def create_directory(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def download_image(url, save_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print("L'image a été téléchargée avec succès sous", save_path)
    else:
        print("Erreur lors du téléchargement de l'image")

def image_exists(image_hash, directory):
    for file in os.listdir(directory):
        file_path = os.path.join(directory, file)
        try:
            existing_image_hash = imagehash.average_hash(Image.open(file_path))
            if image_hash == existing_image_hash:
                return True
        except Exception as e:
            print("Erreur lors de la comparaison des images:", e)
    return False

def main():
    url = "https://source.unsplash.com/1600x900/?church"
    num_images = int(input("Combien d'images voulez-vous télécharger ? "))
    save_directory = "load"
    create_directory(save_directory)
    for i in range(num_images):
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))
        image_hash = imagehash.average_hash(image)
        save_path = os.path.join(save_directory, f"church_image_{i+1}.jpg")
        if not image_exists(image_hash, save_directory):
            download_image(url, save_path)
        else:
            print("Image similaire déjà téléchargée, passage à la suivante...")

if __name__ == "__main__":
    main()
