import { FC, useEffect } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useScreenType } from '../hooks/useScreenType'
import { TambahStartup } from './TambahStartup'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { StartupTable } from './StartupTable'

export const StartupSaya: FC = () => {
  const { path, url } = useRouteMatch()
  const screenType = useScreenType()
  const { getMyStartups } = useStoreActions(actions => actions.startupModel)
  const { myStartups } = useStoreState(state => state.startupModel)

  useEffect(() => {
    getMyStartups()
  }, [getMyStartups])

  return (
    <Container screenType={screenType}>
      <Route exact path={path}>
        <Link to={`${url}/tambah`}>Tambah startup</Link>
        <StartupTable startups={myStartups} />
      </Route>

      <Switch>
        <Route path={`${path}/tambah`}>
          <TambahStartup />
        </Route>
      </Switch>
    </Container>
  )
}

const Container = styled.div<{ screenType: string }>`
  padding: ${props =>
    props.screenType === 'mobile' ? '0em 0em 0em 0em' : '0em 0em 0em 0em'};
  position: absolute;
  /* width: 100%; */
  height: calc(100% - 3 * 1.5em);
`
