import React from 'react'
import { BrowserRouter as Router, Switch, Route, useRouteMatch, useParams } from 'react-router-dom'
import Header from './Header'
import Dashboard from './Dashboard'
import GroupsList from './GroupsList'
import GroupCreationForm from './GroupCreationForm'
import RetrospectiveCreationForm from './RetrospectiveCreationForm'

export default function App() {
  const GroupSwitch = () => {
    let match = useRouteMatch()

    return (
      <Switch>
        <Route path={`${match.path}/new`}>
          <GroupCreationForm />
        </Route>
        <Route path={match.path}>
          <GroupsList />
        </Route>
      </Switch>
    )
  }

  return (
    <Router>
      <div>
        <Header />

        <Switch>
          <Route path='/groups'>
            <GroupSwitch />
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
