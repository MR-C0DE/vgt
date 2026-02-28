#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil
import sys
from pathlib import Path
import argparse
from datetime import datetime, timedelta
import hashlib

class MacCleaner:
    def __init__(self, dry_run=True):
        """
        Initialise le nettoyeur
        dry_run=True : simule sans supprimer (sécurisé)
        dry_run=False : supprime réellement
        """
        self.dry_run = dry_run
        self.files_to_delete = []
        self.total_size = 0
        self.home = Path.home()
        
        # Dossiers de cache courants
        self.cache_dirs = [
            self.home / "Library" / "Caches",
            self.home / "Library" / "Application Support" / "Google" / "Chrome" / "Default" / "Cache",
            self.home / "Library" / "Application Support" / "Firefox" / "Profiles",
            self.home / "Library" / "Application Support" / "Code" / "Cache",
            self.home / "Library" / "Application Support" / "Slack" / "Cache",
            self.home / "Library" / "Application Support" / "Spotify" / "Cache"
        ]
        
        # Extensions de fichiers temporaires
        self.temp_extensions = [
            '.tmp', '.temp', '.cache', '.log', '.bak', '.backup',
            '.dmg', '.pkg', '.part', '.crdownload'
        ]
        
        # Dossiers à scanner pour les gros fichiers
        self.scan_dirs = [
            self.home / "Downloads",
            self.home / "Documents",
            self.home / "Desktop"
        ]

    def format_size(self, size_bytes):
        """Formate la taille en unités lisibles"""
        for unit in ['o', 'Ko', 'Mo', 'Go', 'To']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.2f} To"

    def get_file_size(self, filepath):
        """Retourne la taille d'un fichier"""
        try:
            return filepath.stat().st_size
        except (OSError, PermissionError):
            return 0

    def find_cache_files(self):
        """Recherche les fichiers de cache"""
        print("\n🔍 Recherche des fichiers de cache...")
        
        for cache_dir in self.cache_dirs:
            if not cache_dir.exists():
                continue
                
            try:
                for root, dirs, files in os.walk(cache_dir):
                    for file in files:
                        filepath = Path(root) / file
                        size = self.get_file_size(filepath)
                        if size > 0:
                            self.files_to_delete.append({
                                'path': filepath,
                                'size': size,
                                'type': 'cache'
                            })
                            self.total_size += size
            except (PermissionError, OSError):
                continue

    def find_temp_files(self):
        """Recherche les fichiers temporaires"""
        print("🔍 Recherche des fichiers temporaires...")
        
        for scan_dir in self.scan_dirs:
            if not scan_dir.exists():
                continue
                
            try:
                for ext in self.temp_extensions:
                    for filepath in scan_dir.rglob(f"*{ext}"):
                        if filepath.is_file():
                            size = self.get_file_size(filepath)
                            if size > 0:
                                self.files_to_delete.append({
                                    'path': filepath,
                                    'size': size,
                                    'type': 'temp'
                                })
                                self.total_size += size
            except (PermissionError, OSError):
                continue

    def find_old_files(self, days=30, min_size_mb=100):
        """
        Recherche les fichiers vieux de plus de 'days' jours
        et plus gros que 'min_size_mb' Mo
        """
        print(f"🔍 Recherche des fichiers vieux de +{days} jours...")
        
        cutoff_date = datetime.now() - timedelta(days=days)
        min_size = min_size_mb * 1024 * 1024
        
        for scan_dir in self.scan_dirs:
            if not scan_dir.exists():
                continue
                
            try:
                for filepath in scan_dir.rglob("*"):
                    if not filepath.is_file():
                        continue
                        
                    # Vérifier la date de modification
                    mtime = datetime.fromtimestamp(filepath.stat().st_mtime)
                    size = filepath.stat().st_size
                    
                    if mtime < cutoff_date and size > min_size:
                        self.files_to_delete.append({
                            'path': filepath,
                            'size': size,
                            'type': 'old'
                        })
                        self.total_size += size
            except (PermissionError, OSError):
                continue

    def find_duplicates(self, scan_subdirs=True):
        """
        Recherche les fichiers en double (basé sur la taille et le hash)
        Attention : peut être lent sur de gros volumes
        """
        print("🔍 Recherche des fichiers en double...")
        
        files_by_size = {}
        duplicates = []
        
        # Scanner les dossiers
        for scan_dir in self.scan_dirs:
            if not scan_dir.exists():
                continue
                
            try:
                for filepath in scan_dir.rglob("*"):
                    if not filepath.is_file():
                        continue
                        
                    size = filepath.stat().st_size
                    if size > 0:
                        if size not in files_by_size:
                            files_by_size[size] = []
                        files_by_size[size].append(filepath)
            except (PermissionError, OSError):
                continue
        
        # Vérifier les doublons par hash
        for size, file_list in files_by_size.items():
            if len(file_list) > 1:
                hashes = {}
                for filepath in file_list:
                    try:
                        # Calculer le hash MD5 (simplifié, prend les premiers Mo pour la vitesse)
                        with open(filepath, 'rb') as f:
                            file_hash = hashlib.md5(f.read(8192)).hexdigest()
                        
                        if file_hash in hashes:
                            # C'est un doublon
                            hashes[file_hash].append(filepath)
                        else:
                            hashes[file_hash] = [filepath]
                    except (OSError, PermissionError):
                        continue
                
                # Garder un seul exemplaire par hash
                for file_group in hashes.values():
                    if len(file_group) > 1:
                        # Garder le premier, marquer les autres comme doublons
                        for dup_file in file_group[1:]:
                            duplicates.append({
                                'path': dup_file,
                                'size': size,
                                'type': 'duplicate'
                            })
                            self.total_size += size
        
        self.files_to_delete.extend(duplicates)

    def cleanup_downloads_folder(self):
        """Nettoie spécifiquement le dossier Downloads"""
        print("🔍 Nettoyage du dossier Téléchargements...")
        
        downloads = self.home / "Downloads"
        if not downloads.exists():
            return
            
        # Fichiers d'installation .dmg
        for dmg in downloads.glob("*.dmg"):
            size = self.get_file_size(dmg)
            if size > 0:
                self.files_to_delete.append({
                    'path': dmg,
                    'size': size,
                    'type': 'installer'
                })
                self.total_size += size
        
        # Fichiers .zip et .tar.gz vieux de plus de 7 jours
        cutoff = datetime.now() - timedelta(days=7)
        for archive in downloads.glob("*.zip") + downloads.glob("*.tar.gz") + downloads.glob("*.tgz"):
            try:
                if datetime.fromtimestamp(archive.stat().st_mtime) < cutoff:
                    size = self.get_file_size(archive)
                    self.files_to_delete.append({
                        'path': archive,
                        'size': size,
                        'type': 'old_archive'
                    })
                    self.total_size += size
            except OSError:
                continue

    def show_summary(self):
        """Affiche un résumé des fichiers trouvés"""
        if not self.files_to_delete:
            print("\n✅ Aucun fichier inutile trouvé !")
            return
        
        print("\n" + "=" * 80)
        print(f"📊 RÉSUMÉ DES FICHIERS TROUVÉS")
        print("=" * 80)
        print(f"Nombre total de fichiers : {len(self.files_to_delete)}")
        print(f"Espace total libérable  : {self.format_size(self.total_size)}")
        print("-" * 80)
        
        # Grouper par type
        types = {}
        for f in self.files_to_delete:
            f_type = f['type']
            if f_type not in types:
                types[f_type] = {'count': 0, 'size': 0}
            types[f_type]['count'] += 1
            types[f_type]['size'] += f['size']
        
        print("\nDétail par catégorie :")
        for f_type, stats in types.items():
            print(f"  • {f_type.capitalize():12} : {stats['count']:5} fichiers, {self.format_size(stats['size'])}")
        
        # Top 10 des plus gros fichiers
        print("\n" + "-" * 80)
        print("Top 10 des plus gros fichiers :")
        sorted_files = sorted(self.files_to_delete, key=lambda x: x['size'], reverse=True)[:10]
        
        for i, f in enumerate(sorted_files, 1):
            print(f"  {i:2}. {self.format_size(f['size']):>8} - {f['path'].name}")
            print(f"      📁 {f['path'].parent}")
        
        print("=" * 80)

    def delete_files(self):
        """Supprime les fichiers (si dry_run=False)"""
        if not self.files_to_delete:
            return
            
        if self.dry_run:
            print("\n⚠️  MODE SIMULATION - Aucun fichier supprimé")
            print("Pour supprimer réellement, relancez avec --execute")
            return
        
        print("\n🗑️  Suppression des fichiers...")
        
        deleted_count = 0
        deleted_size = 0
        errors = 0
        
        for f in self.files_to_delete:
            try:
                filepath = f['path']
                if filepath.exists():
                    os.remove(filepath)
                    deleted_count += 1
                    deleted_size += f['size']
                    print(f"  ✓ Supprimé : {filepath.name} ({self.format_size(f['size'])})")
            except Exception as e:
                errors += 1
                print(f"  ✗ Erreur : {f['path']} - {e}")
        
        print("\n" + "=" * 80)
        print(f"✅ SUPPRESSION TERMINÉE")
        print(f"Fichiers supprimés : {deleted_count}")
        print(f"Espace libéré      : {self.format_size(deleted_size)}")
        if errors > 0:
            print(f"Erreurs            : {errors}")
        print("=" * 80)

    def save_report(self, filename="nettoyage_mac_report.txt"):
        """Sauvegarde un rapport détaillé"""
        report_path = self.home / "Desktop" / filename
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("RAPPORT DE NETTOYAGE MAC\n")
            f.write("=" * 60 + "\n")
            f.write(f"Date : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Mode : {'Simulation' if self.dry_run else 'Réel'}\n\n")
            
            if not self.files_to_delete:
                f.write("Aucun fichier inutile trouvé.\n")
            else:
                f.write(f"Total fichiers : {len(self.files_to_delete)}\n")
                f.write(f"Total espace   : {self.format_size(self.total_size)}\n\n")
                f.write("LISTE DES FICHIERS:\n")
                f.write("-" * 60 + "\n")
                
                sorted_files = sorted(self.files_to_delete, key=lambda x: x['path'])
                for f_item in sorted_files:
                    f.write(f"{self.format_size(f_item['size']):>8} - {f_item['path']}\n")
        
        print(f"\n📄 Rapport sauvegardé : {report_path}")

