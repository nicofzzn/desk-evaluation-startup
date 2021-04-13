import { FC, useEffect } from 'react'
import { Alert, Spinner, Table } from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store/hooks'
import { ConfirmAlert } from './ConfirmAlert'
import { useScreenType } from './hooks/useScreenType'

const FormPenilaianTableContainer = styled.div<{ screenType: string }>`
  width: ${props => (props.screenType === 'mobile' ? '100%' : '50vw')};
  margin-top: 1em;
  padding-bottom: 5em;
`

export const FormPenilaianTable: FC = () => {
  const { forms, loading, alert } = useStoreState(
    state => state.formPenilaianModel
  )
  const { getForms, setAlert } = useStoreActions(
    actions => actions.formPenilaianModel
  )
  const { url } = useRouteMatch()
  const screenType = useScreenType()

  function parseDate(date: string | undefined) {
    if (typeof date === 'string') {
      const dt = new Date(date)
      return `${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()}`
    }
    return ''
  }

  useEffect(() => {
    return () => setAlert(null)
  }, [getForms, setAlert])

  return (
    <FormPenilaianTableContainer screenType={screenType}>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      {loading ? (
        <SpinnerContainer>
          <Spinner animation='border' />
        </SpinnerContainer>
      ) : (
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Form Penilaian</th>
              <th>Dibuat pada tanggal</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form, index) => (
              <tr key={form._id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`${url}/${form._id}`}>
                    {form.namaFormPenilaian}
                  </Link>
                </td>
                <td>{parseDate(form.createdAt)}</td>
                <td>
                  <ConfirmAlert formId={form._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </FormPenilaianTableContainer>
  )
}

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 50vh;
`
