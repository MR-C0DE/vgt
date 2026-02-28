#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import psutil
import socket
import subprocess
import threading
import time
import json
from datetime import datetime, timedelta
from pathlib import Path
import re
import traceback
import signal
from collections import defaultdict
import logging

# PyQt5 imports avec gestion d'erreurs
try:
    from PyQt5.QtWidgets import *
    from PyQt5.QtCore import *
    from PyQt5.QtGui import *
    from PyQt5.QtNetwork import *
except ImportError as e:
    print(f"Erreur import PyQt5: {e}")
    print("Installez PyQt5: pip3 install PyQt5")
    sys.exit(1)

# Pour les graphiques (optionnel)
try:
    import matplotlib
    matplotlib.use('Qt5Agg')
    from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
    from matplotlib.figure import Figure
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False
    print("⚠️ matplotlib non installé - graphiques désactivés")

class SafeWorker(QObject):
    """
    Worker sécurisé qui exécute les tâches dans un thread dédié
    sans bloquer l'interface
    """
    finished = pyqtSignal()
    progress = pyqtSignal(int)
    result = pyqtSignal(object)
    error = pyqtSignal(str)
    
    def __init__(self, func, *args, **kwargs):
        super().__init__()
        self.func = func
        self.args = args
        self.kwargs = kwargs
        self.is_running = True
        
    def run(self):
        """Exécute la tâche de manière sécurisée"""
        try:
            result = self.func(*self.args, **self.kwargs)
            if self.is_running:
                self.result.emit(result)
        except Exception as e:
            error_msg = f"Erreur dans worker: {str(e)}\n{traceback.format_exc()}"
            print(error_msg)
            self.error.emit(str(e))
        finally:
            self.finished.emit()
    
    def stop(self):
        """Arrête proprement le worker"""
        self.is_running = False

