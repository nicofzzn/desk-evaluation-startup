import { FC } from 'react'
import { Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store/hooks'

const SideMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const NavLink = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 600;
`

const Title = styled.div`
  padding-bottom: 1.3em;
  font-size: 1.3em;
  font-weight: 600;
  color: #c9c9c9d5;
`

export const SideMenu: FC = () => {
  const { logout } = useStoreActions(actions => actions.userModel)
  const { user } = useStoreState(state => state.userModel)
  const { pathname } = useLocation()

  return (
    <Nav>
      <SideMenuContainer>
        <Title>Evaluation Startup</Title>
        <NavLink>
          <Link
            className={`mb-4 side-menu ${
              getPath(pathname) === 'startup' ? 'active' : ''
            }`}
            to='/startup'
          >
            Startup
          </Link>
          {user && user.role === 'admin' && (
            <>
              <Link
                className={`mb-4 side-menu ${
                  getPath(pathname) === 'form-penilaian' ? 'active' : ''
                }`}
                to='/form-penilaian'
              >
                Form Penilaian
              </Link>
              <Link
                className={`mb-4 side-menu ${
                  getPath(pathname) === 'penilai' ? 'active' : ''
                }`}
                to='/penilai'
              >
                Penilai
              </Link>
            </>
          )}
          <Link className='mb-4 side-menu' to='#' onClick={() => logout()}>
            Logout
          </Link>
        </NavLink>
      </SideMenuContainer>
    </Nav>
  )
}

function getPath(pathname: string): string {
  return pathname.split('/')[1]
}
