import { FC, useEffect } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { Header } from './Header'
import { SideMenu } from './SideMenu'
import { Startup } from './Startup'
import { FormPenilaian } from './FormPenilaian'
import { useStoreActions } from '../store/hooks'
import { AdminRoute } from './routes/AdminRoute'

const DashboardContainer = styled.div`
  display: flex;
`
const Left = styled.div`
  width: 300px;
  height: 100vh;
  box-shadow: 1px 0px 2px 0px rgba(0, 0, 0, 0.3);
  padding: 2em;
  z-index: 100;
`
const Right = styled.div`
  position: absolute;
  left: 300px;
  width: calc(100% - 300px);
  height: 100vh;
  overflow-y: auto;
`

export const Dashboard: FC = () => {
  const { getStartups } = useStoreActions(actions => actions.startupModel)
  const { getForms } = useStoreActions(actions => actions.formPenilaianModel)

  useEffect(() => {
    getStartups()
    getForms()
  }, [getStartups, getForms])

  return (
    <DashboardContainer>
      <Left className='bg-light'>
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
      </Right>
    </DashboardContainer>
  )
}
