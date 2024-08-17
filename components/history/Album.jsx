import React, { useEffect, useState } from "react";

import styles from "./stylesheets/Album.module.css";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1594000033503-51ac2b9adf7b?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Photo 1",
  },
  {
    src: "https://images.unsplash.com/photo-1593883909666-1af75c2b68f7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Photo 2",
  },
  { src: "https://picsum.photos/id/239/300/200", alt: "Photo 3" },
  { src: "https://picsum.photos/id/240/300/200", alt: "Photo 4" },
  { src: "https://picsum.photos/id/241/300/200", alt: "Photo 5" },
  {
    src: "https://plus.unsplash.com/premium_photo-1664006989021-4628d0604c36?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
              src={"images/placeholder.png"}
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