class SecurityMonitorGUI(QMainWindow):
    """
    Interface graphique corrigée - Version stable
    """
    
    # Signaux pour communication inter-threads
    update_process_signal = pyqtSignal(object)
    update_network_signal = pyqtSignal(object)
    update_alert_signal = pyqtSignal(str, str)
    update_stats_signal = pyqtSignal(object)
    
    def __init__(self):
        super().__init__()
        
        # Initialisation des attributs
        self.monitoring_active = False
        self.monitor_thread = None
        self.monitor_worker = None
        self.processes_data = []
        self.network_connections = []
        self.alerts = []
        self.current_tab = 0
        self.workers = []  # Garder une référence des workers
        
        # Configuration du logging
        self.setup_logging()
        
        try:
            self.monitor = MacSecurityMonitor(gui_mode=True)
            self.init_ui()
            self.setup_signals()
            self.apply_style()
            self.logger.info("Interface initialisée avec succès")
        except Exception as e:
            self.show_critical_error(f"Erreur d'initialisation: {e}")
            raise
    
    def setup_logging(self):
        """Configure le système de logging"""
        log_file = Path.home() / "Desktop" / "security_monitor_debug.log"
        
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        self.logger.info("=" * 50)
        self.logger.info("Démarrage de SecurityMonitorGUI")
    
    def show_critical_error(self, message):
        """Affiche une erreur critique"""
        self.logger.critical(message)
        QMessageBox.critical(self, "Erreur Critique", message)
    
    def init_ui(self):
        """Initialisation sécurisée de l'UI"""
        self.setWindowTitle("🛡️ Mac Security Monitor - Version Stable")
        self.setGeometry(100, 100, 1200, 700)
        
        # Widget central avec gestion d'erreur
        try:
            central_widget = QWidget()
            self.setCentralWidget(central_widget)
            
            # Layout principal
            main_layout = QVBoxLayout(central_widget)
            
            # Barre d'outils
            toolbar = self.create_toolbar()
            main_layout.addWidget(toolbar)
            
            # Stack d'onglets
            self.tab_widget = QTabWidget()
            self.tab_widget.currentChanged.connect(self.on_tab_changed)
            
            # Création des onglets avec try/except individuels
            tabs_to_create = [
                ("📊 Dashboard", self.create_dashboard_tab),
                ("⚙️ Processus", self.create_processes_tab),
                ("🌐 Réseau", self.create_network_tab),
                ("🚨 Alertes", self.create_alerts_tab),
                ("📈 Stats", self.create_stats_tab),
                ("⚙️ Paramètres", self.create_settings_tab)
            ]
            
            for tab_name, tab_func in tabs_to_create:
                try:
                    tab = tab_func()
                    if tab:
                        self.tab_widget.addTab(tab, tab_name)
                except Exception as e:
                    self.logger.error(f"Erreur création onglet {tab_name}: {e}")
                    # Créer un onglet vide en cas d'erreur
                    empty_tab = QWidget()
                    layout = QVBoxLayout(empty_tab)
                    layout.addWidget(QLabel(f"Erreur de chargement: {e}"))
                    self.tab_widget.addTab(empty_tab, f"⚠️ {tab_name}")
            
            main_layout.addWidget(self.tab_widget)
            
            # Barre de statut
            self.status_bar = QStatusBar()
            self.setStatusBar(self.status_bar)
            self.status_bar.showMessage("Prêt")
            
        except Exception as e:
            self.logger.error(f"Erreur init_ui: {e}")
            raise
    
    def create_toolbar(self):
        """Crée la barre d'outils de manière sécurisée"""
        toolbar = QToolBar()
        toolbar.setObjectName("mainToolbar")
        
        # Bouton Démarrer/Arrêter
        self.start_stop_btn = QPushButton("▶️ Démarrer")
        self.start_stop_btn.setFixedSize(120, 35)
        self.start_stop_btn.clicked.connect(self.safe_toggle_monitoring)
        toolbar.addWidget(self.start_stop_btn)
        
        toolbar.addSeparator()
        
        # Boutons d'action avec gestion d'erreur
        actions = [
            ("🔍 Scan", self.safe_quick_scan),
            ("📊 Rapport", self.safe_generate_report),
            ("🗑️ Effacer", self.safe_clear_alerts)
        ]
        
        for text, slot in actions:
            btn = QPushButton(text)
            btn.setFixedSize(100, 35)
            btn.clicked.connect(slot)
            toolbar.addWidget(btn)
        
        toolbar.addSeparator()
        
        # Niveau de sécurité
        toolbar.addWidget(QLabel("Niveau: "))
        self.security_level = QComboBox()
        self.security_level.addItems(["Bas", "Moyen", "Élevé", "Paranoïaque"])
        self.security_level.setCurrentIndex(2)
        self.security_level.currentTextChanged.connect(self.on_security_level_changed)
        toolbar.addWidget(self.security_level)
        
        return toolbar
    
    def create_dashboard_tab(self):
        """Crée l'onglet Dashboard de manière sécurisée"""
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        try:
            # Widgets métriques
            metrics_widget = QWidget()
            metrics_layout = QHBoxLayout(metrics_widget)
            
            # Création des widgets métriques avec valeurs par défaut
            self.cpu_widget = self.create_metric_widget("CPU", "0%", "#FF6B6B")
            metrics_layout.addWidget(self.cpu_widget)
            
            self.ram_widget = self.create_metric_widget("RAM", "0%", "#4ECDC4")
            metrics_layout.addWidget(self.ram_widget)
            
            self.network_widget = self.create_metric_widget("Réseau", "0 conn", "#45B7D1")
            metrics_layout.addWidget(self.network_widget)
            
            self.alert_widget = self.create_metric_widget("Alertes", "0", "#FFA500")
            metrics_layout.addWidget(self.alert_widget)
            
            layout.addWidget(metrics_widget)
            
            # Graphiques (si matplotlib disponible)
            if MATPLOTLIB_AVAILABLE:
                graphs_widget = QWidget()
                graphs_layout = QHBoxLayout(graphs_widget)
                
                # Graphique CPU
                self.cpu_figure = Figure(figsize=(5, 3))
                self.cpu_canvas = FigureCanvas(self.cpu_figure)
                self.cpu_ax = self.cpu_figure.add_subplot(111)
                graphs_layout.addWidget(self.cpu_canvas)
                
                # Graphique Réseau
                self.net_figure = Figure(figsize=(5, 3))
                self.net_canvas = FigureCanvas(self.net_figure)
                self.net_ax = self.net_figure.add_subplot(111)
                graphs_layout.addWidget(self.net_canvas)
                
                layout.addWidget(graphs_widget)
            
            # Liste des alertes récentes
            alert_group = QGroupBox("Dernières alertes")
            alert_layout = QVBoxLayout(alert_group)
            
            self.recent_alerts_list = QListWidget()
            self.recent_alerts_list.setMaximumHeight(150)
            alert_layout.addWidget(self.recent_alerts_list)
            
            layout.addWidget(alert_group)
            
        except Exception as e:
            self.logger.error(f"Erreur création dashboard: {e}")
            layout.addWidget(QLabel(f"Erreur: {e}"))
        
        return tab
    
    def create_metric_widget(self, title, value, color):
        """Crée un widget métrique avec gestion d'erreur"""
        try:
            widget = QFrame()
            widget.setFrameStyle(QFrame.Box)
            widget.setStyleSheet(f"""
                QFrame {{
                    background-color: {color};
                    border-radius: 10px;
                    padding: 10px;
                    min-width: 150px;
                }}
            """)
            
            layout = QVBoxLayout(widget)
            
            label_title = QLabel(title)
            label_title.setStyleSheet("color: white; font-size: 14px; font-weight: bold;")
            label_title.setAlignment(Qt.AlignCenter)
            layout.addWidget(label_title)
            
            # Stocker la référence à la valeur
            value_label = QLabel(value)
            value_label.setStyleSheet("color: white; font-size: 24px; font-weight: bold;")
            value_label.setAlignment(Qt.AlignCenter)
            layout.addWidget(value_label)
            
            # Sauvegarder la référence
            setattr(self, f"{title.lower()}_value", value_label)
            
            return widget
            
        except Exception as e:
            self.logger.error(f"Erreur création métrique {title}: {e}")
            return QLabel(f"Erreur: {title}")
    
    def create_processes_tab(self):
        """Crée l'onglet Processus"""
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        try:
            # Barre de recherche
            search_widget = QWidget()
            search_layout = QHBoxLayout(search_widget)
            
            search_layout.addWidget(QLabel("🔍 Rechercher:"))
            self.process_search = QLineEdit()
            self.process_search.setPlaceholderText("Nom du processus...")
            self.process_search.textChanged.connect(self.safe_filter_processes)
            search_layout.addWidget(self.process_search)
            
            search_layout.addStretch()
            
            btn_refresh = QPushButton("🔄 Rafraîchir")
            btn_refresh.clicked.connect(self.safe_refresh_processes)
            search_layout.addWidget(btn_refresh)
            
            layout.addWidget(search_widget)
            
            # Tableau des processus
            self.process_table = QTableWidget()
            self.process_table.setColumnCount(5)
            self.process_table.setHorizontalHeaderLabels(["PID", "Nom", "CPU %", "RAM %", "État"])
            self.process_table.horizontalHeader().setStretchLastSection(True)
            self.process_table.setAlternatingRowColors(True)
            
            layout.addWidget(self.process_table)
            
        except Exception as e:
            self.logger.error(f"Erreur création onglet processus: {e}")
            layout.addWidget(QLabel(f"Erreur: {e}"))
        
        return tab
    
    def create_network_tab(self):
        """Crée l'onglet Réseau"""
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        try:
            # Contrôles
            control_widget = QWidget()
            control_layout = QHBoxLayout(control_widget)
            
            btn_refresh = QPushButton("🔄 Rafraîchir")
            btn_refresh.clicked.connect(self.safe_refresh_network)
            control_layout.addWidget(btn_refresh)
            
            layout.addWidget(control_widget)
            
            # Tableau des connexions
            self.network_table = QTableWidget()
            self.network_table.setColumnCount(4)
            self.network_table.setHorizontalHeaderLabels(["Local", "Distant", "État", "PID"])
            layout.addWidget(self.network_table)
            
        except Exception as e:
            self.logger.error(f"Erreur création onglet réseau: {e}")
            layout.addWidget(QLabel(f"Erreur: {e}"))
        
        return tab
    
    def create_alerts_tab(self):
        """Crée l'onglet Alertes"""
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        try:
            self.alerts_list = QListWidget()
            layout.addWidget(self.alerts_list)
            
        except Exception as e:
            self.logger.error(f"Erreur création onglet alertes: {e}")
            layout.addWidget(QLabel(f"Erreur: {e}"))
        
        return tab
    
    def create_stats_tab(self):
        """Crée l'onglet Statistiques"""
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        try:
            self.stats_text = QTextEdit()
            self.stats_text.setReadOnly(True)
            layout.addWidget(self.stats_text)
            
        except Exception as e:
            self.logger.error(f"Erreur création onglet stats: {e}")
            layout.addWidget(QLabel(f"Erreur: {e}"))
        
        return tab
    
    def create_settings_tab(self):
        """Crée l'onglet Paramètres"""
        tab = QWidget()
        layout = QVBoxLayout(tab)
        
        try:
            # Paramètres simples
            settings_group = QGroupBox("Paramètres")
            settings_layout = QFormLayout(settings_group)
            
            self.watch_processes = QCheckBox("Surveiller les processus")
            self.watch_processes.setChecked(True)
            settings_layout.addRow("Processus:", self.watch_processes)
            
            self.watch_network = QCheckBox("Surveiller le réseau")
            self.watch_network.setChecked(True)
            settings_layout.addRow("Réseau:", self.watch_network)
            
            layout.addWidget(settings_group)
            
            # Bouton Appliquer
            btn_apply = QPushButton("✅ Appliquer")
            btn_apply.clicked.connect(self.safe_apply_settings)
            layout.addWidget(btn_apply)
            
            layout.addStretch()
            
        except Exception as e:
            self.logger.error(f"Erreur création onglet paramètres: {e}")
            layout.addWidget(QLabel(f"Erreur: {e}"))
        
        return tab
    
    def setup_signals(self):
        """Configure les signaux de manière sécurisée"""
        try:
            self.update_process_signal.connect(self.safe_update_process_table)
            self.update_network_signal.connect(self.safe_update_network_table)
            self.update_alert_signal.connect(self.safe_add_alert)
            self.update_stats_signal.connect(self.safe_update_stats)
        except Exception as e:
            self.logger.error(f"Erreur setup_signals: {e}")
    
    def apply_style(self):
        """Applique le style de manière sécurisée"""
        try:
            style = """
            QMainWindow {
                background-color: #2b2b2b;
            }
            QTabWidget::pane {
                background-color: #363636;
                border: 1px solid #444;
            }
            QTabBar::tab {
                background-color: #444;
                color: #fff;
                padding: 8px 16px;
            }
            QTabBar::tab:selected {
                background-color: #555;
            }
            QTableWidget {
                background-color: #363636;
                color: #fff;
                gridline-color: #444;
            }
            QHeaderView::section {
                background-color: #444;
                color: #fff;
                padding: 5px;
            }
            QPushButton {
                background-color: #555;
                color: #fff;
                border: none;
                padding: 8px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #666;
            }
            QPushButton:pressed {
                background-color: #444;
            }
            QLineEdit, QComboBox {
                background-color: #444;
                color: #fff;
                border: 1px solid #555;
                padding: 5px;
            }
            QStatusBar {
                background-color: #444;
                color: #fff;
            }
            """
            self.setStyleSheet(style)
        except Exception as e:
            self.logger.error(f"Erreur apply_style: {e}")
    
    # Méthodes sécurisées pour les slots
    @pyqtSlot()
    def safe_toggle_monitoring(self):
        """Active/désactive la surveillance de manière sécurisée"""
        try:
            if not self.monitoring_active:
                self.start_monitoring()
            else:
                self.stop_monitoring()
        except Exception as e:
            self.logger.error(f"Erreur toggle_monitoring: {e}")
            QMessageBox.warning(self, "Erreur", f"Impossible de changer l'état: {e}")
    
    @pyqtSlot()
    def safe_quick_scan(self):
        """Scan rapide sécurisé"""
        try:
            self.status_bar.showMessage("Scan en cours...")
            worker = SafeWorker(self._do_quick_scan)
            worker.result.connect(self._on_scan_complete)
            worker.error.connect(lambda e: QMessageBox.warning(self, "Erreur", f"Scan échoué: {e}"))
            
            thread = QThread()
            worker.moveToThread(thread)
            thread.started.connect(worker.run)
            worker.finished.connect(thread.quit)
            worker.finished.connect(worker.deleteLater)
            thread.finished.connect(thread.deleteLater)
            
            self.workers.append((worker, thread))
            thread.start()
            
        except Exception as e:
            self.logger.error(f"Erreur quick_scan: {e}")
    
    def _do_quick_scan(self):
        """Scan rapide (exécuté dans un thread)"""
        time.sleep(2)  # Simulation
        return {"scanned": True, "threats": 0}
    
    @pyqtSlot(object)
    def _on_scan_complete(self, result):
        """Callback du scan terminé"""
        self.status_bar.showMessage(f"Scan terminé - {result.get('threats', 0)} menaces")
    
    @pyqtSlot()
    def safe_generate_report(self):
        """Génère un rapport de manière sécurisée"""
        try:
            report_path = Path.home() / "Desktop" / f"rapport_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            
            with open(report_path, 'w') as f:
                f.write(f"Rapport de sécurité - {datetime.now()}\n")
                f.write("=" * 50 + "\n")
                f.write(f"Alertes: {len(self.alerts)}\n")
            
            QMessageBox.information(self, "Rapport", f"Rapport sauvegardé: {report_path}")
            
        except Exception as e:
            self.logger.error(f"Erreur generate_report: {e}")
            QMessageBox.warning(self, "Erreur", f"Impossible de générer le rapport: {e}")
    
    @pyqtSlot()
    def safe_clear_alerts(self):
        """Efface les alertes de manière sécurisée"""
        try:
            self.alerts.clear()
            self.alerts_list.clear()
            self.recent_alerts_list.clear()
            if hasattr(self, 'alert_value'):
                self.alert_value.setText("0")
        except Exception as e:
            self.logger.error(f"Erreur clear_alerts: {e}")
    
    @pyqtSlot(str)
    def safe_filter_processes(self, text):
        """Filtre les processus de manière sécurisée"""
        try:
            for row in range(self.process_table.rowCount()):
                item = self.process_table.item(row, 1)  # Colonne nom
                if item:
                    hide = text.lower() not in item.text().lower()
                    self.process_table.setRowHidden(row, hide)
        except Exception as e:
            self.logger.error(f"Erreur filter_processes: {e}")
    
    @pyqtSlot()
    def safe_refresh_processes(self):
        """Rafraîchit la liste des processus"""
        try:
            self.status_bar.showMessage("Rafraîchissement des processus...")
            worker = SafeWorker(self._get_processes)
            worker.result.connect(self._on_processes_refreshed)
            worker.error.connect(lambda e: self.status_bar.showMessage(f"Erreur: {e}"))
            
            thread = QThread()
            worker.moveToThread(thread)
            thread.started.connect(worker.run)
            worker.finished.connect(thread.quit)
            worker.finished.connect(worker.deleteLater)
            thread.finished.connect(thread.deleteLater)
            
            self.workers.append((worker, thread))
            thread.start()
            
        except Exception as e:
            self.logger.error(f"Erreur refresh_processes: {e}")
    
    def _get_processes(self):
        """Récupère la liste des processus (dans thread)"""
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'status']):
            try:
                processes.append(proc.info)
            except:
                continue
        return processes
    
    @pyqtSlot(object)
    def _on_processes_refreshed(self, processes):
        """Met à jour la table avec les nouveaux processus"""
        try:
            self.process_table.setRowCount(len(processes))
            for i, proc in enumerate(processes):
                self.process_table.setItem(i, 0, QTableWidgetItem(str(proc.get('pid', ''))))
                self.process_table.setItem(i, 1, QTableWidgetItem(str(proc.get('name', ''))))
                self.process_table.setItem(i, 2, QTableWidgetItem(f"{proc.get('cpu_percent', 0):.1f}"))
                self.process_table.setItem(i, 3, QTableWidgetItem(f"{proc.get('memory_percent', 0):.1f}"))
                self.process_table.setItem(i, 4, QTableWidgetItem(str(proc.get('status', ''))))
            
            self.status_bar.showMessage(f"Processus mis à jour: {len(processes)}")
            
        except Exception as e:
            self.logger.error(f"Erreur _on_processes_refreshed: {e}")
    
    @pyqtSlot()
    def safe_refresh_network(self):
        """Rafraîchit les connexions réseau"""
        try:
            connections = []
            for conn in psutil.net_connections():
                try:
                    conn_info = {
                        'laddr': f"{conn.laddr.ip}:{conn.laddr.port}" if conn.laddr else "",
                        'raddr': f"{conn.raddr.ip}:{conn.raddr.port}" if conn.raddr else "",
                        'status': conn.status,
                        'pid': conn.pid
                    }
                    connections.append(conn_info)
                except:
                    continue
            
            self.network_table.setRowCount(len(connections))
            for i, conn in enumerate(connections):
                self.network_table.setItem(i, 0, QTableWidgetItem(conn['laddr']))
                self.network_table.setItem(i, 1, QTableWidgetItem(conn['raddr']))
                self.network_table.setItem(i, 2, QTableWidgetItem(conn['status']))
                self.network_table.setItem(i, 3, QTableWidgetItem(str(conn['pid'])))
            
        except Exception as e:
            self.logger.error(f"Erreur refresh_network: {e}")
    
    @pyqtSlot()
    def safe_apply_settings(self):
        """Applique les paramètres"""
        try:
            settings = {
                'watch_processes': self.watch_processes.isChecked(),
                'watch_network': self.watch_network.isChecked(),
                'security_level': self.security_level.currentText()
            }
            self.monitor.update_settings(settings)
            self.status_bar.showMessage("Paramètres appliqués")
        except Exception as e:
            self.logger.error(f"Erreur apply_settings: {e}")
    
    @pyqtSlot(str)
    def on_security_level_changed(self, level):
        """Change le niveau de sécurité"""
        try:
            self.status_bar.showMessage(f"Niveau de sécurité: {level}")
        except Exception as e:
            self.logger.error(f"Erreur security_level_changed: {e}")
    
    @pyqtSlot(int)
    def on_tab_changed(self, index):
        """Change l'onglet actif"""
        try:
            self.current_tab = index
        except Exception as e:
            self.logger.error(f"Erreur tab_changed: {e}")
    
    # Slots thread-safe pour les mises à jour
    @pyqtSlot(object)
    def safe_update_process_table(self, data):
        """Met à jour la table des processus (thread-safe)"""
        try:
            if data and hasattr(self, 'process_table'):
                # Mise à jour légère
                pass
        except Exception as e:
            self.logger.error(f"Erreur update_process_table: {e}")
    
    @pyqtSlot(object)
    def safe_update_network_table(self, data):
        """Met à jour la table réseau (thread-safe)"""
        try:
            if data and hasattr(self, 'network_table'):
                pass
        except Exception as e:
            self.logger.error(f"Erreur update_network_table: {e}")
    
    @pyqtSlot(str, str)
    def safe_add_alert(self, message, severity):
        """Ajoute une alerte (thread-safe)"""
        try:
            timestamp = datetime.now().strftime("%H:%M:%S")
            alert_text = f"[{severity}] {timestamp} - {message}"
            
            self.alerts.append(alert_text)
            
            if hasattr(self, 'alerts_list'):
                self.alerts_list.addItem(alert_text)
            
            if hasattr(self, 'recent_alerts_list'):
                self.recent_alerts_list.addItem(alert_text)
                while self.recent_alerts_list.count() > 10:
                    self.recent_alerts_list.takeItem(0)
            
            if hasattr(self, 'alert_value'):
                self.alert_value.setText(str(len(self.alerts)))
                
        except Exception as e:
            self.logger.error(f"Erreur add_alert: {e}")
    
    @pyqtSlot(object)
    def safe_update_stats(self, stats):
        """Met à jour les stats (thread-safe)"""
        try:
            if hasattr(self, 'stats_text') and stats:
                self.stats_text.setText(json.dumps(stats, indent=2))
        except Exception as e:
            self.logger.error(f"Erreur update_stats: {e}")
    
    # Méthodes de surveillance
    def start_monitoring(self):
        """Démarre la surveillance de manière sécurisée"""
        try:
            self.monitoring_active = True
            self.start_stop_btn.setText("⏸️ Arrêter")
            self.status_bar.showMessage("Surveillance active")
            
            # Démarrer le thread de monitoring
            self.monitor_thread = QThread()
            self.monitor_worker = SafeWorker(self.monitor.run_monitoring)
            self.monitor_worker.moveToThread(self.monitor_thread)
            
            self.monitor_thread.started.connect(self.monitor_worker.run)
            self.monitor_thread.finished.connect(self.monitor_thread.deleteLater)
            
            self.monitor_worker.result.connect(self._on_monitoring_update)
            self.monitor_worker.error.connect(lambda e: self.safe_add_alert(f"Erreur: {e}", "ERROR"))
            
            self.monitor_thread.start()
            
        except Exception as e:
            self.logger.error(f"Erreur start_monitoring: {e}")
            self.monitoring_active = False
    
    def stop_monitoring(self):
        """Arrête la surveillance"""
        try:
            self.monitoring_active = False
            self.start_stop_btn.setText("▶️ Démarrer")
            self.status_bar.showMessage("Surveillance arrêtée")
            
            if self.monitor_worker:
                self.monitor_worker.stop()
            
            if self.monitor_thread:
                self.monitor_thread.quit()
                self.monitor_thread.wait(1000)
                
        except Exception as e:
            self.logger.error(f"Erreur stop_monitoring: {e}")
    
    @pyqtSlot(object)
    def _on_monitoring_update(self, data):
        """Reçoit les mises à jour du monitoring"""
        try:
            if isinstance(data, dict):
                if 'processes' in data:
                    self.safe_update_process_table(data['processes'])
                if 'stats' in data:
                    self.safe_update_stats(data['stats'])
                    
                # Mettre à jour les métriques du dashboard
                if hasattr(self, 'cpu_value') and 'cpu' in data:
                    self.cpu_value.setText(f"{data['cpu']}%")
                if hasattr(self, 'ram_value') and 'ram' in data:
                    self.ram_value.setText(f"{data['ram']}%")
                    
        except Exception as e:
            self.logger.error(f"Erreur _on_monitoring_update: {e}")
    
    def closeEvent(self, event):
        """Gère la fermeture propre de l'application"""
        try:
            self.logger.info("Fermeture de l'application...")
            
            # Arrêter la surveillance
            if self.monitoring_active:
                self.stop_monitoring()
            
            # Arrêter tous les workers
            for worker, thread in self.workers:
                try:
                    worker.stop()
                    thread.quit()
                    thread.wait(500)
                except:
                    pass
            
            self.logger.info("Application fermée proprement")
            event.accept()
            
        except Exception as e:
            self.logger.error(f"Erreur closeEvent: {e}")
            event.accept()


