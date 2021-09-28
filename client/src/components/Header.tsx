import { FC, Fragment } from 'react'
import styled from 'styled-components'
import { useLocation, Link } from 'react-router-dom'
import { useScreenType } from './hooks/useScreenType'
import { useStoreActions } from '../store/hooks'
import { BsArrowBarRight } from 'react-icons/bs'

function getPathName(path: string) {
  if (path === '/') return []
  const paths = path.split('/').slice(1, path.split('/').length)
  return paths
}

function capitalizeFirstLetter(item: string) {
  return item.charAt(0).toUpperCase() + item.slice(1)
}

export const Header: FC = () => {
  const { logout } = useStoreActions(actions => actions.userModel)
  const { pathname } = useLocation()
  const screenType = useScreenType()

  return (
    <BreadcrumbContainer screenType={screenType} id='top'>
      <Left>
        <Item>
          <Link className='text_primary' to='/'>
            Dashboard
          </Link>
        </Item>
        {getPathName(pathname).map((item, index) => (
          <Fragment key={index}>
            {getPathName(pathname).length === 0 ? null : <span>/</span>}
            <Item>
              {getPathName(pathname).length - 1 === index ? (
                <span>{capitalizeFirstLetter(item)}</span>
              ) : (
                <Link
                  className='text_primary'
                  to={getPathName(pathname)
                    .slice(0, index + 1)
                    .reduce((acc, item) => acc + '/' + item, '')}
                >
                  {capitalizeFirstLetter(item)}
                </Link>
              )}
            </Item>
          </Fragment>
        ))}
      </Left>
      {screenType === 'fullscreen' && (
        <Right className='text_secondary'>
          <Link className='text_secondary' to='#' onClick={() => logout()}>
            Logout <BsArrowBarRight />
          </Link>
        </Right>
      )}
    </BreadcrumbContainer>
  )
}

const BreadcrumbContainer = styled.div<{ screenType: string }>`
  padding: ${props =>
    props.screenType === 'mobile' ? '1.2em 2em 1.2em 3.5em' : '1.2em 2em 1.2em 2em'};
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: #ffffff;
  color: #535353;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const Item = styled.span`
  margin: 0 0.5em;
`
const Left = styled.div``

const Right = styled.div`
  margin: 0 0.5em;
`
