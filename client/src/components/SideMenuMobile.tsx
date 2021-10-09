import { FC, useState } from 'react'
import { slide as Menu } from 'react-burger-menu'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store/hooks'
import { BsListCheck, BsPeople, BsFileRichtext, BsArrowBarRight } from 'react-icons/bs'

export const SideMenuMobile: FC = () => {
  const { logout } = useStoreActions(actions => actions.userModel)
  const { user } = useStoreState(state => state.userModel)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  function handleClose() {
    setIsMenuOpen(false)
  }

  function handleOpen() {
    setIsMenuOpen(true)
  }

  return (
    <Menu
      pageWrapId='page-wrap'
      outerContainerId='outer-container'
      isOpen={isMenuOpen}
      styles={style}
      disableAutoFocus
      onClose={handleClose}
      onOpen={handleOpen}
    >
      <SideMenuContainer>
        <Title> Evaluation Startup</Title>
        <User>{user?.email}</User>
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
          <Link className='mb-4 side-menu' to='#' onClick={() => logout()}>
            <BsArrowBarRight className='mr-2' /> Logout
          </Link>
        </NavLink>
      </SideMenuContainer>
    </Menu>
  )
}

function getPath(pathname: string): string {
  return pathname.split('/')[1]
}

const SideMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #c9c9c9d5;
`
const NavLink = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 600;
`

const Title = styled.div`
  font-size: 1.3em;
  font-weight: 600;
`

const User = styled.div`
  margin-bottom: 2em;
  filter: brightness(0.7);
  font-weight: 300;
`

const style = {
  bmBurgerButton: {
    position: 'absolute',
    width: '1.5em',
    height: '1.3em',
    left: '1.2em',
    top: '1.2em',
  },
  bmBurgerBars: {
    background: '#6c757d',
    borderRadius: '5px',
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
  },
  bmCross: {
    background: '#bdc3c7',
  },
  bmMenu: {
    background: '#313a46',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.5)',
  },
}
