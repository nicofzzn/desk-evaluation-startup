import { FC, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { useStoreActions, useStoreState } from '../store/hooks'
import { useScreenType } from './hooks/useScreenType'

const LoginContainer = styled.div<{ screenType: string }>`
  margin: 10vh auto;
  width: ${props => (props.screenType === 'fullscreen' ? '400px' : '100vw')};
`

const FormContainer = styled.div`
  /* box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.2); */
  padding: 0 2em;
  background-color: white;
`

const H1 = styled.h4`
  width: fit-content;
  margin: 1em auto;
  font-weight: 400;
`

export const Login: FC = () => {
  const { fetchUserLogin, setAlert } = useStoreActions(
    actions => actions.userModel
  )
  const { user, alert } = useStoreState(state => state.userModel)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const screenType = useScreenType()

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (emailRef.current && passwordRef.current) {
      fetchUserLogin({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
    }
  }

  useEffect(() => {
    return () => setAlert(null)
  }, [setAlert])

  if (user) return <Redirect to='/' />

  return (
    <LoginContainer screenType={screenType}>
      <H1>Login</H1>
      <FormContainer>
        {alert && (
          <Alert className='mb-3' variant='danger'>
            {alert.message}
          </Alert>
        )}
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
