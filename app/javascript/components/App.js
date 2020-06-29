import React from 'react'
import { BrowserRouter as Router, Switch, Route, useRouteMatch, useParams } from 'react-router-dom'
import Header from './Header'
import Dashboard from './Dashboard'
import GroupsList from './GroupsList'
import GroupDetails from './GroupDetails'
import GroupCreationForm from './GroupCreationForm'
import RetrospectiveCreationForm from './RetrospectiveCreationForm'

export default function App() {
  const GroupShow = () => {
    let params = useParams()
    return < GroupDetails id={params.groupId} />
  }

  return (
    <Router>
      <div>
        <Header />

        <Switch>
          <Route path='/groups/new'>
            <GroupCreationForm />
          </Route>
          <Route path='/groups/:groupId'>
            <GroupShow />
          </Route>
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
