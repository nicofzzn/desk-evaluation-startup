import { FC } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { Header } from './Header'
import { SideMenu } from './SideMenu'
import { Startup } from './Startup'

const DashboardContainer = styled.div`
  display: flex;
`
const Left = styled.div`
  width: 300px;
  height: 100vh;
  box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
  padding: 2em;
`
const Right = styled.div`
  position: absolute;
  left: 300px;
  width: calc(100% - 300px);
  height: 100vh;
  overflow-y: auto;
`

export const Dashboard: FC = () => {
  return (
    <DashboardContainer>
      <Left>
        <SideMenu />
      </Left>
      <Right>
        <Header />
        <Route path='/startup'>
          <Startup />
        </Route>
      </Right>
    </DashboardContainer>
  )
}
