import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { useStoreActions, useStoreState } from '../store/hooks'
import { useScreenType } from './hooks/useScreenType'
import { hasEmptyField } from './Register'

const LoginContainer = styled.div<{ screenType: string }>`
  margin: 10vh auto;
  width: ${props => (props.screenType === 'fullscreen' ? '400px' : '100vw')};
`

const FormContainer = styled.div`
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
  const [loginField, setLoginField] = useState<{
    email: string
    password: string
  }>({ email: '', password: '' })
  const { user, alert } = useStoreState(state => state.userModel)
  const screenType = useScreenType()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    fetchUserLogin(loginField)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginField({
      ...loginField,
      [e.target.name]: e.target.value,
    })
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
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={loginField.email}
              type='email'
              name='email'
              onChange={onInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={loginField.password}
              type='password'
              name='password'
              onChange={onInputChange}
            />
          </Form.Group>
          <Link className='float-right' to='/register'>
            Register
          </Link>
          <Button
            type='submit'
            className='mt-3 w-100'
            disabled={hasEmptyField(loginField)}
          >
            Login
          </Button>
        </Form>
      </FormContainer>
    </LoginContainer>
  )
}
