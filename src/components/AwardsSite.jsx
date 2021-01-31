import React, { useState, useEffect } from "react";
import {votes} from '../data/voting'

import "../styles/Awards.scss";


const AwardsSite = () => {
  return (
    <>
      <section>
      <div className="sectionLine">
          <span className="sectionLine__title">Awards</span>
        </div>
        <div className="container">
        <header className="tv__header">Vote for the best players</header>
          <div className="awards__boxes">
          <div className="awards__box">
            <h2 className="awards__title">
              Goalkeepers
            </h2>
            <form>
              {votes.filter(vote => vote.category === "Goalkeeper")
              .map(vote => (
                <div className="awards__checkbox">
                  <input type="radio" name="goalkeeper" id={vote.name} value={vote.name} />
                  <label for={vote.name} className="span"><span>{vote.name}</span></label>
                </div>
              ))}
            </form>
          </div>

          <div className="awards__box">
            <h2 className="awards__title">
              Defenders
            </h2>
            <form>
              {votes.filter(vote => vote.category === "Defender")
              .map(vote => (
                <p>
                  <input type="radio" name="defender" id={vote.name} value={vote.name} />
                  <label for={vote.name}>{vote.name}</label>
                </p>
              ))}
            </form>
          </div>

          <div className="awards__box">
            <h2 className="awards__title">
              Forwards
            </h2>
            <form>
              {votes.filter(vote => vote.category === "Forward")
              .map(vote => (
                <p>
                  <input type="radio" name="forward" id={vote.name} value={vote.name} />
                  <label for={vote.name}>{vote.name}</label>
                </p>
              ))}
            </form>
          </div>
          </div>
          </div>
      </section>
    </>
  )
}

export default AwardsSite
