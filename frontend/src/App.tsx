import { useEffect, useState } from 'react'
import Divider from "./Divider";
import './App.css'
import RSVPForm from './RsvpForm';

import image1 from './assets/image1.JPG';
import image2 from './assets/image2.JPG';
import image3 from './assets/image3.JPG';
import image4 from './assets/image4.JPG';
import image5 from './assets/image5.JPG';
import image6 from './assets/image6.JPG';
import image7 from './assets/image7.JPG';
import image8 from './assets/image8.JPG';
import image9 from './assets/image9.JPG';
import image10 from './assets/image10.JPG';
import ImageCarousel from './ImageCarousel';

const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10];

function App() {
  const [showForm, setShowForm] = useState(false);

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
            <p className="subtitle-text">Sunday</p>
            <p className="subtitle-text">April 19, 2026</p>
          </div>
          <div className="address-container">
            <p className="subtitle-text address-text">2500 Kossuth Rd</p>
            <p className="subtitle-text address-text">Cambridge, ON</p>
          </div>

        </div>
        <div>
          <button className="rsvp-button" onClick={() => setShowForm(true)}>RSVP</button>
        </div>

        {showForm && <RSVPForm />}
      </div>
    </main>
  );
}

export default App;