import React from 'react';
import CreateProduct from '../../components/CreateProduct'; // adjust path as needed

const Product = () => {
  return (
    <div>
      <h2>Product List</h2>
      {/* Product table/list here */}

      <h3>Add New Product</h3>
      <CreateProduct /> {/* Embedded form */}
    </div>
  );
};

export default Product;
