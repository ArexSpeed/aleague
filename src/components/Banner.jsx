import React from "react";
import {Link} from 'react-router-dom';
import { banners } from "../data/banner";
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';

import '../styles/Banner.scss';
import "../styles/Main.scss";


const Banner = () => {

  const carouselItem = banners.map(banner => (
    <Carousel.Item key={banner.id}>
    <img
      className="d-block w-100"
      src={banner.src}
      alt="First slide"
    />
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
  ))

  return (
<>
<Carousel>
  {carouselItem}
</Carousel>
    </>
    );
};

export default Banner;
