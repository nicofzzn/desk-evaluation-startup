import { FC } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { FormPenilaianDetail } from './FormPenilaianDetail'
import { useScreenType } from '../hooks/useScreenType'
// component
import { FormPenilaianTable } from './FormPenilaianTable'
import { TambahFormPenilaian } from './TambahFormPenilaian'

export const FormPenilaian: FC = () => {
  const { path, url } = useRouteMatch()
  const screenType = useScreenType()

  return (
    <FormPenilaianContainer screenType={screenType}>
      <Route exact path={path}>
        <Link className='text_primary' to={`${url}/tambah`}>
          Tambah form penilaian
        </Link>
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

const FormPenilaianContainer = styled.div<{ screenType: string }>`
  padding: ${props =>
    props.screenType === 'mobile' ? '2em 1em 2em 1em' : '2em 2em 2em 2em'};
`
