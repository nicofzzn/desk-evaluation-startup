import { FC } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { TambahFormPenilaian } from './TambahFormPenilaian'

const FormPenilaianContainer = styled.div`
  padding: 0 2em 2em 2em;
  position: absolute;
  width: 100%;
  height: calc(100% - 3 * 2em);
`

export const FormPenilaian: FC = () => {
  const { path, url } = useRouteMatch()

  return (
    <FormPenilaianContainer>
      <Route exact path={path}>
        <Link to={`${url}/tambah`}>Tambah form penilaian</Link>
      </Route>

      <Switch>
        <Route exact path={path}></Route>
        <Route path={`${path}/tambah`}>
          <TambahFormPenilaian />
        </Route>
      </Switch>
    </FormPenilaianContainer>
  )
}
