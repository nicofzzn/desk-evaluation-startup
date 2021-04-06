import { FC } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { FormPenilaianDetail } from './FormPenilaianDetail'
// component
import { FormPenilaianTable } from './FormPenilaianTable'
import { TambahFormPenilaian } from './TambahFormPenilaian'

const FormPenilaianContainer = styled.div`
  padding: 2em 2em 2em 2em;
  position: absolute;
  width: 100%;
  height: calc(100% - 3 * 1.5em);
`

export const FormPenilaian: FC = () => {
  const { path, url } = useRouteMatch()

  return (
    <FormPenilaianContainer>
      <Route exact path={path}>
        <Link to={`${url}/tambah`}>Tambah form penilaian</Link>
        <FormPenilaianTable />
      </Route>

      <Switch>
        <Route path={`${path}/tambah`}>
          <TambahFormPenilaian />
        </Route>

        <Route exact path={`${url}/:formId`}>
          <FormPenilaianDetail />
        </Route>
      </Switch>
    </FormPenilaianContainer>
  )
}