def main():
    parser = argparse.ArgumentParser(description="Nettoyeur de fichiers inutiles pour Mac")
    parser.add_argument('--execute', action='store_true', 
                       help="Exécute réellement la suppression (par défaut: simulation)")
    parser.add_argument('--days', type=int, default=30,
                       help="Âge minimum pour les fichiers anciens (défaut: 30 jours)")
    parser.add_argument('--minsize', type=int, default=100,
                       help="Taille minimum en Mo pour les fichiers anciens (défaut: 100 Mo)")
    parser.add_argument('--no-cache', action='store_true',
                       help="Ne pas scanner les caches")
    parser.add_argument('--no-temp', action='store_true',
                       help="Ne pas scanner les fichiers temporaires")
    parser.add_argument('--no-old', action='store_true',
                       help="Ne pas scanner les fichiers anciens")
    parser.add_argument('--no-duplicates', action='store_true',
                       help="Ne pas scanner les doublons")
    parser.add_argument('--quick', action='store_true',
                       help="Mode rapide (ignore les doublons et fichiers anciens)")
    
    args = parser.parse_args()
    
    print("=" * 80)
    print("🧹 NETTOYEUR MAC - Recherche et suppression de fichiers inutiles")
    print("=" * 80)
    
    # Initialiser le nettoyeur
    cleaner = MacCleaner(dry_run=not args.execute)
    
    # Lancer les recherches
    if not args.no_cache and not args.quick:
        cleaner.find_cache_files()
    
    if not args.no_temp:
        cleaner.find_temp_files()
        cleaner.cleanup_downloads_folder()
    
    if not args.no_old and not args.quick:
        cleaner.find_old_files(days=args.days, min_size_mb=args.minsize)
    
    if not args.no_duplicates and not args.quick:
        cleaner.find_duplicates()
    
    # Afficher le résumé
    cleaner.show_summary()
    
    # Demander confirmation si nécessaire
    if cleaner.files_to_delete and not args.execute:
        print("\n💡 Conseil : Pour supprimer ces fichiers, relancez avec --execute")
        print("   Exemple : python3 mac_cleaner.py --execute")
    
    # Sauvegarder le rapport
    cleaner.save_report()
    
    # Supprimer si demandé
    if args.execute and cleaner.files_to_delete:
        response = input("\n❓ Voulez-vous vraiment supprimer ces fichiers ? (oui/non) : ")
        if response.lower() in ['oui', 'o', 'yes', 'y']:
            cleaner.delete_files()
        else:
            print("❌ Suppression annulée")

if __name__ == "__main__":
    main()