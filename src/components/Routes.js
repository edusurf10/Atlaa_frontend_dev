import React from 'react'
import Panel from '../pages/Panel'
import Home from '../pages/Home'
import NotFound from './NotFound'
import PrivateRoute from './PrivateRoute'
import { history } from '../history'
import Play from '../pages/Play'
const { Router, Switch, Route } = require("react-router")

const Routes = () => (
  <Router history={history}>
    <Switch>
      <PrivateRoute component={Panel} exact path='/panel' />
      <PrivateRoute component={Play} exact path='/play/:id' />
      <Route component={Home} exact path='/' />
      <PrivateRoute component={NotFound} />
    </Switch>
  </Router>
)

export default Routes