import {Outlet, Link} from 'react-router-dom';

const MainLayout = () => {
    const userRole = 'manager';
    return (
        <>
            <header>
                <nam>
                    <ul>
                        {
                            userRole === 'admin' ? (
                                <>
                                    <h1>HELLO ADMIN</h1>
                                    <li>
                                        <Link to='/admin/warehouse'>Warehouse</Link>
                                    </li>
                                    <li>
                                        <Link to='/admin/log'>Logs</Link>
                                    </li>
                                    <li>
                                        <Link to='/admin/order'>Orders</Link>
                                    </li>
                                    <li>
                                        <Link to='/admin/product'>Products</Link>
                                    </li>
                                    <li>
                                        <Link to='/admin/report'>Reports</Link>
                                    </li>
                                    <li>
                                        <Link to='/admin/role'>Roles</Link>
                                    </li>
                                    <li>
                                        <Link to='/admin/stock'>Stocks</Link>
                                    </li>
                                </>
                            ) : userRole === 'manager' ? (
                                <>
                                    <h1>HELLO MANAGER</h1>
                                    <li>
                                        <Link to='/manager/order'>Orders</Link>
                                    </li>
                                    <li>
                                        <Link to='/manager/product'>Products</Link>
                                    </li>
                                    <li>
                                        <Link to='/manager/report'>Reports</Link>
                                    </li>
                                    <li>
                                        <Link to='/manager/stock'>Stocks</Link>
                                    </li>
                                    <li>
                                        <Link to='/manager/warehouse'>Warehouse</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <Link to="/staff/"></Link>
                                </>
                            )
                            
                        }
                        
                    </ul>
                </nam>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <p>All rights reserved @2025</p>
            </footer>
        </>
    )
}

export default MainLayout;