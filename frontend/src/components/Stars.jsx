import React from "react";

const Stars = ({ rating }) => {
  const getStars = () => {
    const fullStar = "★";
    const halfStar = "⯨"; // optional half-star symbol (or use "☆", or mix)
    const emptyStar = "☆";
    let stars = "";

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars += fullStar;
      } else if (rating >= i - 0.5) {
        stars += halfStar;
      } else {
        stars += emptyStar;
      }
    }
    return stars;
  };

  return <div className="text-yellow-500 text-xl">{getStars()}</div>;
};

export default Stars;
