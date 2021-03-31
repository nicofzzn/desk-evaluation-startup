import { useLayoutEffect } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import styled from 'styled-components'
import { Login } from './components/Login'
import { useStoreState, useStoreActions } from './store/hooks'
// componenets
import { Dashboard } from './components/Dashboard'
import { PrivateRoute } from './components/routes/PrivateRoute'
import { Register } from './components/Register'

const SpinnerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`

function App() {
  const { user, loading } = useStoreState(state => state.userModel)
  const { fetchUser } = useStoreActions(actions => actions.userModel)

  useLayoutEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <Router>
      {loading ? (
        <SpinnerContainer>
          <Spinner animation='border' />
        </SpinnerContainer>
      ) : (
        <div className='App'>
          <PrivateRoute path='/'>
            <Dashboard />
          </PrivateRoute>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/register'>
            <Register />
          </Route>
        </div>
      )}
    </Router>
  )
}

export default App
