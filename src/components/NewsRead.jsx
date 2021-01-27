import React from 'react'
import {Link} from 'react-router-dom'
import {news} from '../data/news'

const NewsRead = ({match}) => {
  console.log(match)
  const showNews = news.filter(item => item.id === Number(match.params.id))
  .map(item => (
    <>
    <div className="news__box news__read">
      <div className="news__img-shadow">
      <img src={item.img} alt="Pic" className="news__img-big" />
      </div>
      
    <h1 className='news__title'>{item.title}</h1>
    <div className="news__text-big">
      <p>{item.description}</p>
    </div>
   <div className="news__change">
   <Link to={item.id>1 ? `/news/${item.id-1}` : `/news/`} className="news__change-prev">Prev
  {news.filter(item => item.id === Number(match.params.id)-1).map(next => <h5 className="news__change-title">{next.title}</h5>)}
   </Link>
   <Link to={item.id!==news.length-1 ? `/news/${item.id+1}` : `/news/`} className="news__change-next">Next
  {news.filter(item => item.id === Number(match.params.id)+1).map(next => <h5 className="news__change-title">{next.title}</h5>)}
   </Link>
   </div>

    </div>
   
    </>
  ))
  return (
    <main className="main">

    <section>

    <div className='container'>
      {showNews}
    </div>
    </section>
    </main>
  )
}

export default NewsRead
