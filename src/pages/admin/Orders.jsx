// Orders.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../createClient';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({ customer_name: '', status: 'Pending' });
  const [orderItems, setOrderItems] = useState([]);
  const [newItem, setNewItem] = useState({ product_id: '', quantity: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .order('name', { ascending: true });
    if (error) console.error('Products fetch error:', error);
    else setProducts(data);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('sales_orders')
      .select(
        `
        id,
        customer_name,
        order_date,
        status,
        sales_order_items (
          id,
          product_id,
          quantity
        )
      `
      )
      .order('order_date', { ascending: false });
    if (error) setError(error.message);
    else setOrders(data);
  };

  const handleOrderChange = e => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = e => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (newItem.product_id && newItem.quantity) {
      setOrderItems(prev => [...prev, newItem]);
      setNewItem({ product_id: '', quantity: '' });
    }
  };

  const createOrder = async () => {
  setError(null);
  setLoading(true); // Start loading

  try {
    const { data: order, error: orderErr } = await supabase
      .from('sales_orders')
      .insert([newOrder])
      .select()
      .single();

    if (orderErr) throw orderErr;

    if (orderItems.length) {
      const itemsToInsert = orderItems.map(item => ({
        sales_order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const { error: itemsErr } = await supabase
        .from('sales_order_items')
        .insert(itemsToInsert);

      if (itemsErr) throw itemsErr;
    }

    resetForm();
    await fetchOrders();
  } catch (err) {
    setError(err.message || 'Failed to create order');
  } finally {
    setLoading(false); // Stop loading regardless of success or error
  }
};


  const resetForm = () => {
    setNewOrder({ customer_name: '', status: 'Pending' });
    setOrderItems([]);
    setNewItem({ product_id: '', quantity: '' });
  };

  const updateOrderStatus = async (id, status) => {
    setLoading(true);
    const { error } = await supabase
      .from('sales_orders')
      .update({ status })
      .eq('id', id)
      .single();
    if (error) setError(error.message);
    else await fetchOrders();
    setLoading(false);
  };

  const deleteOrder = async id => {
    setLoading(true);
    await supabase.from('sales_order_items').delete().eq('sales_order_id', id);
    const { error } = await supabase.from('sales_orders').delete().eq('id', id);
    if (error) setError(error.message);
    else await fetchOrders();
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}

      {/* New Order Form */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create New Order</h2>
        <div className="flex flex-wrap items-center mb-2">
          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={newOrder.customer_name}
            onChange={handleOrderChange}
            className="border p-2 mr-2 mb-2"
            disabled={loading}
          />
          <select
            name="status"
            value={newOrder.status}
            onChange={handleOrderChange}
            className="border p-2 mr-2 mb-2"
            disabled={loading}
          >
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Received">Received</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center mb-4">
          <select
            name="product_id"
            value={newItem.product_id}
            onChange={handleItemChange}
            className="border p-2 mr-2 mb-2"
            disabled={loading}
          >
            <option value="">Select product...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={handleItemChange}
            className="border p-2 mr-2 mb-2 w-24"
            disabled={loading}
          />
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
            disabled={loading || !newItem.product_id || !newItem.quantity}
          >
            Add Item
          </button>
        </div>

        {orderItems.length > 0 && (
          <ul className="mb-4">
            {orderItems.map((item, i) => {
              const prod = products.find(p => p.id === item.product_id);
              return <li key={i}>{`${prod?.name || item.product_id} x ${item.quantity}`}</li>;
            })}
          </ul>
        )}

        <button
          onClick={createOrder}
          className={`px-6 py-2 rounded ${orderItems.length ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
          disabled={loading || !orderItems.length}
        >
          {loading ? 'Processing...' : 'Create Order'}
        </button>
      </section>

      {/* Orders Table */}
      <section>
        <h2 className="text-xl font-semibold mb-2">All Orders</h2>
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Items</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.customer_name}</td>
                <td className="p-2">{new Date(order.order_date).toLocaleDateString()}</td>
                <td className="p-2">
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className="border p-1"
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Received">Received</option>
                    <option value="Backordered">Backordered</option>
                  </select>
                </td>
                <td className="p-2">
                  <ul>
                    {order.sales_order_items.map(item => {
                      const prod = products.find(p => p.id === item.product_id);
                      return <li key={item.id}>{`${prod?.name || item.product_id} x ${item.quantity}`}</li>;
                    })}
                  </ul>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Orders;