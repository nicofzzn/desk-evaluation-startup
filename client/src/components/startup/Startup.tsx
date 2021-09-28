import { FC } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { StartupDetail } from './StartupDetail'
import { StartupTable } from './StartupTable'
import { TambahStartup } from './TambahStartup'
import { StartupSaya } from './StartupSaya'
import { useStoreState } from '../../store/hooks'
import { PesertaRoute } from '../routes/PesertaRoute'
import { useScreenType } from '../hooks/useScreenType'

const StartupContainer = styled.div<{ screenType: string }>`
  padding: ${props =>
    props.screenType === 'mobile' ? '2em 1em 2em 1em' : '2em 2em 2em 2em'};
  position: absolute;
  width: 100%;
  height: calc(100% - 3 * 1.5em);
`

export const Startup: FC = () => {
  const { startups } = useStoreState(state => state.startupModel)
  const { path, url } = useRouteMatch()
  const { user } = useStoreState(state => state.userModel)
  const screenType = useScreenType()

  return (
    <StartupContainer screenType={screenType}>
      <Route exact path={path}>
        {user?.role === 'peserta' && (
          <Link className='text_primary' to={`${url}/my-startup`}>
            Startup saya
          </Link>
        )}
        <StartupTable startups={startups} />
      </Route>

      <Switch>
        <PesertaRoute path={`${path}/my-startup`}>
          <StartupSaya />
        </PesertaRoute>

        <PesertaRoute path={`${path}/tambah`}>
          <TambahStartup />
        </PesertaRoute>

        <Route exact path={`${url}/:startupId`}>
          <StartupDetail />
        </Route>
      </Switch>
    </StartupContainer>
  )
}
