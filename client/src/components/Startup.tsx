import { FC } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { TambahStartup } from './TambahStartup'

const StartupContainer = styled.div`
  padding: 2em 2em 2em 2em;
  position: absolute;
  width: 100%;
  height: calc(100% - 3 * 1.5em);
`

export const Startup: FC = () => {
  const { path, url } = useRouteMatch()

  return (
    <StartupContainer>
      <Route exact path={path}>
        <Link to={`${url}/tambah`}>Tambah startup</Link>
      </Route>

      <Switch>
        <Route exact path={path}></Route>
        <Route path={`${path}/tambah`}>
          <TambahStartup />
        </Route>
      </Switch>
    </StartupContainer>
  )
}
