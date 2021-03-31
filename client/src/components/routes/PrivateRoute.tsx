import { FC } from 'react'
import { Route, Redirect, RouteProps, useLocation } from 'react-router-dom'
import { useStoreState } from '../../store/hooks'

export const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const { user, loading } = useStoreState(state => state.userModel)
  const { pathname } = useLocation()

  return (
    <Route
      {...rest}
      render={() =>
        !loading && !user ? (
          <Redirect to={pathname === '/register' ? '/register' : '/login'} />
        ) : (
          children
        )
      }
    />
  )
}
