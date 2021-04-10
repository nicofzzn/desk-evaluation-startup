import { FC } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { StartupDetail } from './StartupDetail'
import { StartupTable } from './StartupTable'
import { TambahStartup } from './TambahStartup'
import { useStoreState } from '../store/hooks'

const StartupContainer = styled.div`
  padding: 2em 2em 2em 2em;
  position: absolute;
  width: 100%;
  height: calc(100% - 3 * 1.5em);
`

export const Startup: FC = () => {
  const { path, url } = useRouteMatch()
  const { user } = useStoreState(state => state.userModel)

  return (
    <StartupContainer>
      <Route exact path={path}>
        {user?.role === 'admin' && (
          <Link to={`${url}/tambah`}>Tambah startup</Link>
        )}
        <StartupTable />
      </Route>

      <Switch>
        <Route path={`${path}/tambah`}>
          <TambahStartup />
        </Route>

        <Route exact path={`${url}/:startupId`}>
          <StartupDetail />
        </Route>
      </Switch>
    </StartupContainer>
  )
}
