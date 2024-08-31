import React, { useEffect, useState } from "react";

import styles from "./stylesheets/Album.module.css";

const photos = [
  {
    src: "./images/ajust/0.jpg",
    alt: "Photo 1",
  },
  {
    src: "./images/ajust/1.jpg",
    alt: "Photo 2",
  },
  { src: "./images/ajust/7.jpg", alt: "Photo 3" },
  { src: "./images/ajust/10.jpg", alt: "Photo 4" },
  { src: "./images/ajust/6.jpg", alt: "Photo 5" },
  {
    src: "./images/ajust/4.jpg",
    alt: "Photo 6",
  },
  
];

const Album = ({ series, setSeries, setIsOpenSeries }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index) => {
    setSelectedPhotoIndex(index);
    setIsModalOpen(true);
  };

  const closeSeries = () => {
    setSeries(null);
    setIsOpenSeries(false);
  };

  useEffect(() => {
    console.log(series);
  }, []);

  return (
    <div className={styles.container}>
      

      <div className={styles.album}>
        {photos.map((photo, index) => (
          <div className={styles.photo} key={index}>
            <img
              src={photo.src}
              alt={photo.alt}
              onClick={() => openModal(index)}
            />
          </div>
        ))}
      </div>

 
    </div>
  );
};

export default Album;
