import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./contexts/LanguageContext";
import {
  Heart,
  Share2,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from "./stylesheets/InnovativeAlbum.module.css";

export default function InnovativeAlbum() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid, masonry

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch("/api/albums");
      const data = await res.json();
      setAlbums(data);
    } catch (error) {
      console.error("Erreur chargement albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (albumId, photoId) => {
    try {
      const res = await fetch("/api/albums/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albumId, photoId }),
      });
      const data = await res.json();

      // Mettre à jour localement
      setAlbums((prevAlbums) =>
        prevAlbums.map((album) => {
          if (album._id === albumId) {
            const updatedPhotos = album.photos.map((photo) => {
              if (photo._id === photoId) {
                return { ...photo, likes: data.likes };
              }
              return photo;
            });
            return { ...album, photos: updatedPhotos };
          }
          return album;
        }),
      );
    } catch (error) {
      console.error("Erreur like:", error);
    }
  };

  const getTitle = (album) => {
    if (language === "fr" && album.name_fr) return album.name_fr;
    if (language === "en" && album.name_en) return album.name_en;
    return album.name;
  };

  const getPhotoTitle = (photo) => {
    if (language === "fr" && photo.title_fr) return photo.title_fr;
    if (language === "en" && photo.title_en) return photo.title_en;
    return photo.title;
  };

  const getPhotoDescription = (photo) => {
    if (language === "fr" && photo.description_fr) return photo.description_fr;
    if (language === "en" && photo.description_en) return photo.description_en;
    return photo.description;
  };

  if (loading) {
    return <div className={styles.loader}>{t("gallery_loading")}</div>;
  }

  return (
    <div className={styles.albumContainer}>
      {/* En-tête */}
      <div className={styles.header}>
        <h2>{t("gallery_heading")}</h2>
        <div className={styles.viewControls}>
          <button
            className={viewMode === "grid" ? styles.active : ""}
            onClick={() => setViewMode("grid")}
          >
            {t("gallery_grid")}
          </button>
          <button
            className={viewMode === "masonry" ? styles.active : ""}
            onClick={() => setViewMode("masonry")}
          >
            {t("gallery_masonry")}
          </button>
        </div>
      </div>

      {/* Sélection d'album */}
      {!selectedAlbum ? (
        albums.length === 0 ? (
          <div className={styles.loader}>{t("gallery_empty")}</div>
        ) : (
          <div className={styles.albumsGrid}>
            {albums.map((album) => (
              <div
                key={album._id}
                className={styles.albumCard}
                onClick={() => setSelectedAlbum(album)}
              >
                <div className={styles.albumCover}>
                  <img
                    src={album.cover_image || "/images/default-album.jpg"}
                    alt={getTitle(album)}
                  />
                  <div className={styles.albumOverlay}>
                    <span>
                      {album.photos?.length || 0} {t("gallery_photo_count")}
                    </span>
                  </div>
                </div>
                <h3>{getTitle(album)}</h3>
                <p>
                  {album.event_date
                    ? new Date(album.event_date).toLocaleDateString()
                    : ""}
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        // Vue de l'album sélectionné
        <div className={styles.albumView}>
          <div className={styles.albumHeader}>
            <button
              onClick={() => setSelectedAlbum(null)}
              className={styles.backButton}
            >
              {t("gallery_back_to_albums")}
            </button>
            <h2>{getTitle(selectedAlbum)}</h2>
          </div>

          <div className={`${styles.photoGrid} ${styles[viewMode]}`}>
            {selectedAlbum.photos?.map((photo) => (
              <div
                key={photo._id}
                className={styles.photoCard}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.thumbnail_url || photo.url}
                  alt={getPhotoTitle(photo)}
                />
                <div className={styles.photoOverlay}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(selectedAlbum._id, photo._id);
                    }}
                    className={styles.likeButton}
                  >
                    <Heart /> {photo.likes || 0}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhoto(photo);
                    }}
                  >
                    <ZoomIn />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div className={styles.lightbox} onClick={() => setSelectedPhoto(null)}>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedPhoto(null)}
            >
              <X />
            </button>
            <img src={selectedPhoto.url} alt={getPhotoTitle(selectedPhoto)} />
            <div className={styles.photoInfo}>
              <h3>{getPhotoTitle(selectedPhoto)}</h3>
              <p>{getPhotoDescription(selectedPhoto)}</p>
              <div className={styles.tags}>
                {selectedPhoto.tags?.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
