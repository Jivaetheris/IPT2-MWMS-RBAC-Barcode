import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {
  const userRole = 'admin';

  return (
    <>
      <header>
        <nav>
          <ul>
            {
              userRole === 'admin' ? (
                <>
                  <h1>Hello Admin</h1>
                  <li><Link to='/admin/warehouse'>Warehouse</Link></li>
                  <li><Link to='/admin/log'>Logs</Link></li>
                  <li><Link to='/admin/order'>Orders</Link></li>
                  <li><Link to='/admin/product'>Products</Link></li>
                  <li><Link to='/admin/report'>Reports</Link></li>
                  <li><Link to='/admin/role'>Roles</Link></li>
                  <li><Link to='/admin/stock'>Stocks</Link></li>
                </>
              ) : userRole === 'manager' ? (
                <>
                  <h1>Hello Manager</h1>
                  <li><Link to='/manager/order'>Orders</Link></li>
                  <li><Link to='/manager/product'>Products</Link></li>
                  <li><Link to='/manager/report'>Reports</Link></li>
                  <li><Link to='/manager/stock'>Stocks</Link></li>
                  <li><Link to='/manager/warehouse'>Warehouse</Link></li>
                </>
              ) : (
                <>
                  <h1>Hello Staff</h1>
                  <li><Link to="/staff/warehouse">Warehouse</Link></li>
                  <li><Link to="/staff/product">Products</Link></li>
                  <li><Link to="/staff/stock">Stocks</Link></li>
                </>
              )
            }
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
