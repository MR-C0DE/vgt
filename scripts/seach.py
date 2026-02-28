#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
from pathlib import Path
import PyPDF2
import re

def chercher_dans_pdf(chemin_fichier, texte_recherche):
    """
    Cherche un texte dans un fichier PDF
    Retourne True si le texte est trouvé, False sinon
    """
    try:
        with open(chemin_fichier, 'rb') as fichier:
            lecteur_pdf = PyPDF2.PdfReader(fichier)
            
            # Parcourir toutes les pages du PDF
            for page in lecteur_pdf.pages:
                texte_page = page.extract_text()
                if texte_page and re.search(texte_recherche, texte_page, re.IGNORECASE):
                    return True
    except Exception as e:
        print(f"Erreur lors de la lecture de {chemin_fichier}: {e}", file=sys.stderr)
    
    return False

def scanner_dossiers(dossiers, texte_recherche):
    """
    Parcourt les dossiers et cherche les PDF contenant le texte
    Retourne la liste des chemins des PDF trouvés
    """
    pdfs_trouves = []
    
    for dossier in dossiers:
        dossier_path = Path(dossier).expanduser()
        
        if not dossier_path.exists():
            print(f"Attention: Le dossier {dossier_path} n'existe pas", file=sys.stderr)
            continue
        
        print(f"Scan du dossier: {dossier_path}")
        
        # Parcourir récursivement tous les fichiers
        for chemin_fichier in dossier_path.rglob('*.pdf'):
            if chemin_fichier.is_file():
                print(f"Vérification: {chemin_fichier.name}")
                
                if chercher_dans_pdf(chemin_fichier, texte_recherche):
                    pdfs_trouves.append(str(chemin_fichier))
                    print(f"  ✓ TROUVÉ: {chemin_fichier}")
    
    return pdfs_trouves

def main():
    # Configuration
    texte_cible = r"PL telecom"  # Le texte à rechercher
    dossiers_recherche = [
        "~/Documents",
        "~/Downloads"
    ]
    
    # Fichier de sortie
    fichier_sortie = Path.home() / "Desktop" / "resultats_recherche_pdf.txt"
    
    print("=" * 60)
    print("RECHERCHE DE 'PL telecom' DANS LES FICHIERS PDF")
    print("=" * 60)
    print(f"Recherche dans: {', '.join(dossiers_recherche)}")
    print(f"Recherche de: '{texte_cible}'")
    print("-" * 60)
    
    # Lancer la recherche
    resultats = scanner_dossiers(dossiers_recherche, texte_cible)
    
    # Sauvegarder les résultats
    with open(fichier_sortie, 'w', encoding='utf-8') as f:
        f.write(f"Résultats de recherche pour '{texte_cible}'\n")
        f.write(f"Date: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 60 + "\n\n")
        
        if resultats:
            for chemin in resultats:
                f.write(chemin + '\n')
        else:
            f.write("Aucun PDF contenant le texte recherché n'a été trouvé.\n")
    
    # Afficher le résumé
    print("\n" + "=" * 60)
    print(f"RECHERCHE TERMINÉE")
    print(f"PDF trouvés: {len(resultats)}")
    print(f"Résultats sauvegardés dans: {fichier_sortie}")
    
    if resultats:
        print("\nChemins trouvés:")
        for chemin in resultats:
            print(f"  - {chemin}")
    else:
        print("\nAucun PDF contenant 'PL telecom' n'a été trouvé.")

if __name__ == "__main__":
    main()