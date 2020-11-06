import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, useParams, withRouter } from 'react-router-dom'
import Header from './Header'
import Dashboard from './Dashboard'
import GroupsList from './GroupsList'
import GroupDetails from './GroupDetails'
import GroupCreationForm from './GroupCreationForm'
import RetrospectiveCreationForm from './RetrospectiveCreationForm'
import RetrospectiveContainer from './RetrospectiveContainer'
import { get, put } from '../lib/httpClient'
import { historyShape } from 'lib/utils/shapes'
import AuthenticationForm from './AuthenticationForm'

const App = withRouter(({ history }) => {
  const initialParams = new URLSearchParams(window.location.search)
  const [loggedIn, setLoggedIn] = useState(null)
  const [initialEmail] = useState(initialParams.get('email'))
  const [pendingInvitation, setPendingInvitation] = useState(initialParams.get('invitation_id'))
  const [returnUrl, setReturnUrl] = useState()
  const onLoginPage = history.location.pathname.match(/\/sessions\/new/)

  React.useEffect(() => {
    // Clean query parameters
    const params = new URLSearchParams(window.location.search)
    if (params.get('email') || params.get('invitation_id')) {
      params.delete('email')
      params.delete('invitation_id')
      const newUrl = `${window.location.pathname}${params.toString().length > 0 ? '?' : ''}${params.toString()}`
      history.replace(newUrl)
    }
  }, [])

  React.useEffect(() => {
    // Get login state
    get({ url: '/api/account' })
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false))
  }, [])

  React.useEffect(() => {
    if (loggedIn && pendingInvitation) {
      // Consumming invitation once logged in
      put({ url: `/api/pending_invitations/${pendingInvitation}` })
        .then(() => setPendingInvitation(false))
        .catch(() => {
          alert('This invitation is not valid anymore') // TODO: Use a component for alerts
          setLoggedIn(false)
        })
    }
  }, [loggedIn, pendingInvitation])

  React.useEffect(() => {
    // Redirect to login page
    if (loggedIn === false && !onLoginPage) {
      const returnUrl = `${window.location.pathname}?${initialParams.toString()}`
      if (returnUrl) setReturnUrl(returnUrl)
      history.replace('/sessions/new')
    }
  }, [loggedIn, initialEmail, initialParams, history, onLoginPage])

  const GroupShow = () => {
    let params = useParams()
    return <GroupDetails id={params.groupId }/>
  }

  const RetrospectiveShow = () => {
    let params = useParams()
    return <RetrospectiveContainer id={params.retrospectiveId} />
  }

  if (!onLoginPage && (!loggedIn || pendingInvitation)) return null

  return (
    <div>
      <Header />

      <Switch>
        <Route path='/sessions/new'>
          <AuthenticationForm
            defaultEmail={initialEmail}
            onLogIn={() => {
              console.log('Logged in, redirecting to', returnUrl ? returnUrl : '/')
              setLoggedIn(true)
              history.replace(returnUrl ? returnUrl : '/')
             }} />
        </Route>
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
})

App.propTypes = {
  history: historyShape
}

const AppWithRouter = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWithRouter
