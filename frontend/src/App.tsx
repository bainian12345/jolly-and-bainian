import { useEffect } from 'react'
import Divider from "./Divider";
import './App.css'
import RSVPForm from './RsvpForm';

import ImageCarousel from './ImageCarousel';

const images = [
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image1.JPG',
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image2.JPG',
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image3.JPG',
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image4.JPG',
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image5.JPG',
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image6.JPG',
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image7.JPG',
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image8.JPG',
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image9.JPG',
  'https://jolly-and-bainian-bucket.s3.us-east-1.amazonaws.com/images/image10.JPG',
];

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="layout">
      <aside className="profile-column">
        <ImageCarousel
          images={images}
        />
      </aside>
      <div className="content-column">
        <div className="title-text-container">
          <p className="title-text">Jolly Li</p>
          <p className="title-text">&</p>
          <p className="title-text">Bainian Liu</p>
        </div>
        <Divider />
        <p className="subtitle-text save-the-date">Save The Date</p>
        <div className="subtitle-text-container">
          <div className="date-container">
            <p className="subtitle-text">Sunday 18:00</p>
            <p className="subtitle-text">April 19, 2026</p>
          </div>
          <div className="address-container">
            <p className="subtitle-text address-text">Cambridge Butterfly Conservatory🦋</p>
            <br />
            <p className="subtitle-text address-text">2500 Kossuth Rd</p>
            <p className="subtitle-text address-text">Cambridge, ON</p>
          </div>

        </div>
        <RSVPForm />
      </div>
    </main>
  );
}

export default App;