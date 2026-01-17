import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = ({ onLogout }) => {
  return (
    <>
      <Sidebar onLogout={onLogout} />
      <Outlet />
    </>
  );
};

export default Layout;
