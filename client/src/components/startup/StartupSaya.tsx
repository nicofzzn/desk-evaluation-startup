import { FC, useEffect } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import { TambahStartup } from './TambahStartup'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { StartupTable } from './StartupTable'

export const StartupSaya: FC = () => {
  const { path, url } = useRouteMatch()
  const { getMyStartups } = useStoreActions(actions => actions.startupModel)
  const { myStartups } = useStoreState(state => state.startupModel)

  useEffect(() => {
    getMyStartups()
  }, [getMyStartups])

  return (
    <>
      <Route exact path={path}>
        <Link className='text_primary' to={`${url}/tambah`}>
          Tambah startup
        </Link>
        <StartupTable startups={myStartups} />
      </Route>

      <Switch>
        <Route path={`${path}/tambah`}>
          <TambahStartup />
        </Route>
      </Switch>
    </>
  )
}
