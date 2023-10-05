/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import OrderTable from './Order/Table';
import collections from '../database/db';

function Order() {
  const [products, setProducts] = useState<any>([]);
  const [inventories, setInventories] = useState<any>([]);
  const [productsInventories, setProductsInvetories] = useState<any>([]);

  const getInventoryAndProducts = async () => {
    const inventoryResult = await collections.inventory.find().exec();
    const productsResult = await collections.products.find().exec();
    setProducts(productsResult);
    setInventories(inventoryResult);
  };
  const getInventoryProducts = async () => {
    const order = products.map((product) => {
      const inventoryItem = inventories.filter((inventory) => inventory.product_id === product.id);

      const stockTotal = inventoryItem.reduce(
        (accumulator, item) => accumulator + parseInt(item.quantity, 10),
        0,
      );

      if (inventoryItem) {
        return {
          ...product.toJSON(),
          stockTotal,
        };
      }

      return '';
    });

    if (order && order.length > 0) {
      setProductsInvetories(order);
    } else {
      setProductsInvetories([]);
    }
  };

  useEffect(() => {
    getInventoryProducts();
  }, [products, inventories]);
  useEffect(() => {
    getInventoryAndProducts();
  }, []);

  return (
    <div>
      <h1>Order</h1>
      <div style={{ textAlign: 'right' }} />
      <OrderTable productsInventories={productsInventories} />
    </div>
  );
}

export default Order;
