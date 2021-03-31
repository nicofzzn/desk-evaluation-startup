import { FC, useState } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { useStoreState, useStoreActions } from '../store/hooks'

const RegisterContainer = styled.div`
  margin: 5vh auto;
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

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const Register: FC = () => {
  const { user, error, success } = useStoreState(state => state.userModel)
  const { register } = useStoreActions(actions => actions.userModel)
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    })
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    register(registerForm)
  }

  return user ? (
    <Redirect to='/' />
  ) : (
    <RegisterContainer>
      <H1>Register</H1>
      {success && <Alert variant='success'>{success.message}</Alert>}
      {error && <Alert variant='danger'>{error.message}</Alert>}
      <FormContainer>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              name='name'
              value={registerForm.name}
              onChange={onInputChange}
              type='text'
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              name='email'
              value={registerForm.email}
              onChange={onInputChange}
              type='email'
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              name='password'
              value={registerForm.password}
              onChange={onInputChange}
              type='password'
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              name='confirmPassword'
              value={registerForm.confirmPassword}
              onChange={onInputChange}
              type='password'
            />
          </Form.Group>
          <Link className='float-right' to='/login'>
            Login
          </Link>
          <Button type='submit' className='mt-3 w-100'>
            Register
          </Button>
        </Form>
      </FormContainer>
    </RegisterContainer>
  )
}
