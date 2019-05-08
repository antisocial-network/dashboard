import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { last } from 'react-stockcharts/lib/utils'
import { timeFormat } from 'd3-time-format'

import logo from '../assets/logo.svg'
import Chart from './Chart'
import { loadData } from '../model/actions'
import '../styles/App.css'

function App (props) {
  const data = (props.local || {}).selectedDate || ((props.data || {}).timeline && last(props.data.timeline)) || null
  const diff = (data && (data.close - data.open).toFixed(2)) || 0

  window.data = props.data

  useEffect(() => {
    props.state || props.loadData()
  })

  return (
    <div className={`App ${diff > 0 ? 'App-pos' : 'App-neg'}`}>
      <header className='App-header App-pinned'>
        <img src={logo} className='App-logo' alt='sentidash' />
        <div className='App-card'>
          <div className='App-card-line'>
            { data && (<strong className='App-value'>
              { data.close.toFixed(2) }
              <sup className='App-change'>
                { diff > 0 ? '+' + diff : diff }
              </sup>
            </strong>) }
          </div>
          <div className='App-card-line'>
            <h3 className='App-company'>
              {((props.data || {}).company || {}).name || 'Apple, Inc.'}
            </h3>
            <h3 className='App-handle'>
              @{((props.data || {}).company || {}).handle || 'Apple'}
            </h3>
          </div>
        </div>
        <div className='App-card App-card-right App-hidden-sm'>
          { data && (<div className='App-card-line'>
            <h2 className='App-date'>
              { timeFormat('%-d %b %Y')(data.date) }
            </h2>
            <h2 className='App-stock App-hidden-md'>
              {((props.data || {}).company || {}).ticker || 'AAPL'}
            </h2>
          </div>) }
        </div>
      </header>
      <section class='App-row'>
        <div className='App-block App-block-wider App-pinned App-nopad-md App-hidden-sm'>
          { props.data && props.data.timeline
            ? (<Chart type='hybrid' data={props.data.timeline} />)
            : 'Loading...'
          }
        </div>
        <div className='App-block App-block-narrower'>
          {/* <h3>Top Tags</h3>
          <div className='App-media App-media-invisible'>
            <span className='App-tag App-pos'>xbox</span>
            <span className='App-tag App-neg'>windows</span>
            <span className='App-tag App-pos'>skype</span>
            <span className='App-tag App-neg'>apple</span>
            <span className='App-tag App-pos'>azure</span>
          </div>
          <br /> */}

          <h3>Top Tweets</h3>
          {props.data && props.data.tweets.slice(0, 3).map(x => (<figure className='App-media'>
            <span className='App-media-text'>{x.text}</span>
            <figcaption>
              <span className='App-caption-author'>{x.user.name}</span>&ensp;&middot;&ensp;
              <span className='App-caption-username'>@{x.user.screen_name}</span>&ensp;&middot;&ensp;
              <span className='App-caption-date'>{ timeFormat('%H:%m')(x.timestamp) }</span>&ensp;&middot;&ensp;
              ➰ <span className='App-caption-retweets'>{x.retweet_count}</span>
            </figcaption>
          </figure>))}

          {/* <br />
          <h3>News Stories</h3>
          {props.data.news.map(x => (<figure className='App-media'>
            <figure>{x.text}
            <figcaption>
              <span className='App-caption-author'>James</span>&ensp;&middot;&ensp;
              <span className='App-caption-publication'>Ars Technica</span>&ensp;&middot;&ensp;
            </figcaption>
            </figure>
          </figure>))} */}
        </div>
      </section>
    </div>
  )
}

export default connect(
  s => s,
  d => bindActionCreators({
    loadData
  }, d)
)(App)
