import { FC } from 'react'
import styled from 'styled-components'
import { useStoreActions } from '../store/hooks'

import { SideMenu } from './SideMenu'

const DashboardContainer = styled.div`
  display: flex;
`
const Left = styled.div`
  /* background-color: #e7e7e7; */
  /* background-color: #383838; */
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
`

export const Dashboard: FC = () => {
  return (
    <DashboardContainer>
      <Left>
        <SideMenu />
      </Left>
      <Right></Right>
    </DashboardContainer>
  )
}
