import React from 'react'
import { Route, Redirect } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import Dashboard from './Dashboard'

function App () {
  return (
    <BrowserRouter>
      <Route exact path='/' render={props => (<Redirect to='/Apple' />)} />
      <Route path='/:handle' component={Dashboard} />
    </BrowserRouter>
  )
}

export default App
