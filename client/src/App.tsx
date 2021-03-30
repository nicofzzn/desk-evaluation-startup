// import { useRef } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { Login } from './components/Login'
import { useStoreState } from './store/hooks'

function App() {
  const { user, loading } = useStoreState(state => state.userModel)

  return (
    <Router>
      <div className='App'>
        {user && user.name}
        {loading && <Spinner animation='border' />}
        {loading ? 'true' : 'false'}
        <Route exact path='/login'>
          {user ? <Redirect to='/' /> : <Login />}
        </Route>
      </div>
    </Router>
  )
}

export default App
