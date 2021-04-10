import { FC } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { useStoreState } from '../../store/hooks'

export const AdminRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const { user, loading } = useStoreState(state => state.userModel)

  return (
    <Route
      {...rest}
      render={() =>
        !loading && user && user.role !== 'admin' ? (
          <Redirect to='/dashboard' />
        ) : (
          children
        )
      }
    />
  )
}
