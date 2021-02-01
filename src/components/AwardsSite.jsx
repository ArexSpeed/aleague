import React, { useState, useEffect } from "react";
import {votes} from '../data/voting'

import "../styles/Awards.scss";


const AwardsSite = () => {
  const [votesStatus, setVoteStatus] = useState(false)
  const [voten, setVoten] = useState({
    goalkeeper: '',
    defender: '',
    forward: ''
  })

  const voteSend = (e) => {
    e.preventDefault()
    setVoteStatus(true)
    console.log('All Votes', voten)
  }

  const voteGoalkeeper = (e) => {
    setVoten({...voten, goalkeeper: e.target.value})
    console.log(voten)
  }

  const voteDefender = (e) => {
    setVoten({...voten, defender: e.target.value})
    console.log(voten)
  }

  const voteForward = (e) => {
    setVoten({...voten, forward: e.target.value})
    console.log(voten)
  }
  return (
    <>
      <section>
      <div className="sectionLine">
          <span className="sectionLine__title">Awards</span>
        </div>
        <div className="container">
        <header className="tv__header">Vote for the best players</header>
          <form className="awards__boxes" onSubmit={voteSend}>
          <div className="awards__box">
            <h2 className="awards__title">
              Goalkeepers
            </h2>
              {votes.filter(vote => vote.category === "Goalkeeper")
              .map(vote => (
                <div className="awards__checkbox">
                  <input type="radio" name="goalkeeper" id={vote.name} value={vote.name} onClick={voteGoalkeeper} />
                  <label for={vote.name} className="span"><span>{vote.name}</span></label>
                </div>
              ))}     
          </div>

          <div className="awards__box">
            <h2 className="awards__title">
              Defenders
            </h2>
            
              {votes.filter(vote => vote.category === "Defender")
              .map(vote => (
                <div className="awards__checkbox">
                <input type="radio" name="defender" id={vote.name} value={vote.name} onClick={voteDefender} />
                <label for={vote.name} className="span"><span>{vote.name}</span></label>
              </div>
              ))}
            
          </div>

          <div className="awards__box">
            <h2 className="awards__title">
              Forwards
            </h2>
            
            {votes.filter(vote => vote.category === "Forward")
              .map(vote => (
                <div className="awards__checkbox">
                <input type="radio" name="forward" id={vote.name} value={vote.name} onClick={voteForward} />
                <label for={vote.name} className="span"><span>{vote.name}</span></label>
              </div>
              ))}
            
          </div>
          <button type="submit">Vote</button>
          </form>

          {votesStatus && 
          <div>
          <p>GK: {voten.goalkeeper}</p>
          <p>DF: {voten.defender}</p>
          <p>FW: {voten.forward}</p>
          </div>}
          </div>
      </section>
    </>
  )
}

export default AwardsSite
