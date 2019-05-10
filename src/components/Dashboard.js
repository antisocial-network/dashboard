import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { last } from 'react-stockcharts/lib/utils'
import { timeFormat } from 'd3-time-format'

import logo from '../assets/logo.svg'
import Chart from './Chart'
import { loadData, setHandle } from '../model/actions'
import '../styles/App.css'

function Dashboard (props) {
  const data = (props.local || {}).selectedDate || ((props.data || {}).timeline && last(props.data.timeline)) || null
  const diff = (data && (data.close - data.open).toFixed(2)) || 0

  useEffect(() => {
    props.setHandle(props.match.params.handle)
  }, [props.match.params.handle])

  useEffect(() => {
    props.local.handle && props.loadData(props.local.handle)
  }, [props.local.handle])

  useEffect(() => {
    (props.local.selectedDate || {}).date && props.loadData(props.local.handle, false, props.local.selectedDate.date, new Date(props.local.selectedDate.date - 86400000))
  }, [props.local.selectedDate && props.local.selectedDate.date])

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
              {((props.data || {}).brand || {}).name || 'Apple, Inc.'}
            </h3>
            <h3 className='App-handle'>
              @{props.local.handle}
            </h3>
          </div>
        </div>
        <div className='App-card App-card-right App-hidden-sm'>
          { data && (<div className='App-card-line'>
            <h2 className='App-date'>
              { timeFormat('%-d %b %Y')(data.date) }
            </h2>
            <h2 className='App-stock App-hidden-md'>
              {(((props.data || {}).brand || {})['stock-ticker'] || 'AAPL').toUpperCase()}
            </h2>
          </div>) }
        </div>
      </header>
      { ((props.err || (props.data && (props.data.timeline || []).length === 0)) && (
        <section className='App-row'>
          <div className='App-block'>
            <h2>Unknown handle or other error.</h2>
          </div>
        </section>)) || (
        <section className='App-row'>
          <div className='App-block App-block-wider App-pinned App-nopad-md'>
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
            {(props.data || {}).tweets && props.data.tweets.slice(0, 3).map(x => (
              <a key={x.id} href={`https://twitter.com/${encodeURIComponent(x.user.screen_name)}/status/${x.id_str}`} rel='noopener noreferrer' target='_blank'>
                <figure className='App-media'>
                  <span className='App-media-text'>{(x.extended_tweet || {}).full_text || x.text}</span>
                  <figcaption>
                    <span className='App-caption-author'>{x.user.name}</span>&ensp;&middot;&ensp;
                    <span className='App-caption-username'>@{x.user.screen_name}</span>&ensp;&middot;&ensp;
                    <span className='App-caption-date'>{ timeFormat('%H:%m')(x.timestamp) }</span>&ensp;&middot;&ensp;
                    {x.sentiment >= 0 ? '🔼' : '🔽'} <span className='App-caption-retweets'>{(x.sentiment * 50 + 50).toFixed(1)}</span>
                  </figcaption>
                </figure>
              </a>
            ))}

            <br />
            <h3>News Stories</h3>
            {(props.data || {}).news && props.data.news.slice(0, 3).map(x => (
              <a key={x.url} href={x.url} target='_blank' rel='noopener noreferrer'>
                <figure className='App-media'>
                  {x.title}
                  <figcaption>
                    {x.description} <br />
                    <span className='App-caption-author'>{x.author}</span>&ensp;&middot;&ensp;
                    <span className='App-caption-publication'>{x.source.name}</span>
                  </figcaption>
                </figure>
              </a>))}
          </div>
        </section>
      )}
    </div>)
}

export default withRouter(connect(
  s => s,
  d => bindActionCreators({
    loadData, setHandle
  }, d)
)(Dashboard))
