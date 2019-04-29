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
  const data = props.selectedDate || (props.data && last(props.data)) || null
  const diff = (data && (data.close - data.open).toFixed(2)) || 0

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
              Microsoft, Inc.
            </h3>
            <h3 className='App-handle'>
              @Microsoft
            </h3>
          </div>
        </div>
        <div className='App-card App-card-right App-hidden-sm'>
          { data && (<div className='App-card-line'>
            <h2 className='App-date'>
              { timeFormat('%-d %b %Y')(data.date) }
            </h2>
            <h2 className='App-stock App-hidden-md'>
              MSFT
            </h2>
          </div>) }
        </div>
      </header>
      <section class='App-row'>
        <div className='App-block App-block-wider App-pinned App-nopad-md App-hidden-sm'>
          { props.data
            ? (<Chart type='hybrid' data={props.data} />)
            : 'Loading...'
          }
        </div>
        <div className='App-block App-block-narrower'>
          <h3>Top Tags</h3>
          <div className='App-media App-media-invisible'>
            <span className='App-tag App-pos'>xbox</span>
            <span className='App-tag App-neg'>windows</span>
            <span className='App-tag App-pos'>skype</span>
            <span className='App-tag App-neg'>apple</span>
            <span className='App-tag App-pos'>azure</span>
          </div>
          <br />

          <h3>Top Tweets</h3>
          <div className='App-media'>
            <figure>Microsoft is announcing an exciting new Xbox at CES...</figure>
            <caption>
              <span className='App-caption-author'>James</span>&ensp;&middot;&ensp;
              <span className='App-caption-username'>@jda0_</span>&ensp;&middot;&ensp;
              <span className='App-caption-date'>1:50 PM</span>&ensp;&middot;&ensp;
              ➰ <span className='App-caption-retweets'>150</span>
            </caption>
          </div>
          <div className='App-media'>
            <figure>Microsoft is announcing an exciting new Xbox at CES...</figure>
            <caption>
              <span className='App-caption-author'>James</span>&ensp;&middot;&ensp;
              <span className='App-caption-username'>@jda0_</span>&ensp;&middot;&ensp;
              <span className='App-caption-date'>1:50 PM</span>&ensp;&middot;&ensp;
              ➰ <span className='App-caption-retweets'>150</span>
            </caption>
          </div>
          <div className='App-media'>
            <figure>Microsoft is announcing an exciting new Xbox at CES...</figure>
            <caption>
              <span className='App-caption-author'>James</span>&ensp;&middot;&ensp;
              <span className='App-caption-username'>@jda0_</span>&ensp;&middot;&ensp;
              <span className='App-caption-date'>1:50 PM</span>&ensp;&middot;&ensp;
              ➰ <span className='App-caption-retweets'>150</span>
            </caption>
          </div>

          <br />
          <h3>News Stories</h3>
          <div className='App-media'>
            <figure>Microsoft is announcing an exciting new Xbox at CES...</figure>
            <caption>
              <span className='App-caption-author'>James</span>&ensp;&middot;&ensp;
              <span className='App-caption-publication'>Ars Technica</span>&ensp;&middot;&ensp;
            </caption>
          </div>
          <div className='App-media'>
            <figure>Microsoft is announcing an exciting new Xbox at CES...</figure>
            <caption>
              <span className='App-caption-author'>James</span>&ensp;&middot;&ensp;
              <span className='App-caption-publication'>Ars Technica</span>&ensp;&middot;&ensp;
            </caption>
          </div>
          <div className='App-media'>
            <figure>Microsoft is announcing an exciting new Xbox at CES...</figure>
            <caption>
              <span className='App-caption-author'>James</span>&ensp;&middot;&ensp;
              <span className='App-caption-publication'>Ars Technica</span>&ensp;&middot;&ensp;
            </caption>
          </div>
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
