import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './Header'
import Dashboard from './Dashboard'
import GroupsList from './GroupsList'
import RetrospectiveCreationForm from './RetrospectiveCreationForm'

export default function App() {
  return (
    <Router>
      <div>
        <Header />

        <Switch>
          <Route path='/groups'>
            <GroupsList />
          </Route>
          <Route path='/retrospectives/new'>
            <RetrospectiveCreationForm />
          </Route>
          <Route path='/'>
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
