import os
import subprocess
import psutil
import shutil
import datetime
import platform
import json
import speech_recognition as sr
import pyttsx3
from pathlib import Path

class OSAssistant:
    def __init__(self, nom="Assistant"):
        self.nom = nom
        self.systeme = platform.system()
        self.chemin_actuel = Path.cwd()
        
        # Initialisation de la voix (optionnel)
        try:
            self.moteur_voix = pyttsx3.init()
            self.voix_active = True
        except:
            self.voix_active = False
            print("Module vocal non disponible")
        
        # Commandes disponibles
        self.commandes = {
            "liste_fichiers": self.lister_fichiers,
            "ouvrir": self.ouvrir_fichier,
            "creer_dossier": self.creer_dossier,
            "supprimer": self.supprimer,
            "copier": self.copier_fichier,
            "info_systeme": self.info_systeme,
            "processus": self.lister_processus,
            "tuer_processus": self.tuer_processus,
            "wifi_status": self.wifi_status,
            "batterie": self.batterie_info,
            "rechercher": self.rechercher_fichiers,
            "executer": self.executer_commande,
            "aide": self.afficher_aide
        }
        
    def parler(self, texte):
        """Option pour la synthèse vocale"""
        print(f"{self.nom}: {texte}")
        if self.voix_active:
            self.moteur_voix.say(texte)
            self.moteur_voix.runAndWait()
    
    def ecouter(self):
        """Reconnaissance vocale (optionnel)"""
        if not self.voix_active:
            return None
            
        recognizer = sr.Recognizer()
        with sr.Microphone() as source:
            print("Je t'écoute...")
            try:
                audio = recognizer.listen(source, timeout=5)
                texte = recognizer.recognize_google(audio, language='fr-FR')
                print(f"Toi: {texte}")
                return texte
            except:
                return None
    
    # --- FONCTIONS SYSTÈME ---
    
    def lister_fichiers(self, dossier=None):
        """Liste les fichiers dans un dossier"""
        if not dossier:
            dossier = self.chemin_actuel
        
        try:
            chemin = Path(dossier)
            fichiers = []
            for item in chemin.iterdir():
                type_item = "📁" if item.is_dir() else "📄"
                taille = item.stat().st_size if item.is_file() else 0
                fichiers.append(f"{type_item} {item.name} ({taille} octets)")
            
            return f"Fichiers dans {chemin}:\n" + "\n".join(fichiers[:20])  # Limite à 20
        except Exception as e:
            return f"Erreur: {e}"
    
    def ouvrir_fichier(self, chemin):
        """Ouvre un fichier avec l'application par défaut"""
        try:
            if self.systeme == "Windows":
                os.startfile(chemin)
            elif self.systeme == "Darwin":  # macOS
                subprocess.run(["open", chemin])
            else:  # Linux
                subprocess.run(["xdg-open", chemin])
            return f"Fichier ouvert: {chemin}"
        except Exception as e:
            return f"Impossible d'ouvrir: {e}"
    
    def creer_dossier(self, nom):
        """Crée un nouveau dossier"""
        try:
            chemin = self.chemin_actuel / nom
            chemin.mkdir(exist_ok=True)
            return f"Dossier créé: {chemin}"
        except Exception as e:
            return f"Erreur: {e}"
    
    def supprimer(self, chemin):
        """Supprime un fichier ou dossier"""
        try:
            chemin = Path(chemin)
            if chemin.is_file():
                chemin.unlink()
                return f"Fichier supprimé: {chemin}"
            elif chemin.is_dir():
                shutil.rmtree(chemin)
                return f"Dossier supprimé: {chemin}"
        except Exception as e:
            return f"Erreur: {e}"
    
    def copier_fichier(self, source, destination):
        """Copie un fichier"""
        try:
            shutil.copy2(source, destination)
            return f"Copié: {source} -> {destination}"
        except Exception as e:
            return f"Erreur: {e}"
    
    def info_systeme(self, *args):
        """Informations sur le système"""
        infos = {
            "Système": platform.system(),
            "Version": platform.version(),
            "Machine": platform.machine(),
            "Processeur": platform.processor(),
            "CPU (%)": psutil.cpu_percent(interval=1),
            "Mémoire RAM": f"{psutil.virtual_memory().percent}% utilisée",
            "Utilisateurs": psutil.users()
        }
        
        resultat = "Informations système:\n"
        for k, v in infos.items():
            resultat += f"{k}: {v}\n"
        return resultat
    
    def lister_processus(self, *args):
        """Liste les processus en cours"""
        processus = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
            try:
                processus.append(f"{proc.info['pid']}: {proc.info['name']} (CPU: {proc.info['cpu_percent']}%)")
            except:
                pass
        
        return "Processus (top 20):\n" + "\n".join(processus[:20])
    
    def tuer_processus(self, pid):
        """Tuer un processus par son PID"""
        try:
            pid = int(pid)
            process = psutil.Process(pid)
            process.terminate()
            return f"Processus {pid} terminé"
        except Exception as e:
            return f"Erreur: {e}"
    
    def wifi_status(self, *args):
        """Status WiFi"""
        try:
            if self.systeme == "Windows":
                result = subprocess.run(["netsh", "wlan", "show", "interfaces"], 
                                      capture_output=True, text=True)
                return result.stdout
            else:
                result = subprocess.run(["iwconfig"], capture_output=True, text=True)
                return result.stdout
        except:
            return "Impossible de récupérer le statut WiFi"
    
    def batterie_info(self, *args):
        """Info batterie"""
        if hasattr(psutil, "sensors_battery"):
            battery = psutil.sensors_battery()
            if battery:
                return f"Batterie: {battery.percent}% {'(Branché)' if battery.power_plugged else '(Débranché)'}"
        return "Info batterie non disponible"
    
    def rechercher_fichiers(self, nom):
        """Recherche des fichiers par nom"""
        resultats = []
        for root, dirs, files in os.walk(self.chemin_actuel):
            for file in files:
                if nom.lower() in file.lower():
                    resultats.append(os.path.join(root, file))
            if len(resultats) > 50:  # Limite
                break
        
        if resultats:
            return "Fichiers trouvés:\n" + "\n".join(resultats[:20])
        return "Aucun fichier trouvé"
    
    def executer_commande(self, commande):
        """Exécute une commande shell"""
        try:
            result = subprocess.run(commande, shell=True, 
                                  capture_output=True, text=True, timeout=10)
            return result.stdout if result.stdout else result.stderr
        except subprocess.TimeoutExpired:
            return "Commande trop longue, timeout"
        except Exception as e:
            return f"Erreur: {e}"
    
    def afficher_aide(self, *args):
        """Affiche l'aide"""
        aide = "Commandes disponibles:\n"
        for cmd in self.commandes.keys():
            aide += f"  - {cmd}\n"
        aide += "\nExemples:\n"
        aide += "  'liste_fichiers C:/Users'\n"
        aide += "  'ouvrir document.txt'\n"
        aide += "  'info_systeme'\n"
        aide += "  'processus'\n"
        aide += "  'batterie'\n"
        return aide
    
    def analyser_commande(self, texte):
        """Analyse le langage naturel pour trouver la commande"""
        texte = texte.lower()
        
        # Mots-clés vers commandes
        mapping = {
            "liste": "liste_fichiers",
            "fichiers": "liste_fichiers",
            "ouvre": "ouvrir",
            "ouvrir": "ouvrir",
            "crée": "creer_dossier",
            "dossier": "creer_dossier",
            "supprime": "supprimer",
            "efface": "supprimer",
            "copie": "copier_fichier",
            "info": "info_systeme",
            "système": "info_systeme",
            "processus": "processus",
            "programme": "processus",
            "tue": "tuer_processus",
            "arrête": "tuer_processus",
            "wifi": "wifi_status",
            "batterie": "batterie",
            "recherche": "rechercher",
            "trouve": "rechercher",
            "execute": "executer",
            "commande": "executer",
            "aide": "aide",
            "help": "aide"
        }
        
        for mot, cmd in mapping.items():
            if mot in texte:
                # Extraire les paramètres (ce qui reste après le mot-clé)
                reste = texte.replace(mot, "").strip()
                return cmd, reste.split() if reste else []
        
        return None, None
    
    def traiter(self, requete):
        """Traite une requête utilisateur"""
        if not requete:
            return "Je n'ai pas compris"
        
        cmd_name, params = self.analyser_commande(requete)
        
        if cmd_name and cmd_name in self.commandes:
            try:
                resultat = self.commandes[cmd_name](*params)
                return resultat
            except Exception as e:
                return f"Erreur lors de l'exécution: {e}"
        else:
            return f"Commande non reconnue. Tape 'aide' pour voir les commandes disponibles."
    
    def run_cli(self):
        """Mode ligne de commande"""
        print(f"\n=== {self.nom} - Assistant Système ===")
        print("Tape 'quit' pour quitter\n")
        
        while True:
            try:
                requete = input("Toi: ").strip()
                
                if requete.lower() == 'quit':
                    print(f"{self.nom}: Au revoir!")
                    break
                
                resultat = self.traiter(requete)
                print(f"\n{self.nom}: {resultat}\n")
                
            except KeyboardInterrupt:
                print(f"\n{self.nom}: Au revoir!")
                break
            except Exception as e:
                print(f"Erreur: {e}")
    
    def run_voice(self):
        """Mode vocal"""
        print(f"\n=== {self.nom} - Assistant Vocal ===")
        print("Parle-moi ('quit' pour quitter)\n")
        
        while True:
            try:
                requete = self.ecouter()
                
                if requete and requete.lower() == 'quit':
                    self.parler("Au revoir!")
                    break
                
                if requete:
                    resultat = self.traiter(requete)
                    self.parler(resultat)
                
            except KeyboardInterrupt:
                self.parler("Au revoir!")
                break

# Installation des dépendances nécessaires:
# pip install psutil pyttsx3 SpeechRecognition pyaudio

if __name__ == "__main__":
    assistant = OSAssistant("Jarvis")
    
    # Choix du mode
    print("1. Mode texte")
    print("2. Mode vocal (nécessite micro)")
    
    choix = input("Choix (1/2): ")
    
    if choix == "2":
        assistant.run_voice()
    else:
        assistant.run_cli()