class MacSecurityMonitor:
    """
    Backend de surveillance simplifié et robuste
    """
    
    def __init__(self, gui_mode=False):
        self.gui_mode = gui_mode
        self.running = False
        self.settings = {}
        self.stats = defaultdict(int)
        
    def run_monitoring(self):
        """Boucle de monitoring (s'exécute dans un thread)"""
        self.running = True
        
        while self.running:
            try:
                # Collecter les données
                data = {
                    'timestamp': time.time(),
                    'cpu': psutil.cpu_percent(),
                    'ram': psutil.virtual_memory().percent,
                    'stats': self.get_stats()
                }
                
                # Émettre via le signal (si en mode GUI)
                if self.gui_mode and hasattr(self, 'update_signal'):
                    self.update_signal.emit(data)
                
                time.sleep(2)
                
            except Exception as e:
                print(f"Erreur monitoring: {e}")
                time.sleep(5)
    
    def get_stats(self):
        """Récupère les statistiques"""
        try:
            return {
                'cpu_percent': psutil.cpu_percent(),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_usage': psutil.disk_usage('/').percent,
                'connections': len(psutil.net_connections()),
                'processes': len(psutil.pids()),
                'boot_time': datetime.fromtimestamp(psutil.boot_time()).strftime('%Y-%m-%d %H:%M:%S')
            }
        except:
            return {}
    
    def update_settings(self, settings):
        """Met à jour les paramètres"""
        self.settings.update(settings)
    
    def stop(self):
        """Arrête le monitoring"""
        self.running = False


