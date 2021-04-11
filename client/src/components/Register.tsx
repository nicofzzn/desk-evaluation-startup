import { FC, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { useStoreState, useStoreActions } from '../store/hooks'
import { useScreenType } from './hooks/useScreenType'

const RegisterContainer = styled.div<{ screenType: string }>`
  margin: 5vh auto;
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

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2em;
  gap: 1em;
`

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const Register: FC = () => {
  const { user, alert } = useStoreState(state => state.userModel)
  const { register, setAlert } = useStoreActions(actions => actions.userModel)
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const screenType = useScreenType()

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

  useEffect(() => {
    return () => setAlert(null)
  }, [setAlert])

  return user ? (
    <Redirect to='/' />
  ) : (
    <RegisterContainer screenType={screenType}>
      <H1>Register</H1>
      <FormContainer>
        {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
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
          <ButtonContainer>
            <Button
              type='submit'
              className='w-100'
              disabled={hasEmptyField(registerForm)}
            >
              Register
            </Button>
            <div>
              Already have an account? <Link to='/login'>Login</Link>
            </div>
          </ButtonContainer>
        </Form>
      </FormContainer>
    </RegisterContainer>
  )
}

export function hasEmptyField(form: any) {
  const fields = Object.values(form)

  for (const f of fields) {
    if (f === '') return true
  }

  return false
}
