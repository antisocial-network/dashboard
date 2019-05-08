import { createAction } from 'redux-starter-kit'
import { fetchData } from '../utils/Model.utils'

export const loadDataStart = createAction('loadData.start')
export const loadDataOK = createAction('loadData.ok')
export const loadDataErr = createAction('loadData.err')

export const loadData = (...args) => dispatch => {
  fetchData(...args)
    .then(x => dispatch(loadDataOK(x)))
    .catch(e => dispatch(loadDataErr(e)))
}

export const dateSelect = createAction('dateSelect')
