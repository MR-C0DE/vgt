import os
import shutil
from pathlib import Path
from datetime import datetime

# Liste des fichiers à copier
fichiers = [
    "/Users/andremulaja/Documents/mes docs/mulajaTechn.pdf",
    "/Users/andremulaja/Documents/mes docs/CV André 1.pdf",
    "/Users/andremulaja/Documents/mes docs/André Mulaja IT.pdf",
    "/Users/andremulaja/Documents/mes docs/andreITCV.pdf",
    "/Users/andremulaja/Documents/mes docs/andreIT.pdf",
    "/Users/andremulaja/Documents/mes docs/DEV_MULAJA.pdf",
    "/Users/andremulaja/Documents/mes docs/Andre Mulaja Dev.pdf",
    "/Users/andremulaja/Documents/mes docs/qbec/CV André 1.pdf",
    "/Users/andremulaja/Downloads/Cv Andre Mulaja-2.pdf",
    "/Users/andremulaja/Downloads/Cv Andre Mulaja.pdf",
    "/Users/andremulaja/Downloads/Cv – Administration _ Agent De Soutien _ Support.pdf",
    "/Users/andremulaja/Downloads/Resume.pdf",
    "/Users/andremulaja/Downloads/Resume-4.pdf",
    "/Users/andremulaja/Downloads/Cv Andre Mulaja English.pdf",
    "/Users/andremulaja/Downloads/Resume-2.pdf",
    "/Users/andremulaja/Downloads/Resume-3.pdf",
    "/Users/andremulaja/Downloads/before 16 sept/Resume.pdf",
    "/Users/andremulaja/Downloads/before 16 sept/Resume-2.pdf",
    "/Users/andremulaja/Downloads/before 16 sept/Resume-3.pdf"
]

# Dossier de destination (à modifier selon ton choix)
dossier_destination = "/Users/andremulaja/Documents/Tous_CV_PL_telecom"

def copier_fichiers_avec_gestion_doublons(liste_fichiers, destination):
    """
    Copie tous les fichiers dans un dossier de destination
    Gère les doublons en ajoutant un suffixe si nécessaire
    """
    
    # Créer le dossier de destination s'il n'existe pas
    Path(destination).mkdir(parents=True, exist_ok=True)
    
    print(f"📁 Copie des fichiers vers : {destination}")
    print("=" * 60)
    
    fichiers_copies = 0
    fichiers_ignores = 0
    doublons_renommes = 0
    
    for fichier_source in liste_fichiers:
        source = Path(fichier_source)
        
        # Vérifier si le fichier source existe
        if not source.exists():
            print(f"❌ Fichier introuvable : {fichier_source}")
            fichiers_ignores += 1
            continue
        
        # Préparer le nom du fichier de destination
        nom_fichier = source.name
        destination_fichier = Path(destination) / nom_fichier
        
        # Gérer les doublons
        compteur = 1
        nom_base = source.stem
        extension = source.suffix
        
        while destination_fichier.exists():
            # Ajouter un suffixe numérique au nom du fichier
            nouveau_nom = f"{nom_base}_{compteur}{extension}"
            destination_fichier = Path(destination) / nouveau_nom
            compteur += 1
            doublons_renommes += 1
        
        try:
            # Copier le fichier
            shutil.copy2(source, destination_fichier)  # copy2 préserve les métadonnées
            print(f"✅ Copié : {source.name} -> {destination_fichier.name}")
            fichiers_copies += 1
            
        except Exception as e:
            print(f"❌ Erreur lors de la copie de {source.name}: {e}")
            fichiers_ignores += 1
    
    # Rapport final
    print("\n" + "=" * 60)
    print("📊 RAPPORT FINAL")
    print(f"✅ Fichiers copiés : {fichiers_copies}")
    print(f"🔄 Fichiers renommés (doublons) : {doublons_renommes}")
    print(f"❌ Fichiers ignorés : {fichiers_ignores}")
    print(f"📁 Destination : {destination}")
    
    # Ouvrir le dossier destination (optionnel - fonctionne sur macOS)
    try:
        os.system(f'open "{destination}"')
        print("📂 Dossier ouvert dans le Finder")
    except:
        pass

# Version alternative avec organisation par type
def copier_fichiers_organises(liste_fichiers, destination):
    """
    Copie les fichiers en les organisant par type/catégorie
    """
    
    # Créer le dossier principal
    Path(destination).mkdir(parents=True, exist_ok=True)
    
    # Catégories basées sur les noms de fichiers
    categories = {
        "CV_Andre": ["Andre", "André", "Mulaja"],
        "CV_IT": ["IT", "Dev", "Development"],
        "CV_Administration": ["Administration", "Soutien", "Support"],
        "CV_Resume": ["Resume"],
        "Autres": []
    }
    
    print(f"📁 Organisation des fichiers dans : {destination}")
    print("=" * 60)
    
    for fichier_source in liste_fichiers:
        source = Path(fichier_source)
        
        if not source.exists():
            print(f"❌ Fichier introuvable : {fichier_source}")
            continue
        
        # Déterminer la catégorie
        categorie = "Autres"
        nom_fichier_lower = source.name.lower()
        
        for cat, mots in categories.items():
            if any(mot.lower() in nom_fichier_lower for mot in mots):
                categorie = cat
                break
        
        # Créer le sous-dossier de catégorie
        dossier_categorie = Path(destination) / categorie
        dossier_categorie.mkdir(exist_ok=True)
        
        # Copier le fichier
        destination_fichier = dossier_categorie / source.name
        
        # Gérer les doublons
        compteur = 1
        nom_base = source.stem
        extension = source.suffix
        
        while destination_fichier.exists():
            nouveau_nom = f"{nom_base}_{compteur}{extension}"
            destination_fichier = dossier_categorie / nouveau_nom
            compteur += 1
        
        try:
            shutil.copy2(source, destination_fichier)
            print(f"✅ [{categorie}] {source.name} -> {destination_fichier.name}")
        except Exception as e:
            print(f"❌ Erreur: {e}")

# Exécution
if __name__ == "__main__":
    print("🧹 Assistant de copie de fichiers")
    print("1. Copie simple avec gestion des doublons")
    print("2. Copie organisée par catégories")
    
    choix = input("\nChoix (1/2) [défaut: 1]: ").strip() or "1"
    
    if choix == "2":
        # Demander le dossier de destination ou utiliser un dossier par défaut avec timestamp
        dossier_perso = input(f"\nDossier de destination [défaut: {dossier_destination}_organise]: ").strip()
        if dossier_perso:
            destination = dossier_perso
        else:
            destination = f"{dossier_destination}_organise"
        
        copier_fichiers_organises(fichiers, destination)
    else:
        # Demander le dossier de destination ou utiliser le dossier par défaut
        dossier_perso = input(f"\nDossier de destination [défaut: {dossier_destination}]: ").strip()
        if dossier_perso:
            destination = dossier_perso
        else:
            destination = dossier_destination
        
        copier_fichiers_avec_gestion_doublons(fichiers, destination)