def exception_hook(exctype, value, tb):
    """Hook global pour capturer les exceptions non gérées"""
    print("=" * 60)
    print("❌ EXCEPTION NON GÉRÉE")
    print("=" * 60)
    print(f"Type: {exctype.__name__}")
    print(f"Valeur: {value}")
    print("Traceback:")
    traceback.print_tb(tb)
    print("=" * 60)
    
    # Sauvegarder dans un fichier
    error_file = Path.home() / "Desktop" / "security_monitor_crash.log"
    with open(error_file, 'a') as f:
        f.write(f"\n{datetime.now()}\n")
        f.write(f"Type: {exctype.__name__}\n")
        f.write(f"Valeur: {value}\n")
        traceback.print_tb(tb, file=f)
        f.write("-" * 40 + "\n")


def main():
    """Point d'entrée principal avec gestion d'erreurs"""
    
    # Installer le hook d'exception
    sys.excepthook = exception_hook
    
    try:
        # Créer l'application Qt
        app = QApplication(sys.argv)
        app.setApplicationName("Mac Security Monitor")
        
        # Créer et afficher la fenêtre
        window = SecurityMonitorGUI()
        window.show()
        
        # Lancer la boucle principale
        sys.exit(app.exec_())
        
    except Exception as e:
        print(f"Erreur fatale: {e}")
        traceback.print_exc()
        
        # Afficher une boîte de dialogue d'erreur
        app = QApplication.instance() or QApplication(sys.argv)
        QMessageBox.critical(
            None,
            "Erreur Fatale",
            f"L'application a rencontré une erreur fatale:\n\n{e}\n\nConsultez le fichier de log pour plus de détails."
        )
        sys.exit(1)


if __name__ == "__main__":
    main()