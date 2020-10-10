import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom'
import Header from './Header'
import Dashboard from './Dashboard'
import GroupsList from './GroupsList'
import GroupDetails from './GroupDetails'
import GroupCreationForm from './GroupCreationForm'
import RetrospectiveCreationForm from './RetrospectiveCreationForm'
import RetrospectiveContainer from './RetrospectiveContainer'
import { get, put } from '../lib/httpClient'

const MainLayout = () => {
  const GroupShow = () => {
    let params = useParams()
    return <GroupDetails id={params.groupId} />
  }

  const RetrospectiveShow = () => {
    let params = useParams()
    return <RetrospectiveContainer id={params.retrospectiveId} />
  }

  return (
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
        <Route path='/retrospectives/:retrospectiveId'>
          <RetrospectiveShow />
        </Route>
        <Route path='/'>
          <Dashboard />
        </Route>
      </Switch>
    </div>
  )
}

const App = () => {
  const params = new URLSearchParams(window.location.search)
  const [loggedIn, setLoggedIn] = useState(null)
  const [pendingInvitation, setPendingInvitation] = useState(params.get('invitation_id'))

  React.useEffect(() => {
    get({ url: '/api/account' })
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false))
  }, [])

  React.useEffect(() => {
    const consumeInvitation = () => {
      setPendingInvitation(false)
      params.delete('invitation_id')
      const newUrl = `${window.location.pathname}${params.toString().length > 0 ? '?' : ''}${params.toString()}`
      history.replaceState(null, '', newUrl)
    }

    if (loggedIn && pendingInvitation) {
      put({ url: `/api/pending_invitations/${params.get('invitation_id')}` })
        .then(consumeInvitation)
        .catch(() => {
          alert('This invitation is not valid anymore') // TODO: Use a component for alerts
          setLoggedIn(false)
        })
    }
  }, [loggedIn, pendingInvitation, params])

  if (loggedIn === null) return null

  if (!loggedIn) {
    history.replaceState(null, '', '/sessions/new?return_url=' + window.location.pathname + window.location.search)
    return null
  }

  if (pendingInvitation) return null

  return (
    <Router>
      <MainLayout />
    </Router>
  )
}

export default App
