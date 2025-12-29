import { useEffect, useState } from "react";
import "./ImageCarousel.css";

interface ImageCarouselProps {
  images: string[];
  interval?: number;
}

export default function ImageCarousel({
  images,
  interval = 3000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="carousel">
      {images.map((img, index) => (
        <img
          key={img}
          src={img}
          alt=""
          className={`carousel-image ${
            index === currentIndex ? "active" : ""
          }`}
        />
      ))}
    </div>
  );
}
