import React from "react";
import chef1 from "../Assets/Chef.jpg";
import chef2 from "../Assets/Chef2.jpg";
import chef3 from "../Assets/Chef3.jpg";

function About() {
  const team = [
    { img: chef1, name: "Abu Ahmad", role: "Head Chef" },
    { img: chef3, name: "Sarah", role: "Sous Chef" },
    { img: chef2, name: "Hussein", role: "Pastry Chef" },
  ];

  const features = [
    { title: "Fresh Ingredients", desc: "We use only the freshest ingredients in every dish." },
    { title: "Fast Delivery", desc: "Hot meals delivered quickly to your door." },
    { title: "Customer Satisfaction", desc: "Your happiness is our priority." },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger">About Us</h2>
      <p className="text-center mx-auto mt-3" style={{ maxWidth: "600px" }}>
        My Restaurant has been serving delicious meals since 2020.
        Our chefs are passionate about great food and unforgettable experiences.
      </p>

      <h3 className="text-center mt-5">Meet Our Team</h3>

      <div className="row mt-4 g-4 justify-content-center">
        {team.map((t, i) => (
          <div className="col-12 col-sm-6 col-md-4 text-center" key={i}>
            <img 
              src={t.img} 
              className="rounded-circle img-fluid"
              style={{ width: "130px", height: "130px", objectFit: "cover" }}
            />
            <h4 className="mt-3">{t.name}</h4>
            <p className="text-muted">{t.role}</p>
          </div>
        ))}
      </div>

      <h3 className="text-center mt-5">Why Choose Us?</h3>

      <div className="row g-4 mt-4 justify-content-center">
        {features.map((f, i) => (
          <div className="col-12 col-sm-6 col-md-4" key={i}>
            <div className="card shadow-sm h-100 text-center p-3">
              <h4 className="text-danger">{f.title}</h4>
              <p className="mt-2">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
