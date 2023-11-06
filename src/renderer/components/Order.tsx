/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import OrderTable from './Order/Table';
import collections from '../database/db';

function Order() {
  const [products, setProducts] = useState<any>([]);
  const [inventories, setInventories] = useState<any>([]);
  const [productsInventories, setProductsInvetories] = useState<any>([]);
  const [productsSearch, setSearchProducts] = useState<any>([]);
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);

  const getInventoryAndProducts = async () => {
    const inventoryResult = await collections.inventory.find().exec();
    const productsResult = await collections.products
      .find({ sort: [{ product_name: 'asc' }] })
      .exec();
    setProducts(productsResult);
    setInventories(inventoryResult);
  };
  const getInventoryProducts = async () => {
    const order = products?.map((product) => {
      const inventoryItem = inventories?.filter((inventory) => inventory.product_id === product.id);

      const stockTotal = inventoryItem?.reduce(
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
      setSearchProducts(order);
    } else {
      setProductsInvetories([]);
    }
  };

  useEffect(() => {
    getInventoryProducts();
  }, [products, inventories]);
  useEffect(() => {
    getInventoryAndProducts();

    axios
      .get('http://localhost:5012/advertisements')
      .then((response) => {
        if (response.status === 200) {
          setIsPrinterConnected(true);
        } else {
          setIsPrinterConnected(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleSearch = async (e: any) => {
    const result = productsInventories.filter((data) => {
      if (!e.target.value) {
        return products;
      }
      return data.product_name.toLocaleLowerCase().includes(e.target.value.toLowerCase());
    });

    setSearchProducts(result);
  };
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '53%',
        }}
      >
        <div>
          <h1>Order</h1>
          <div style={{ marginTop: '-24px' }}>
            {isPrinterConnected ? (
              <p style={{ color: 'green' }}>Printer is Connected</p>
            ) : (
              <p style={{ color: 'red' }}>Printer is not connected</p>
            )}
          </div>
        </div>

        <Input
          onKeyUp={handleSearch}
          prefix={<SearchOutlined />}
          placeholder="Search Product"
          style={{ width: '50%', textAlign: 'left', marginBottom: '12px', height: '40px' }}
        />
      </div>
      <div style={{ textAlign: 'right' }} />
      <OrderTable productsInventories={productsSearch} />
    </div>
  );
}

export default Order;
