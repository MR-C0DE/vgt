import Link from "next/link";
import Head from "next/head";
import { HeaderAdmin } from "@/components/HeaderAdmin";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import { FiImage, FiBookOpen, FiMusic, FiMonitor, FiArrowRight, FiCheckCircle, FiClock } from "react-icons/fi";
import styles from "./styles/resources.module.css";

const modules = [
  {href:"/admin/gallery",icon:FiImage,title:"Galerie",description:"Créer les albums et organiser les souvenirs de l’église.",ready:true},
  {href:"/admin/formations",icon:FiBookOpen,title:"Documents & formations",description:"Centraliser les guides, cours, procédures et supports d’équipe."},
  {href:"/admin/louange",icon:FiMusic,title:"Louange & cantiques",description:"Conserver les titres et les paroles en français et en anglais.",ready:true},
  {href:"/admin/projecteur",icon:FiMonitor,title:"Présentations projecteur",description:"Afficher les paroles des cantiques en plein écran.",ready:true},
];
export default function Resources(){return <RoleGuard allowedRoles={PERMISSIONS.RESOURCES}><Head><title>Ressources | Espace VGT</title></Head><HeaderAdmin /><main className={styles.container}><header className={styles.pageHeader}><p className={styles.eyebrow}>Bibliothèque de l’église</p><h1>Ressources</h1><span>Un seul endroit pour préparer, classer et transmettre les contenus utiles aux différents ministères.</span></header><div className={styles.moduleGrid}>{modules.map(({href,icon:Icon,title,description,ready})=><Link href={href} className={styles.moduleCard} key={href}><div className={styles.moduleIcon}><Icon /></div><div><span className={ready?styles.ready:styles.pending}>{ready?<FiCheckCircle/>:<FiClock/>}{ready?"Disponible":"À configurer"}</span><h2>{title}</h2><p>{description}</p></div><FiArrowRight className={styles.cardArrow}/></Link>)}</div><section className={styles.principles}><h2>Une organisation simple</h2><div><article><strong>01</strong><h3>Préparer</h3><p>Créer les contenus nécessaires avant les services et les activités.</p></article><article><strong>02</strong><h3>Valider</h3><p>Permettre aux responsables de revoir ce qui sera utilisé ou publié.</p></article><article><strong>03</strong><h3>Partager</h3><p>Donner à chaque équipe l’accès à la bonne version du contenu.</p></article></div></section></main></RoleGuard>}
