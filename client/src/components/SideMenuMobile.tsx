import { FC, useState } from 'react'
import { slide as Menu } from 'react-burger-menu'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store/hooks'

export const SideMenuMobile: FC = () => {
  const { logout } = useStoreActions(actions => actions.userModel)
  const { user } = useStoreState(state => state.userModel)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
        <h3>{user && user.name}</h3>
        <p>{user && user.email}</p>
        <NavLink>
          {/* <Link className='m-2' to='/' onClick={handleClose}>
            Dashboard
          </Link> */}
          <Link className='m-2' to='/startup' onClick={handleClose}>
            Startup
          </Link>
          {user && user.role === 'admin' && (
            <Link className='m-2' to='/form-penilaian' onClick={handleClose}>
              Form Penilaian
            </Link>
          )}
          <Link className='m-2' to='#' onClick={() => logout()}>
            Logout
          </Link>
        </NavLink>
      </SideMenuContainer>
    </Menu>
  )
}

const SideMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const NavLink = styled.div`
  display: flex;
  flex-direction: column;
`

const style = {
  bmBurgerButton: {
    position: 'absolute',
    width: '25px',
    height: '20px',
    left: '25px',
    top: '25px',
  },
  bmBurgerBars: {
    background: 'rgb(114, 114, 114)',
    borderRadius: '10px',
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
  },
  bmCross: {
    background: '#bdc3c7',
  },
  bmMenu: {
    background: '#e9e9e9',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.5)',
  },
}
