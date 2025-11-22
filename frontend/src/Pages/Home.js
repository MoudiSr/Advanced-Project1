import React, { useState } from "react";
import Restoo from "../Assets/Restoo.jpg";
import RestoTwo from "../Assets/RestoTwo.jpg";
import RestoThree from "../Assets/RestoThree.jpg";
import { Link } from "react-router-dom";
function Home() {
  const images = [Restoo, RestoTwo, RestoThree];
  const [slideIndex, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="container text-center py-4">
      <h1 className="text-danger">Welcome to Mohammad's Restaurant</h1>
      <p className="lead mx-auto" style={{ maxWidth: "600px" }}>
        Enjoy our delicious meals delivered fresh to your door.
      </p>

      <div className="position-relative mx-auto" style={{ maxWidth: "500px" }}>
        <img 
          src={images[slideIndex]}
          className="img-fluid rounded"
          style={{ height: "280px", width: "100%", objectFit: "cover" }}
        />

        <button className="btn btn-danger position-absolute top-50 start-0 translate-middle-y" onClick={prevSlide}>
          Prev
        </button>

        <button className="btn btn-danger position-absolute top-50 end-0 translate-middle-y" onClick={nextSlide}>
          Next
        </button>
      </div>

      <Link to="/menu" className="btn btn-danger mt-4">View Menu</Link>
    </div>
  );
}

export default Home;
