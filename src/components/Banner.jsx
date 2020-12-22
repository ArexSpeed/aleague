import React, { useState, useCallback, useEffect } from "react";
import { banner } from "../data/banner";
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';

import "../styles/Main.scss";


const Banner = () => {

  const carouselItem = banner.map(item => (
    <Carousel.Item key={item.id}>
    <img
      className="d-block w-100"
      src={item.src}
      alt="First slide"
    />
    <Carousel.Caption>
      <p>{item.desc}</p>
    </Carousel.Caption>
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
