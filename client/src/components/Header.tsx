import { FC, Fragment } from 'react'
import styled from 'styled-components'
import { useLocation, Link } from 'react-router-dom'

const BreadcrumbContainer = styled.div`
  padding: 1.5em 2em 1.5em 2em;
  box-shadow: 1px 0px 2px 0px rgba(0, 0, 0, 0.5);
  width: 100%;
`

const Item = styled.span`
  margin: 0 5px;
`

function getPathName(path: string) {
  if (path === '/') return []
  return path.split('/').slice(1, path.split('/').length)
}

function capitalizeFirstLetter(item: string) {
  return item.charAt(0).toUpperCase() + item.slice(1)
}

export const Header: FC = () => {
  const { pathname } = useLocation()
  return (
    <BreadcrumbContainer>
      <Item>
        <Link to='/'>Dashboard</Link>
      </Item>
      {getPathName(pathname).map((item, index) => (
        <Fragment key={index}>
          {getPathName(pathname).length === 0 ? null : <span>/</span>}
          <Item>
            {getPathName(pathname).length - 1 === index ? (
              <span>{capitalizeFirstLetter(item)}</span>
            ) : (
              <Link to={`/${item}`}>{capitalizeFirstLetter(item)}</Link>
            )}
          </Item>
        </Fragment>
      ))}
    </BreadcrumbContainer>
  )
}
