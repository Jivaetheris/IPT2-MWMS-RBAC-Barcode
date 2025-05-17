import { useState } from 'react';
import axios from 'axios';

const CreateProduct = () => {
    const [form, setForm] = useState({
        product_name: '',
        sku: '',
        category: '',
        cost_price: '',
        selling_price: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', form);
            alert('Product added!');
            setForm({ product_name: '', sku: '', category: '', cost_price: '', selling_price: '' });
        } catch (err) {
            console.error(err);
            alert('Error adding product');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="product_name" placeholder="Name" value={form.product_name} onChange={handleChange} required />
            <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            <input name="cost_price" type="number" placeholder="Cost Price" value={form.cost_price} onChange={handleChange} required />
            <input name="selling_price" type="number" placeholder="Selling Price" value={form.selling_price} onChange={handleChange} required />
            <button type="submit">Add Product</button>
        </form>
    );
};

export default CreateProduct;
