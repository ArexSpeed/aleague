import React, {useState, useEffect} from "react";
import "../styles/Card.scss";
import {stats} from '../data/stats'
import axios from 'axios'

function Card() {
  const [teams, setTeams] = useState([])
  useEffect(() => {
    const fetchTeams = async () => {
      const {data} = await axios.get('/api/teams')
      setTeams(data)
    }

    fetchTeams()
  }, [])

  const goalsArr = []
  const assistsArr = []
  const cardsArr = []
  stats.map(stat => goalsArr.push(stat))
  stats.map(stat => assistsArr.push(stat))
  stats.map(stat => cardsArr.push(stat))
  goalsArr.sort((a, b) => b.goals - a.goals|| b.assists - a.assists);
  assistsArr.sort((a, b) => b.assists - a.assists|| b.goals - a.goals);
  cardsArr.sort((a, b) => b.red - a.red|| b.yellow - a.yellow);

  const showGoals = goalsArr.map(
    (item, index) =>
      index < 5 && (
        <tr className={index===0 ? 'txt__first' : index ===1 ? 'txt__second' : index===2 ? 'txt__third' : 'txt__rest' && 'tr__card'}>
          <td className="td__card-stats"><img src={teams.filter(team => team.name === item.club).map(item => item.logo)} alt='' className={index===0 ? 'img__first' : index ===1 ? 'img__second' : index===2 ? 'img__third' : 'img__rest'} /></td>
          <td className="td__card-stats">{item.name}</td>
          <td className="td__card-stats txt__bold">{item.goals}</td>
          <td className="td__card-stats txt__shadow">{item.assists}</td>
          <td className="td__card-stats">{item.goals + item.assists}</td>
        </tr>
      )
  );

  const showAssists = assistsArr.map(
    (item, index) =>
      index < 5 && (
        <tr className={index===0 ? 'txt__first' : index ===1 ? 'txt__second' : index===2 ? 'txt__third' : 'txt__rest' && 'tr__card'}>
          <td className="td__card-stats"><img src={teams.filter(team => team.name === item.club).map(item => item.logo)} alt='' className={index===0 ? 'img__first' : index ===1 ? 'img__second' : index===2 ? 'img__third' : 'img__rest'} /></td>
          <td className="td__card-stats">{item.name}</td>
          <td className="td__card-stats txt__bold">{item.assists}</td>
          <td className="td__card-stats txt__shadow">{item.goals}</td>
          <td className="td__card-stats">{item.goals + item.assists}</td>
        </tr>
      )
  );

  const showCards = cardsArr.map(
    (item, index) =>
      index < 5 && (
        <tr className={index===0 ? 'txt__first' : index ===1 ? 'txt__second' : index===2 ? 'txt__third' : 'txt__rest' && 'tr__card'}>
          <td className="td__card-stats"><img src={teams.filter(team => team.name === item.club).map(item => item.logo)} alt='' className={index===0 ? 'img__first' : index ===1 ? 'img__second' : index===2 ? 'img__third' : 'img__rest'} /></td>
          <td className="td__card-stats">{item.name}</td>
          <td className="td__card-stats txt__bold">{item.red}</td>
          <td className="td__card-stats">{item.yellow}</td>
          <td className="td__card-stats">{item.red + item.yellow}</td>
        </tr>
      )
  );
  return (
    <>
      <div className='card'>
        <table className="table__card">
          <tr className="table__card-title">
            <td></td>
            <td>Most Goals</td>
            <td>G</td>
            <td>A</td>
            <td>=</td>
          </tr>
          
          {showGoals}
        </table>

        <table className="table__card">
          <tr className="table__card-title">
            <td></td>
            <td>Most Assists</td>
            <td>A</td>
            <td>G</td>
            <td>=</td>
          </tr>
          
          {showAssists}
        </table>

        <table className="table__card">
          <tr className="table__card-title">
            <td></td>
            <td>Most Cards</td>
            <td><div className="red-card"></div></td>
            <td><div className="yellow-card"></div></td>
            <td>=</td>
          </tr>
          
          {showCards}
        </table>
      </div>
    </>
  );
}

export default Card;
