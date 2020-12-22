import React from "react";

import "../styles/Tv.scss";
function TvSite() {
  return (
    <section>
      <div className="sectionLine">
        <span className="sectionLine__title">TV</span>
      </div>
      <header className="tv__header">Choose your option</header>
      <div className="container">
        <div className="tv__option tv__option-basic">
          <div className="tv__option-title">BASIC</div>
          <div className="tv__option-price">
            0$ / <span>mo</span>
          </div>
          <button className="tv__option-button">START</button>
          <ul className="tv__option-list">
            <li className="tv__option-list-item">Game Highlights</li>
            <li className="tv__option-list-item">Interviews</li>
            <li className="tv__option-list-item">
              Pass with 5% discount for your favorite club games
            </li>
          </ul>
        </div>

        <div className="tv__option tv__option-fan">
          <div className="tv__option-title">FAN</div>
          <div className="tv__option-price">
            10$ / <span>mo</span>{" "}
          </div>
          <button className="tv__option-button">START</button>
          <ul className="tv__option-list">
            <li className="tv__option-list-item">All basic</li>
            <li className="tv__option-list-item">All games live on AL TV</li>
            <li className="tv__option-list-item">Watch games on demand</li>
            <li className="tv__option-list-item">Watch live on 2 devices</li>
          </ul>
        </div>

        <div className="tv__option tv__option-vip">
          <div className="tv__option-title">VIP</div>
          <div className="tv__option-price">
            20$ / <span>mo</span>
          </div>
          <button className="tv__option-button">START</button>
          <ul className="tv__option-list">
            <li className="tv__option-list-item">All fan</li>
            <li className="tv__option-list-item">Choose view to watch game</li>
            <li className="tv__option-list-item">Advanced stats on game</li>
            <li className="tv__option-list-item">Watch live on 4 devices</li>
            <li className="tv__option-list-item">
              Special offet for clubs gadgets
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default TvSite;
