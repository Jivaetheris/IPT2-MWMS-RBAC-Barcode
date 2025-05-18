import React, { useEffect, useState } from 'react';
import { supabase } from '../../createClient';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [transferData, setTransferData] = useState({
    product_id: '',
    from_warehouse_id: '',
    to_warehouse_id: '',
    quantity: ''
  });
  const [error, setError] = useState(null);
  const [alertThreshold, setAlertThreshold] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: stock }, { data: warehouses }, { data: products }] = await Promise.all([
      supabase.from('product_stock').select('*, products(name), warehouses(name)'),
      supabase.from('warehouses').select('*'),
      supabase.from('products').select('*')
    ]);

    setStockData(stock || []);
    setWarehouses(warehouses || []);
    setProducts(products || []);
  };

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferData(prev => ({ ...prev, [name]: value }));
  };

  const transferStock = async () => {
    const { product_id, from_warehouse_id, to_warehouse_id, quantity } = transferData;
    if (from_warehouse_id === to_warehouse_id) {
      setError("Cannot transfer to the same warehouse.");
      return;
    }

    const qty = parseInt(quantity);
    if (!product_id || !from_warehouse_id || !to_warehouse_id || qty <= 0) {
      setError("Please fill out all fields with valid data.");
      return;
    }

    // Deduct from source warehouse
    const { data: sourceStock } = await supabase
      .from('product_stock')
      .select('*')
      .eq('product_id', product_id)
      .eq('warehouse_id', from_warehouse_id)
      .single();

    if (!sourceStock || sourceStock.quantity < qty) {
      setError("Insufficient stock in source warehouse.");
      return;
    }

    await supabase
      .from('product_stock')
      .update({ quantity: sourceStock.quantity - qty })
      .eq('id', sourceStock.id);

    // Add to destination warehouse
    const { data: destStock } = await supabase
      .from('product_stock')
      .select('*')
      .eq('product_id', product_id)
      .eq('warehouse_id', to_warehouse_id)
      .single();

    if (destStock) {
      await supabase
        .from('product_stock')
        .update({ quantity: destStock.quantity + qty })
        .eq('id', destStock.id);
    } else {
      await supabase.from('product_stock').insert({
        product_id,
        warehouse_id: to_warehouse_id,
        quantity: qty
      });
    }

    setTransferData({ product_id: '', from_warehouse_id: '', to_warehouse_id: '', quantity: '' });
    setError(null);
    fetchData();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock Management</h1>
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}

      {/* Stock Table */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Stock Levels</h2>
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Warehouse</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map(stock => (
              <tr key={stock.id} className="border-t">
                <td className="p-2">{stock.products?.name}</td>
                <td className="p-2">{stock.warehouses?.name}</td>
                <td className="p-2">{stock.quantity}</td>
                <td className="p-2">
                  {stock.quantity < alertThreshold ? (
                    <span className="text-red-500 font-semibold">Low Stock</span>
                  ) : (
                    <span className="text-green-600">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Stock Transfer Form */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Transfer Stock</h2>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <select
            name="product_id"
            value={transferData.product_id}
            onChange={handleTransferChange}
            className="border p-2"
          >
            <option value="">Select Product</option>
            {products.map(prod => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </select>

          <select
            name="from_warehouse_id"
            value={transferData.from_warehouse_id}
            onChange={handleTransferChange}
            className="border p-2"
          >
            <option value="">From Warehouse</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>{wh.name}</option>
            ))}
          </select>

          <select
            name="to_warehouse_id"
            value={transferData.to_warehouse_id}
            onChange={handleTransferChange}
            className="border p-2"
          >
            <option value="">To Warehouse</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>{wh.name}</option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            value={transferData.quantity}
            onChange={handleTransferChange}
            placeholder="Quantity"
            className="border p-2 w-32"
          />

          <button
            onClick={transferStock}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Transfer
          </button>
        </div>
      </section>
    </div>
  );
};

export default Stock;
