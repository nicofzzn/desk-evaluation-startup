import { FC } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { StartupDetail } from './StartupDetail'
import { StartupTable } from './StartupTable'
import { TambahStartup } from './TambahStartup'
import { useStoreState } from '../store/hooks'
import { AdminRoute } from './routes/AdminRoute'
import { useScreenType } from './hooks/useScreenType'

const StartupContainer = styled.div<{ screenType: string }>`
  padding: ${props =>
    props.screenType === 'mobile' ? '2em 1em 2em 1em' : '2em 2em 2em 2em'};
  position: absolute;
  width: 100%;
  height: calc(100% - 3 * 1.5em);
`

export const Startup: FC = () => {
  const { path, url } = useRouteMatch()
  const { user } = useStoreState(state => state.userModel)
  const screenType = useScreenType()

  return (
    <StartupContainer screenType={screenType}>
      <Route exact path={path}>
        {user?.role === 'admin' && (
          <Link to={`${url}/tambah`}>Tambah startup</Link>
        )}
        <StartupTable />
      </Route>

      <Switch>
        <AdminRoute path={`${path}/tambah`}>
          <TambahStartup />
        </AdminRoute>

        <Route exact path={`${url}/:startupId`}>
          <StartupDetail />
        </Route>
      </Switch>
    </StartupContainer>
  )
}
