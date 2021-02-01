import React, { useState, useEffect } from "react";
import {votes} from '../data/voting'
import {Percent} from './AwardsElement'

import "../styles/Awards.scss";


const AwardsSite = () => {
  const [votesStatus, setVoteStatus] = useState(false)
  const [votesPoints, setVotePoints] = useState(false)
  const [sumPoints, setSumPoints] = useState({})
  const [voten, setVoten] = useState({
    goalkeeper: '',
    defender: '',
    forward: ''
  })
  console.log('allpts', votes.find(vote => vote.allPoints))
  const countPoints = () => {
    votes.filter(vote => vote.name === voten.goalkeeper ? vote.points++ : '')
    votes.filter(vote => vote.name === voten.defender ? vote.points++ : '')
    votes.filter(vote => vote.name === voten.forward ? vote.points++ : '')
    votes.find(vote => vote.allPoints ? vote.allPoints++ : '')
    let pointsSum = votes.find(vote => vote.allPoints)
    console.log(pointsSum, 'pointsSum')
    setVotePoints(true)
    setSumPoints(pointsSum)
    console.log(sumPoints)
  }

  const voteSend = (e) => {
    e.preventDefault()
    setVoteStatus(true)
    console.log('All Votes', voten)
    countPoints()
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
          {!votesPoints ? (
            <form className="awards__boxes" onSubmit={voteSend}>
              <div className="awards__box">
                <h2 className="awards__title">
                  <div className="awards__title-slash"></div> Goalkeepers
                </h2>
                {votes
                  .filter((vote) => vote.category === "Goalkeeper")
                  .map((vote) => (
                    <div className="awards__checkbox">
                      <input
                        type="radio"
                        name="goalkeeper"
                        id={vote.name}
                        value={vote.name}
                        onClick={voteGoalkeeper}
                      />
                      <label for={vote.name} className="awards__label">
                        <span className="awards__span">{vote.name}</span>
                      </label>
                      <span className="awards__teamName">{vote.club}</span>
                    </div>
                  ))}
              </div>

              <div className="awards__box">
                <h2 className="awards__title">
                  <div className="awards__title-slash"></div> Defenders
                </h2>

                {votes
                  .filter((vote) => vote.category === "Defender")
                  .map((vote) => (
                    <div className="awards__checkbox">
                      <input
                        type="radio"
                        name="defender"
                        id={vote.name}
                        value={vote.name}
                        onClick={voteDefender}
                      />
                      <label for={vote.name} className="awards__label">
                        <span className="awards__span">{vote.name}</span>
                      </label>
                      <span className="awards__teamName">{vote.club}</span>
                    </div>
                  ))}
              </div>

              <div className="awards__box">
                <h2 className="awards__title">
                  <div className="awards__title-slash"></div> Forwards
                </h2>

                {votes
                  .filter((vote) => vote.category === "Forward")
                  .map((vote) => (
                    <div className="awards__checkbox">
                      <input
                        type="radio"
                        name="forward"
                        id={vote.name}
                        value={vote.name}
                        onClick={voteForward}
                      />
                      <label for={vote.name} className="awards__label">
                        <span className="awards__span">{vote.name}</span>
                      </label>
                      <span className="awards__teamName">{vote.club}</span>
                    </div>
                  ))}
              </div>
              <button type="submit" className="awards__button">Vote</button>
            </form>
          ) : (
            <>
              <div className="awards__boxes">
                <div className="awards__box">
                  <h2 className="awards__title">
                    <div className="awards__title-slash"></div> Goalkeepers
                  </h2>

                  {votes
                    .filter((vote) => vote.category === "Goalkeeper")
                    .sort((a,b) => b.points - a.points)
                    .map((vote) => (
                      <>
                      <div className="awards__checkbox">

                        <label className="awards__label">
                          <span className="awards__span">{vote.name}</span>
                        </label>
                        <span className="awards__teamName">{vote.club}</span>
                      </div>
                      <div className="awards__points"> 
                      <Percent width={(vote.points/sumPoints.allPoints)*100}>{(vote.points/sumPoints.allPoints)*100}%</Percent>

                      </div>
          
                      </>
                    ))}
                    
                </div>
              </div>
            </>
          )}

          {/* {votesStatus && (
            <div>
              <p>GK: {voten.goalkeeper}</p>
              <p>DF: {voten.defender}</p>
              <p>FW: {voten.forward}</p>
            </div>
          )} */}
          <br />
        </div>
      </section>
    </>
  );
}

export default AwardsSite
