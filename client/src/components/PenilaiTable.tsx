import { FC, useLayoutEffect } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { Table, Button, Alert, Spinner } from 'react-bootstrap'
import styled from 'styled-components'
import { useScreenType } from './hooks/useScreenType'
import { useStoreActions, useStoreState } from '../store/hooks'
import { ConfirmAlert } from './ConfirmAlert'

const PenilaiTableContainer = styled.div<{ screenType: string }>`
  width: ${props => (props.screenType === 'mobile' ? '100%' : '50vw')};
  margin-top: 1em;
  padding-bottom: 5em;
`

export const PenilaiTable: FC = () => {
  const { penilai, alert, loadingPenilai } = useStoreState(state => state.userModel)
  const { setAlert } = useStoreActions(actions => actions.userModel)
  const { path } = useRouteMatch()
  const screenType = useScreenType()

  useLayoutEffect(() => {
    return () => {
      setAlert(null)
    }
  }, [setAlert])

  return (
    <PenilaiTableContainer screenType={screenType}>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      {loadingPenilai ? (
        <SpinnerContainer>
          <Spinner animation='border' />
        </SpinnerContainer>
      ) : (
        <Table bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {penilai?.map((p, index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>
                  <Link to={`${path}/${p._id}`}>
                    <Button size='sm' variant='outline-secondary'>
                      Edit Password
                    </Button>{' '}
                  </Link>
                  <ConfirmAlert penilaiId={p._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </PenilaiTableContainer>
  )
}

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 50vh;
`
