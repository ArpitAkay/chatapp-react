import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const Layout = () => {
  const userInfoSelector = useSelector((state: any) => state.userInfo);

  return (
    !userInfoSelector.name ? <Navigate to='/' /> : <Outlet />
  )
}

export default Layout
