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
`

const Container = styled.div`
  padding: 2em;
  box-shadow: 0px 0px 3px -1px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  width: min(100%, 800px);
`

export const Startup: FC = () => {
  const { startups } = useStoreState(state => state.startupModel)
  const { path, url } = useRouteMatch()
  const { user } = useStoreState(state => state.userModel)
  const screenType = useScreenType()

  return (
    <StartupContainer screenType={screenType}>
      <Container className='bg-custom-white m-2'>
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
      </Container>
    </StartupContainer>
  )
}
