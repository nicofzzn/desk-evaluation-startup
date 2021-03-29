import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Login } from './components/Login'

function App() {
  return (
    <Router>
      <div className='App'>
        <Route exact path='/login'>
          <Login />
        </Route>
      </div>
    </Router>
  )
}

export default App
