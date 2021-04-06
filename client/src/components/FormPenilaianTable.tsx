import { FC, useEffect } from 'react'
import { Alert, Spinner, Table } from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store/hooks'
import { ConfirmAlert } from './ConfirmAlert'

const FormPenilaianTableContainer = styled.div`
  width: 50vw;
  margin-top: 1em;
  padding-bottom: 5em;
  /* margin: 0 4em; */
`

export const FormPenilaianTable: FC = () => {
  const { forms, loading, alert } = useStoreState(
    state => state.formPenilaianModel
  )
  const { getForms, setAlert } = useStoreActions(
    actions => actions.formPenilaianModel
  )
  const { url } = useRouteMatch()

  function parseDate(date: string | undefined) {
    if (typeof date === 'string') {
      const dt = new Date(date)
      return `${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()}`
    }
    return ''
  }

  useEffect(() => {
    getForms()

    return () => setAlert(null)
  }, [getForms, setAlert])

  return (
    <FormPenilaianTableContainer>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      {loading ? (
        <Spinner animation='border' />
      ) : (
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Form Penilaian</th>
              <th>Dibuat pada</th>
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
                  {/* <a href={`/${url}/detail/${form._id}`}>
                    {form.namaFormPenilaian}
                  </a> */}
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
