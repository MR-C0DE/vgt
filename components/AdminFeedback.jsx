import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import styles from './stylesheets/AdminFeedback.module.css';

export function AdminNotice({ notice, onClose }) {
  if (!notice) return null;
  const Icon = notice.type === 'success' ? FiCheckCircle : notice.type === 'error' ? FiAlertTriangle : FiInfo;

  return (
    <div className={`${styles.notice} ${styles[notice.type || 'info']}`} role="status" aria-live="polite">
      <Icon aria-hidden="true" />
      <span>{notice.text}</span>
      <button type="button" onClick={onClose} aria-label="Fermer la notification"><FiX /></button>
    </div>
  );
}

export function AdminConfirmDialog({ open, title = 'Confirmer', message, confirmLabel = 'Supprimer', busy = false, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onCancel()}>
      <div className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" aria-describedby="admin-confirm-message">
        <div className={styles.dialogIcon}><FiAlertTriangle /></div>
        <h2 id="admin-confirm-title">{title}</h2>
        <p id="admin-confirm-message">{message}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onCancel} disabled={busy}>Annuler</button>
          <button type="button" className={styles.confirm} onClick={onConfirm} disabled={busy}>{busy ? 'Suppression…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
