import styles from './stylesheets/HeaderAdmin.module.css';
import Link from "next/link";
import { useRouter } from "next/router";

const HeaderAdmin  = () => {

    const router = useRouter();
    const logout = () => {
        localStorage.removeItem("token");
        router.push("/admin/login");
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>VGT ADMIN</h1>

            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <Link href="/admin" className={styles.navLink}>Dashboard</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/admin/messages" className={styles.navLink}>Messages</Link>
                    </li>
                    <li className={styles.navItem}>
                        <button onClick={logout} className={styles.logoutButton}>Logout</button>
                    </li>  
                </ul>
            </nav>
        </div>
    );
}

export {HeaderAdmin};
