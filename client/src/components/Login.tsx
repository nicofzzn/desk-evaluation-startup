import { FC, useRef } from 'react'
import styled from 'styled-components'
import { Button, Form } from 'react-bootstrap'
import axios from 'axios'

import { useStoreActions } from '../store/hooks'

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
  const { fetchUser, setLoading } = useStoreActions(
    actions => actions.userModel
  )
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (emailRef.current && passwordRef.current) {
      setLoading()
      axios
        .post('/api/auth/login', {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        })
        .then(res => {
          fetchUser(res.data)
          setLoading()
        })
        .catch(err => {
          console.log(err.response.data)
          setLoading()
        })
    }
  }

  return (
    <LoginContainer>
      <H1>Login</H1>
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
          <Button type='submit'>Login</Button>
        </Form>
      </FormContainer>
    </LoginContainer>
  )
}
