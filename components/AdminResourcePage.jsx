import Head from "next/head";
import Link from "next/link";
import { HeaderAdmin } from "@/components/HeaderAdmin";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import { FiArrowLeft, FiClock, FiCheckCircle } from "react-icons/fi";
import styles from "@/pages/admin/styles/resources.module.css";

export default function AdminResourcePage({ title, eyebrow, description, icon: Icon, children, steps = [] }) {
  return <RoleGuard allowedRoles={PERMISSIONS.RESOURCES}>
    <Head><title>{title} | Espace VGT</title></Head><HeaderAdmin />
    <main className={styles.container}>
      <Link href="/admin/ressources" className={styles.back}><FiArrowLeft /> Toutes les ressources</Link>
      <header className={styles.hero}><div className={styles.heroIcon}><Icon /></div><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div></header>
      {children}
      {steps.length > 0 && <section className={styles.roadmap}><p className={styles.eyebrow}>Mise en place</p><h2>Ce qui sera configuré</h2><div className={styles.stepList}>{steps.map((step,index) => <div key={step} className={index === 0 ? styles.currentStep : ""}>{index === 0 ? <FiClock /> : <FiCheckCircle />}<span><small>Étape {index + 1}</small>{step}</span></div>)}</div></section>}
    </main>
  </RoleGuard>;
}
