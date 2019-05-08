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
  data: null,
  local: {
    selectedDate: null
  }
}

// IMPORTANT: immer allows us to mutate the state
// without external side effects, but if the state
// is mutated you must return the state object
const rootReducer = createReducer(initialState, {
  [loadDataStart.type]: s => {
    s.state = loadDataStart.type
  },
  [loadDataOK.type]: (s, { payload: { timeline, ...other }, payload }) => {
    s.state = loadDataOK.type
    if (timeline === null) s.data = other
    else s.data = payload
  },
  [loadDataErr.type]: (s, { payload }) => {
    s.state = loadDataErr.type
    s.err = payload
  },
  [dateSelect.type]: (s, { payload }) => {
    s.local.selectedDate = payload
  }
})

export default rootReducer
