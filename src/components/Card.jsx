import React from "react";
import "./Card.scss";

function Card() {
  return (
    <div>
      <div className="card">
        <div className="image-data">
          <div className="background-image"></div>
          <div className="publication-details">
            <a href="#" className="author">
              <i className="fas fa-user"></i> Arne Boyten
            </a>
            <span className="date">
              <i className="fas fa-calendar-alt"></i>April 1, 2020
            </span>
          </div>
        </div>
        <div className="post-data">
          <div className="title">
            <h1 className="title_text">Augmentet Reality</h1>
          </div>

          <h2 className="subtitle">A peak of the weak something</h2>
          <p className="description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum
            nemo quam possimus dolores voluptate optio deserunt exercitationem!
            Labore quia qui sit velit id, perspiciatis explicabo!
          </p>
          <div className="cta">
            <a href="#">Read More &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
