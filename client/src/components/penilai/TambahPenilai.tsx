import { FC, useLayoutEffect, useState } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../../store/hooks'

interface FormField {
  name: string
  email: string
  password: string
}

const TambahPenilaiContainer = styled.div`
  padding-bottom: 5em;
`

const defaultFormValue = {
  name: '',
  email: '',
  password: '',
}

export const TambahPenilai: FC = () => {
  const [formField, setFormField] = useState<FormField>(defaultFormValue)
  const { addPenilai, setAlert } = useStoreActions(actions => actions.userModel)
  const { alert, loadingPenilai } = useStoreState(state => state.userModel)

  function onFormFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormField({ ...formField, [e.target.name]: e.target.value })
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    addPenilai({
      formField,
      clearForm: () => {
        setFormField(defaultFormValue)
      },
    })
  }

  useLayoutEffect(() => {
    return () => {
      setAlert(null)
    }
  }, [setAlert])

  return (
    <TambahPenilaiContainer>
      {loadingPenilai ? (
        <SpinnerContainer>
          <Spinner animation='border' />
        </SpinnerContainer>
      ) : (
        <>
          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                onChange={onFormFieldChange}
                value={formField.name}
                name='name'
                type='text'
                required
                disabled={loadingPenilai}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                onChange={onFormFieldChange}
                value={formField.email}
                name='email'
                type='email'
                required
                disabled={loadingPenilai}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={onFormFieldChange}
                value={formField.password}
                name='password'
                type='text'
                required
                disabled={loadingPenilai}
              />
            </Form.Group>
            <Button
              disabled={
                loadingPenilai ||
                !formField.name ||
                !formField.email ||
                !formField.password
              }
              className='float-right'
              variant='custom-primary'
              type='submit'
            >
              {loadingPenilai ? <Spinner animation='border' /> : 'Submit'}
            </Button>
          </Form>
        </>
      )}
    </TambahPenilaiContainer>
  )
}

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 20vh;
`
