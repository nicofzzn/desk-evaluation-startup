import { FC, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { useScreenType } from '../hooks/useScreenType'

const TambahStartupContainer = styled.div<{ screenType: string }>`
  width: ${props => (props.screenType === 'mobile' ? '100%' : '500px')};
  padding-bottom: 5em;
`

export interface FormField {
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
  const { forms } = useStoreState(state => state.formPenilaianModel)
  const [fileTooBig, setFileTooBig] = useState<boolean | undefined>(undefined)
  const [files, setFiles] = useState<{
    fileList: FileList | null
    path: string
  }>({ fileList: null, path: '' })
  const screenType = useScreenType()

  function onFormFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormField({ ...formField, [e.target.name]: e.target.value })
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles({ fileList: e.currentTarget.files, path: e.currentTarget.value })
    if (
      e.currentTarget.files &&
      e.currentTarget.files[0] &&
      e.currentTarget.files[0].size > 2000000
    )
      setFileTooBig(true)
    else setFileTooBig(false)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData()
    if (fileRef.current && fileRef.current.files) {
      if (fileRef.current.files[0].size < 2000000) {
        formData.append('file_proposal', fileRef.current.files[0], fileRef.current.value)

        addStartup({
          formData: formData,
          formField: formField,
          clearForm: () => {
            setFormField({
              nama: '',
              tahunPendanaan: '',
              versiProfilPendanaan: '',
              formPenilaian: '',
            })
            if (fileRef.current && fileRef.current.files) {
              fileRef.current.value = ''
            }
          },
        })
      }
    }
  }

  useEffect(() => {
    return () => {
      setAlert(null)
      setLoading(false)
    }
  }, [setAlert, setLoading])

  return (
    <TambahStartupContainer screenType={screenType}>
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
            {forms.map(form => (
              <option key={form._id} value={form._id}>
                {form.namaFormPenilaian}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.File
            ref={fileRef}
            name='fileProposal'
            label='File proposal'
            required
            disabled={loading}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFileChange(e)}
            accept='application/pdf'
          />
          <Form.Text className='text-muted'>Max 2Mb</Form.Text>
          {fileTooBig && (
            <Form.Text className='text-danger'>Ukuran file terlalu besar</Form.Text>
          )}
        </Form.Group>
        <Button
          disabled={
            loading ||
            !files.fileList ||
            files.fileList.length === 0 ||
            fileTooBig ||
            !formField.nama ||
            !formField.formPenilaian ||
            !formField.tahunPendanaan ||
            !formField.versiProfilPendanaan
          }
          className='float-right'
          variant='custom-primary'
          type='submit'
        >
          {loading ? <Spinner animation='border' /> : 'Submit'}
        </Button>
      </Form>
    </TambahStartupContainer>
  )
}
