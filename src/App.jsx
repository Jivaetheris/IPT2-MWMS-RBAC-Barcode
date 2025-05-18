import React from 'react';
import { BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Logs from './pages/admin/Logs';
import Orders from './pages/admin/Orders';
import Product from './pages/admin/Product';
import Report from './pages/admin/Report';
// import Role from './pages/admin/Role';
import Stock from './pages/admin/Stock';
import Warehouse from './pages/admin/Warehouse';
import OrdersM from './pages/manager/OrdersM';
import ProductM from './pages/manager/ProductM';
import ReportM from './pages/manager/ReportM';
import StockM from './pages/manager/StockM';
import WarehouseM from './pages/manager/WarehouseM';
import WarehouseS from './pages/staff/WarehouseS';
import StockS from './pages/staff/StockS';
import ProductS from './pages/staff/ProductS';

const App = () => {

  return(
    <>
      <Router>
        <Routes>
          <Route path='/' element={<MainLayout />}>

            <Route path='/admin/warehouse' element={<Warehouse />}/>
            <Route path='/admin/stock' element={<Stock />}/>
            <Route path='/admin/order' element={<Orders />}/>
            <Route path='/admin/report' element={<Report />}/>
            <Route path='/admin/product' element={<Product />}/>
            <Route path='/admin/log' element={<Logs />}/>
            {/* <Route path='/admin/role' element={<Role />}/> */}

            <Route path='/manager/order' element={<OrdersM />}/>
            <Route path='/manager/product' element={<ProductM />}/>
            <Route path='/manager/report' element={<ReportM />}/>
            <Route path='/manager/stock' element={<StockM />}/>
            <Route path='/manager/warehouse' element={<WarehouseM />}/>
            
            <Route path='/staff/warehouse' element={<WarehouseS />}/>
            <Route path='/staff/stock' element={<StockS />}/>
            <Route path='/staff/product' element={<ProductS />}/>

            

          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
