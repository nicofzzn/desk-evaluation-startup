import { FC } from 'react'
import styled from 'styled-components'
import { Form } from 'react-bootstrap'

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
  return (
    <LoginContainer>
      <H1>Login</H1>
      <FormContainer>
        <Form>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' />
          </Form.Group>
        </Form>
      </FormContainer>
    </LoginContainer>
  )
}
