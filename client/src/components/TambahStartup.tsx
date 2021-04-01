import { FC, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { useStoreActions, useStoreState } from '../store/hooks'

const TambahStartupContainer = styled.div`
  width: 500px;
  padding-bottom: 5em;
`

interface FormField {
  nama: string
  tahunPendanaan: string
  versiProfilPendanaan: string
  formPenilaian: string
}

export const TambahStartup: FC = () => {
  const [formField, setFormField] = useState<FormField>({
    nama: '',
    tahunPendanaan: '',
    versiProfilPendanaan: '',
    formPenilaian: '',
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const { addStartup, setAlert, setLoading } = useStoreActions(
    actions => actions.startupModel
  )
  const { alert, loading } = useStoreState(state => state.startupModel)

  function onFormFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormField({ ...formField, [e.target.name]: e.target.value })
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData()

    if (fileRef.current && fileRef.current.files) {
      formData.append('nama', formField.nama)
      formData.append('tahunPendanaan', formField.tahunPendanaan)
      formData.append('versiProfilPendanaan', formField.versiProfilPendanaan)
      formData.append('formPenilaian', formField.formPenilaian)
      formData.append(
        'file_proposal',
        fileRef.current.files[0],
        fileRef.current.value
      )

      addStartup(formData)
    }
  }

  useEffect(() => {
    return () => {
      setAlert(null)
      setLoading(false)
    }
  }, [setAlert, setLoading])

  return (
    <TambahStartupContainer>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Nama startup</Form.Label>
          <Form.Control
            onChange={onFormFieldChange}
            value={formField.nama}
            name='nama'
            type='text'
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Tahun pendanaan</Form.Label>
          <Form.Control
            onChange={onFormFieldChange}
            value={formField.tahunPendanaan}
            name='tahunPendanaan'
            type='text'
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Versi Profil Pendanaan</Form.Label>
          <Form.Control
            onChange={onFormFieldChange}
            value={formField.versiProfilPendanaan}
            name='versiProfilPendanaan'
            type='text'
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Form penilaian</Form.Label>
          <Form.Control
            onChange={onFormFieldChange}
            value={formField.formPenilaian}
            name='formPenilaian'
            as='select'
            required
            disabled={loading}
          >
            <option disabled value=''></option>
            <option value='ads'>form penilaian 1</option>
            <option value='fds'>form 2</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.File
            ref={fileRef}
            name='fileProposal'
            label='File proposal'
            required
            disabled={loading}
          />
          <Form.Text className='text-muted'>Max 2Mb</Form.Text>
        </Form.Group>
        <Button
          disabled={
            loading ||
            !formField.nama ||
            !formField.formPenilaian ||
            !formField.tahunPendanaan ||
            !formField.versiProfilPendanaan
          }
          className='float-right'
          variant='primary'
          type='submit'
        >
          {loading ? <Spinner animation='border' /> : 'Submit'}
        </Button>
      </Form>
    </TambahStartupContainer>
  )
}
