import { FC } from 'react'
import { Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreState } from '../store/hooks'
import { BsListCheck, BsPeople, BsFileRichtext } from 'react-icons/bs'

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
  const { user } = useStoreState(state => state.userModel)
  const { pathname } = useLocation()

  return (
    <Nav>
      <SideMenuContainer>
        <Title> Evaluation Startup</Title>
        <NavLink>
          <Link
            className={`mb-4 side-menu ${
              getPath(pathname) === 'startup' ? 'active' : ''
            }`}
            to='/startup'
          >
            <BsFileRichtext className='mr-2' /> Startup
          </Link>
          {user && user.role === 'admin' && (
            <>
              <Link
                className={`mb-4 side-menu ${
                  getPath(pathname) === 'form-penilaian' ? 'active' : ''
                }`}
                to='/form-penilaian'
              >
                <BsListCheck className='mr-2' /> Form Penilaian
              </Link>
              <Link
                className={`mb-4 side-menu ${
                  getPath(pathname) === 'penilai' ? 'active' : ''
                }`}
                to='/penilai'
              >
                <BsPeople className='mr-2' /> Penilai
              </Link>
            </>
          )}
        </NavLink>
      </SideMenuContainer>
    </Nav>
  )
}

function getPath(pathname: string): string {
  return pathname.split('/')[1]
}
