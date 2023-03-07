import { Outlet } from 'react-router-dom';
import MenuBar from '../components/MenuBar'

export default function Root() {
  return (
    <>
        <MenuBar />
        <Outlet />
    </>
  );
}