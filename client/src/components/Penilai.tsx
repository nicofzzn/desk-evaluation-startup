import { FC, useEffect } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions } from '../store/hooks'
import { useScreenType } from './hooks/useScreenType'
import { PenilaiTable } from './PenilaiTable'
import { TambahPenilai } from './TambahPenilai'
import { AdminRoute } from './routes/AdminRoute'
import { PenilaiEditPassword } from './PenilaiEditPassword'

const PenilaiContainer = styled.div<{ screenType: string }>`
  padding: ${props =>
    props.screenType === 'mobile' ? '2em 1em 2em 1em' : '2em 2em 2em 2em'};
  position: absolute;
  width: 100%;
  height: calc(100% - 3 * 1.5em);
`

export const Penilai: FC = () => {
  const { path, url } = useRouteMatch()
  const { getPenilai } = useStoreActions(action => action.userModel)
  const screenType = useScreenType()

  useEffect(() => {
    getPenilai()
  }, [getPenilai])

  return (
    <PenilaiContainer screenType={screenType}>
      <Route exact path={path}>
        <Link className='text_primary' to={`${url}/tambah`}>
          Tambah penilai
        </Link>
        <PenilaiTable />
      </Route>
      <Switch>
        <AdminRoute path={`${path}/tambah`}>
          <TambahPenilai />
        </AdminRoute>

        <AdminRoute exact path={`${url}/:penilaiId`}>
          <PenilaiEditPassword />
        </AdminRoute>
      </Switch>
    </PenilaiContainer>
  )
}
