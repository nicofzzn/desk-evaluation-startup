import { FC } from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions } from '../store/hooks'

const SideMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const NavLink = styled.div`
  display: flex;
  flex-direction: column;
`

export const SideMenu: FC = () => {
  const { logout } = useStoreActions(actions => actions.userModel)

  return (
    <Nav>
      <SideMenuContainer>
        <h3>Nico Faza Zein</h3>
        <NavLink>
          <Link className='m-2' to='/'>
            Dashboard
          </Link>
          <Link className='m-2' to='/startup'>
            Startup
          </Link>
          <Link className='m-2' to='#' onClick={() => logout()}>
            Logout
          </Link>
        </NavLink>
      </SideMenuContainer>
    </Nav>
  )
}
