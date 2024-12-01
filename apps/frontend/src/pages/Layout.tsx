import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/Header';
import './Layout.css';

export const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
