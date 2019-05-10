/* global fetch */
import { timeFormat } from 'd3-time-format'

const parseData = timeline => async d => ({
  ...d,
  timeline: (timeline && d.timeline.map((x, i, a) => ({
    date: new Date(x.date),
    open: (i ? a[i - 1] : x).average * 50 + 50,
    close: x.average * 50 + 50,
    high: Math.min(100, Math.max((i ? a[i - 1] : x).average * 50 + 50, x.average * 50 + 50) + x.stdev * 50),
    low: Math.max(0, Math.min((i ? a[i - 1] : x).average * 50 + 50, x.average * 50 + 50) - x.stdev * 50),
    volume: x.count
  }))) || null
})

export function fetchData (ticker, timeline = true, dateTo, dateFrom = '20010101') {
  if (dateTo === undefined) dateTo = timeFormat('%Y%b%d')(new Date())

  const promiseData = fetch(`/api/?ticker=%40${ticker}&min_time=${dateFrom}&max_time=${dateTo}`)
    .then(response => response.json())
    .then(parseData(timeline))
  return promiseData
}
