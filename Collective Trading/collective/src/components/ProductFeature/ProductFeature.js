import "./ProductFeature.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import React from "react";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductFeature({ title, products }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    adaptiveHeight: true,
    slidesToShow: products.length > 6 ? 6 : products.length,
    slidesToScroll: 6,
    initialSlide: 0,

    responsive: [
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: products.length > 5 ? 5 : products.length,
          slidesToScroll: 5,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: products.length > 4 ? 4 : products.length,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: products.length > 3 ? 3 : products.length,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 730,
        settings: {
          slidesToShow: products.length > 2 ? 2 : products.length,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="productFeature">
      <h2>{title}</h2>
      <div className="carouselContainer">
        <Slider {...settings} className="productCarousel">
          {products.map((thing, index) => (
            <ProductCard key={index} product={thing} />
          ))}
        </Slider>
      </div>
    </div>
  );
}
