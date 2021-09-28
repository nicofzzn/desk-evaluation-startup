import { FC, useEffect } from 'react'
import { Route, useLocation, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { Header } from './Header'
import { SideMenu } from './SideMenu'
import { Startup } from './startup/Startup'
import { Penilai } from './penilai/Penilai'
import { FormPenilaian } from './form_penilaian/FormPenilaian'
import { useStoreActions } from '../store/hooks'
import { AdminRoute } from './routes/AdminRoute'
import { useScreenType } from './hooks/useScreenType'
import { SideMenuMobile } from './SideMenuMobile'
import { IconContext } from 'react-icons'

export const Dashboard: FC = () => {
  const { getStartups } = useStoreActions(actions => actions.startupModel)
  const { getForms } = useStoreActions(actions => actions.formPenilaianModel)
  const screenType = useScreenType()
  const { pathname } = useLocation()

  useEffect(() => {
    getStartups()
    getForms()
  }, [getStartups, getForms])

  if (pathname === '/') return <Redirect to='/startup' />

  if (screenType === 'mobile')
    return (
      <DashboardContainer id='outer-container'>
        <SideMenuMobile />
        <div id='page-wrap' className='w-100'>
          <Header />
          <Route path='/startup'>
            <Startup />
          </Route>
          <AdminRoute path='/form-penilaian'>
            <FormPenilaian />
          </AdminRoute>
          <AdminRoute path='/penilai'>
            <Penilai />
          </AdminRoute>
        </div>
      </DashboardContainer>
    )

  return (
    <IconContext.Provider value={{ className: 'react-icons', size: '1.2em' }}>
      <DashboardContainer>
        <Left>
          <SideMenu />
        </Left>
        <Right>
          <Header />
          <Route path='/startup'>
            <Startup />
          </Route>
          <AdminRoute path='/form-penilaian'>
            <FormPenilaian />
          </AdminRoute>
          <Route path='/penilai'>
            <Penilai />
          </Route>
        </Right>
      </DashboardContainer>
    </IconContext.Provider>
  )
}

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`

const Left = styled.div`
  width: 20em;
  padding: 2em;
  z-index: 100;
  background-color: #313a46;
  color: #c4c4c4;
`
const Right = styled.div`
  /* position: absolute;
  left: 17em;
  width: calc(100% - 17em); */
  width: 100%;
  overflow-y: auto;
`
