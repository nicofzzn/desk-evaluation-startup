import { FC } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useScreenType } from '../hooks/useScreenType'
import { PenilaiTable } from './PenilaiTable'
import { TambahPenilai } from './TambahPenilai'
import { AdminRoute } from '../routes/AdminRoute'
import { PenilaiEditPassword } from './PenilaiEditPassword'

export const Penilai: FC = () => {
  const { path, url } = useRouteMatch()
  const screenType = useScreenType()

  return (
    <PenilaiContainer screenType={screenType}>
      <Container screenType={screenType} className='bg-custom-white'>
        <Route exact path={path}>
          <Link className='text_primary' to={`${url}/tambah`}>
            Tambah penilai
          </Link>
          <PenilaiTable />
        </Route>
        <Switch>
          <AdminRoute path={`${path}/tambah`}>
            <TambahPenilai />
          </AdminRoute>

          <AdminRoute exact path={`${url}/:penilaiId`}>
            <PenilaiEditPassword />
          </AdminRoute>
        </Switch>
      </Container>
    </PenilaiContainer>
  )
}

const PenilaiContainer = styled.div<{ screenType: string }>`
  padding: ${props => (props.screenType === 'mobile' ? '2em 1em' : '2em')};
`

const Container = styled.div<{ screenType: string }>`
  padding: ${props => (props.screenType === 'mobile' ? '1em 1em' : '1em 2em')};
  box-shadow: 0px 0px 3px -1px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  width: min(100%, 900px);
`
