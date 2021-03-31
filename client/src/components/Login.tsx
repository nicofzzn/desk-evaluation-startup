import { FC, useRef } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form } from 'react-bootstrap'

import { useStoreActions, useStoreState } from '../store/hooks'
import { Link, Redirect } from 'react-router-dom'

const LoginContainer = styled.div`
  margin: 10vh auto;
  width: 400px;
`

const FormContainer = styled.div`
  box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.2);
  padding: 2em;
  background-color: white;
`

const H1 = styled.h4`
  width: fit-content;
  margin: 1em auto;
  font-weight: 400;
`

export const Login: FC = () => {
  const { fetchUserLogin } = useStoreActions(actions => actions.userModel)
  const { user, error } = useStoreState(state => state.userModel)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (emailRef.current && passwordRef.current) {
      fetchUserLogin({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
    }
  }

  return user ? (
    <Redirect to='/' />
  ) : (
    <LoginContainer>
      <H1>Login</H1>
      {error && <Alert variant='danger'>{error.message}</Alert>}
      <FormContainer>
        <Form onSubmit={e => handleLogin(e)}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control ref={emailRef} type='email' />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control ref={passwordRef} type='password' />
          </Form.Group>
          <Link className='float-right' to='/register'>
            Register
          </Link>
          <Button type='submit' className='mt-3 w-100'>
            Login
          </Button>
        </Form>
      </FormContainer>
    </LoginContainer>
  )
}
