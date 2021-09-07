import { FC } from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store/hooks'

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
  const { user } = useStoreState(state => state.userModel)

  return (
    <Nav>
      <SideMenuContainer>
        <h3>{user && user.name}</h3>
        <p>{user && user.email}</p>
        <NavLink>
          {/* <Link className='m-2' to='/'>
            Dashboard
          </Link> */}
          <Link className='m-2' to='/startup'>
            Startup
          </Link>
          {user && user.role === 'admin' && (
            <Link className='m-2' to='/form-penilaian'>
              Form Penilaian
            </Link>
          )}
          <Link className='m-2' to='#' onClick={() => logout()}>
            Logout
          </Link>
        </NavLink>
      </SideMenuContainer>
    </Nav>
  )
}
