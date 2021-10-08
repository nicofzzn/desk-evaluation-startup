import { FC, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { Form, Spinner, Alert, Button } from 'react-bootstrap'

export const PenilaiEditPassword: FC = () => {
  const [formField, setFormField] = useState<{ password: string; name: string }>({
    password: '',
    name: '',
  })
  const { penilaiId } = useParams<{ penilaiId: string }>()
  const { loadingPenilai, alert, penilai } = useStoreState(state => state.userModel)
  const { setAlert, updatePenilaiPassword } = useStoreActions(
    actions => actions.userModel
  )

  function onFormFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormField({ ...formField, [e.target.name]: e.target.value })
  }

  function getPenilai(penilaiId: string) {
    return penilai?.find(p => p._id === penilaiId)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    updatePenilaiPassword({
      id: penilaiId,
      password: formField.password,
      clearForm: () => {
        setFormField({ name: '', password: '' })
      },
    })
  }

  useLayoutEffect(() => {
    return () => {
      setAlert(null)
    }
  }, [setAlert])

  return (
    <PenilaiEditPasswordContainer>
      {loadingPenilai ? (
        <SpinnerContainer>
          <Spinner animation='border' />
        </SpinnerContainer>
      ) : (
        <div>
          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                name='nama'
                value={getPenilai(penilaiId)?.name}
                type='text'
                required
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={onFormFieldChange}
                name='password'
                type='text'
                required
                disabled={loadingPenilai}
              />
            </Form.Group>
            <Button
              disabled={loadingPenilai || !formField.password}
              className='float-right'
              variant='custom-primary'
              type='submit'
            >
              {loadingPenilai ? <Spinner animation='border' /> : 'Submit'}
            </Button>
          </Form>
        </div>
      )}
    </PenilaiEditPasswordContainer>
  )
}

const PenilaiEditPasswordContainer = styled.div`
  padding-bottom: 5em;
`

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 50vh;
`
