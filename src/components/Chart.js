
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { dateSelect, loadData } from '../model/actions'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { ChartCanvas, Chart } from 'react-stockcharts'
import {
  BarSeries,
  CandlestickSeries
} from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  PriceCoordinate
} from 'react-stockcharts/lib/coordinates'

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'

import { Annotate, SvgPathAnnotation, LabelAnnotation } from 'react-stockcharts/lib/annotation'
import { ClickCallback } from 'react-stockcharts/lib/interactive'

import { fitWidth } from 'react-stockcharts/lib/helper'
import { last } from 'react-stockcharts/lib/utils'

// const macdAppearance = {
//   stroke: {
//     macd: '#FF0000',
//     signal: '#00F300'
//   },
//   fill: {
//     divergence: '#4682B4'
//   }
// }

class CandlestickChart extends React.Component {
  constructor (props) {
    super(props)
    this.saveCanvasNode = this.saveCanvasNode.bind(this)
  }
  saveCanvasNode (node) {
    this.canvasNode = node
  }
  render () {
    // const ema26 = ema()
    //   .id(0)
    //   .options({ windowSize: 26 })
    //   .merge((d, c) => { d.ema26 = c })
    //   .accessor(d => d.ema26)

    // const ema12 = ema()
    //   .id(1)
    //   .options({ windowSize: 12 })
    //   .merge((d, c) => { d.ema12 = c })
    //   .accessor(d => d.ema12)

    // const macdCalculator = macd()
    //   .options({
    //     fast: 12,
    //     slow: 26,
    //     signal: 9
    //   })
    //   .merge((d, c) => { d.macd = c })
    //   .accessor(d => d.macd)

    const { type, data: initialData, width, ratio } = this.props

    // const calculatedData = macdCalculator(ema12(ema26(initialData)))
    const xScaleProvider = discontinuousTimeScaleProvider
      .inputDateAccessor(d => d.date)
    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor
    } = xScaleProvider(/* calculatedData */ initialData)

    const start = xAccessor(last(data))
    const end = xAccessor(data[Math.max(0, data.length - 150)])
    const xExtents = [start, end]

    const fontFamily = 'Avenir Next LT Pro, Avenir Next, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif'

    return (
      <ChartCanvas ref={this.saveCanvasNode}
        height={500}
        width={width}
        ratio={ratio}
        margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
        type={type}
        seriesName='MSFT'
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
        clamp
      >
        <Chart id={1} height={450}
          yExtents={[d => [d.high, d.low]]}
          padding={{ top: 0, bottom: 150 }}
        >

          <Annotate with={SvgPathAnnotation}
            usingProps={{
              path: ({ x }) => `M${x + 0.5},0v427`,
              stroke: 'black',
              opacity: 0.4
            }}
            when={d => (this.props.local || {}).selectedDate && d.date.toString() === this.props.local.selectedDate.date.toString()} />
          <Annotate with={LabelAnnotation}
            usingProps={{
              text: d => timeFormat('%-d %b')(d.date),
              fontSize: '1.5rem',
              fontFamily,
              y: 450
            }}
            when={d => (this.props.local || {}).selectedDate && d.date.toString() === this.props.local.selectedDate.date.toString()} />
          <YAxis axisAt='right' orient='right' ticks={5}
            fontFamily={fontFamily} />
          <MouseCoordinateY
            at='right'
            orient='right'
            displayFormat={format('.2f')}
            fontFamily={fontFamily} />

          <CandlestickSeries />

          <PriceCoordinate
            price={50}
            at='right'
            orient='right'
            displayFormat={format('d')}
            fill='transparent'
            textFill='transparent'
          />

          {/* <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />
          <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} /> */}

          {/* <CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />
          <CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} /> */}

          {/* <EdgeIndicator itemType='last' orient='right' edgeAt='right'
            yAccessor={d => d.close} fill={d => d.close > d.open ? '#6BA583' : '#FF0000'} /> */}

          {/* <MovingAverageTooltip
            onClick={e => console.log(e)}
            origin={[2, 15]}
            options={[
              {
                yAccessor: ema26.accessor(),
                type: ema26.type(),
                stroke: ema26.stroke(),
                windowSize: ema26.options().windowSize
              },
              {
                yAccessor: ema12.accessor(),
                type: ema12.type(),
                stroke: ema12.stroke(),
                windowSize: ema12.options().windowSize
              }
            ]}
          /> */}
          <ClickCallback
            onClick={({ currentItem }) => this.props.dateSelect(currentItem)}
          />
        </Chart>
        <Chart id={2} height={150}
          yExtents={[d => [1, d.volume]]}
          origin={(w, h) => [0, h - 200]}
        >
          <YAxis axisAt='left' orient='left' ticks={5} tickFormat={format('.2s')} fontFamily={fontFamily} />
          <XAxis axisAt='bottom' orient='bottom' fontFamily={fontFamily} />

          <MouseCoordinateY
            at='left'
            orient='left'
            displayFormat={format('.4s')}
            fontFamily={fontFamily} />

          <MouseCoordinateX
            at='bottom'
            orient='bottom'
            displayFormat={timeFormat('%Y-%m-%d')}
            fontFamily={fontFamily} />

          <BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? '#6BA583' : '#FF0000'} />

          <XAxis axisAt='bottom' orient='bottom' showTicks={false} outerTickSize={0} fontFamily={fontFamily} />
        </Chart>
        {/* <Chart id={3} height={150}
          yExtents={macdCalculator.accessor()}
          origin={(w, h) => [0, h - 150]} padding={{ top: 10, bottom: 10 }}
        >
          <YAxis axisAt='right' orient='right' ticks={2} />

          <MouseCoordinateX
            at='bottom'
            orient='bottom'
            displayFormat={timeFormat('%Y-%m-%d')} />
          <MouseCoordinateY
            at='right'
            orient='right'
            displayFormat={format('.2f')} />
          <MACDSeries yAccessor={d => d.macd}
            {...macdAppearance} />
          <MACDTooltip
            origin={[2, 15]}
            yAccessor={d => d.macd}
            options={macdCalculator.options()}
            appearance={macdAppearance}
          />
        </Chart> */}
        <CrossHairCursor />
      </ChartCanvas>
    )
  }
}

CandlestickChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired
}

CandlestickChart.defaultProps = {
  type: 'svg'
}

const CandleStickChartWithInteractiveIndicator = fitWidth(CandlestickChart)

export default connect(
  s => ({}),
  d => bindActionCreators({
    dateSelect,
    loadData
  }, d)
)(CandleStickChartWithInteractiveIndicator)
