import React from "react";
import { Link } from "react-router-dom";
import { banners } from "../data/banner";
//import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

const Hero = () => {
  const carouselItem = banners.map((banner) => (
    <Carousel.Item key={banner.id} style={{ height: "200px", width: "100%" }}>
      <img className="banner__image" src={banner.src} alt="First slide" />
      <div className="banner__desc">
        <div className="banner__title-background">
          <h1 className="banner__title">{banner.title}</h1>
        </div>
        <div className="banner__subtitle-background">
          <h4 className="banner__subtitle">{banner.desc}</h4>
        </div>
      </div>

      <Link to={banner.link} className="banner__button">
        <div className="banner__button-background">
          <span className="banner__button-desc">{banner.button}</span>
        </div>
      </Link>
    </Carousel.Item>
  ));

  return (
    <div className="hero">
      <div className="hero__title">
        <div className="hero__title-top">ATLAND LEAGUE</div>
        <div className="hero__title-bottom">Your best football league</div>
      </div>
      <div className="hero__banner">
        <Carousel style={{ height: "200px", width: "768px" }}>
          {carouselItem}
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;
