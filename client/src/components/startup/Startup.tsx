import { FC, useEffect } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { StartupDetail } from './StartupDetail'
import { StartupTable } from './StartupTable'
import { TambahStartup } from './TambahStartup'
import { StartupSaya } from './StartupSaya'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { PesertaRoute } from '../routes/PesertaRoute'
import { useScreenType } from '../hooks/useScreenType'

export const Startup: FC = () => {
  const { startups } = useStoreState(state => state.startupModel)
  const { getStartups } = useStoreActions(actions => actions.startupModel)
  const { setAlert } = useStoreActions(actions => actions.startupModel)
  const { path, url } = useRouteMatch()
  const { user } = useStoreState(state => state.userModel)
  const screenType = useScreenType()

  useEffect(() => {
    getStartups()
    return () => setAlert(null)
  }, [setAlert, getStartups])

  return (
    <StartupContainer screenType={screenType}>
      <Container screenType={screenType} className='bg-custom-white'>
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

const StartupContainer = styled.div<{ screenType: string }>`
  padding: ${props => (props.screenType === 'mobile' ? '2em 1em' : '2em')};
`

const Container = styled.div<{ screenType: string }>`
  padding: ${props => (props.screenType === 'mobile' ? '1em 1em' : '1em 2em')};
  box-shadow: 0px 0px 3px -1px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  width: min(100%, 900px);
`
