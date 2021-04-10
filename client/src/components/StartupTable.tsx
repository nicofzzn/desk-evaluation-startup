import { FC, useEffect } from 'react'
import { Alert, Badge, Spinner, Table } from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store/hooks'
import { ConfirmAlert } from './ConfirmAlert'
import { Nilai as NilaiInterface } from '../store/models/startupModel'

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
  const { user } = useStoreState(state => state.userModel)
  const { setAlert } = useStoreActions(actions => actions.startupModel)
  const { url } = useRouteMatch()

  useEffect(() => {
    return () => setAlert(null)
  }, [setAlert])

  return (
    <StartupTableContainer>
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
              <th>Nama Startup</th>
              <th>Tahun Pendanaan</th>
              <th>Versi Profil Pendanaan</th>
              <th>Status kelulusan</th>
              <th></th>
              {user?.role === 'admin' && <th></th>}
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
                  {checkKelulusan(
                    +startup.formPenilaian.rekomendasiKelulusan,
                    startup.penilai
                  )}
                </td>
                <td>{checkNilai(user?.id, startup.penilai)}</td>
                {user?.role === 'admin' && (
                  <td>
                    <ConfirmAlert startupId={startup._id} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </StartupTableContainer>
  )
}

function checkKelulusan(rekomendasi: number, penilais: Array<NilaiInterface>) {
  const total = penilais.reduce((acc, penilai) => acc + penilai.totalNilai, 0)
  if (rekomendasi <= total / penilais.length)
    return <Badge variant='info'>Lulus</Badge>
  return <Badge variant='secondary'>Tidak lulus</Badge>
}

function checkNilai(
  userId: string | undefined,
  penilais: Array<NilaiInterface>
) {
  if (!userId) return
  const hasNilai = penilais.find(a => a.userId === userId)
  if (hasNilai) return <Badge variant='info'>Sudah dinilai</Badge>
  return <Badge variant='secondary'>Belum dinilai</Badge>
}

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 50vh;
`
