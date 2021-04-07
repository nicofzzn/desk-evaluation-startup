import { FC, useEffect } from 'react'
import { Alert, Spinner, Table } from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store/hooks'
import { ConfirmAlert } from './ConfirmAlert'

const StartupTableContainer = styled.div`
  width: 50vw;
  margin-top: 1em;
  padding-bottom: 5em;
  /* margin: 0 4em; */
`

export const StartupTable: FC = () => {
  const { startups, loading, alert } = useStoreState(
    state => state.startupModel
  )
  const { setAlert } = useStoreActions(actions => actions.startupModel)
  const { url } = useRouteMatch()

  useEffect(() => {
    return () => setAlert(null)
  }, [setAlert])

  return (
    <StartupTableContainer>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      {loading ? (
        <Spinner animation='border' />
      ) : (
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Startup</th>
              <th>Tahun Pendanaan</th>
              <th>Versi Profil Pendanaan</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {startups.map((startup, index) => (
              <tr key={startup._id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`${url}/${startup._id}`}>{startup.nama}</Link>
                </td>
                <td>{startup.tahunPendanaan}</td>
                <td>{startup.versiProfilPendanaan}</td>
                <td>
                  <ConfirmAlert startupId={startup._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </StartupTableContainer>
  )
}
