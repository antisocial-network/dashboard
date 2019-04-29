import { createReducer } from 'redux-starter-kit'
import {
  loadDataStart,
  loadDataOK,
  loadDataErr,
  dateSelect
} from './actions'

const initialState = {
  state: null,
  err: null,
  data: null
}

// IMPORTANT: immer allows us to mutate the state
// without external side effects, but if the state
// is mutated you must return the state object
const rootReducer = createReducer(initialState, {
  [loadDataStart.type]: s => {
    s.state = loadDataStart.type
  },
  [loadDataOK.type]: (s, { payload }) => {
    s.state = loadDataOK.type
    s.data = payload
  },
  [loadDataErr.type]: (s, { payload }) => {
    s.state = loadDataErr.type
    s.err = payload
  },
  [dateSelect.type]: (s, { payload }) => {
    s.selectedDate = payload
  }
})

export default rootReducer
