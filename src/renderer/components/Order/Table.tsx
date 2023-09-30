import React, { useState } from 'react';
import { Button, Card, InputNumber, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  id: number;
  key: string;
  product_name: string;
  stockTotal: string;
}

const ProductInventoryTable = ({ products, viewInventory }): any => {
  const [cartList, setCartList] = useState<any>([]);
  const handleAddList = (record, quantity) => {
    const data = {
      ...record,
      quantity,
    };

    const newCartList = [...cartList, data];
    setCartList(newCartList);
  };
  const [data, setData] = useState([]); // Your data here
  const [focusedInput, setFocusedInput] = useState(null);
  console.log('viewInventory', viewInventory);

  const handleInputChange = (event: any, index: any) => {
    const newData: any = [...data];
    newData[index] = event;
    setData(newData);
    setFocusedInput(index); // Update the focused input index
  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Price',
      dataIndex: 'selling_price',
      key: 'selling_price',
    },
    {
      title: 'Stock',
      dataIndex: 'stockTotal',
      key: 'stockTotal',
    },
    {
      title: 'Action',
      key: 'id',
      render: (_, record, i) => (
        <Space size="middle">
          <InputNumber
            key={i} // Add a unique key
            onChange={(event) => handleInputChange(event, i)}
            disabled={Number(record.stockTotal) === 0}
            value={data[i] || 0}
            autoFocus={focusedInput === i} // Autofocus based on focusedInput state
          />
          <Button
            type="primary"
            disabled={Number(data[i]) > Number(record.stockTotal)}
            onClick={() => handleAddList(record, data[i])}
          >
            Add
          </Button>
        </Space>
      ),
    },
  ];
  const handleRemoveItem = (itemToRemove) => {
    console.log('itemToRemove', itemToRemove);
    // Use filter to create a new cartList without the item to be removed
    const updatedCartList = cartList.filter((item) => item.key !== itemToRemove.key);

    // Update the cartList state with the updated list
    setCartList(updatedCartList);
  };
  const total = cartList
    .reduce((acc, item) => acc + parseFloat(item.selling_price) * item.quantity, 0)
    .toFixed(2);
  // Refactored order list columns
  const orderListColumns: ColumnsType<DataType> = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Price',
      dataIndex: 'selling_price',
      key: 'selling_price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Action',
      key: 'product.id',
      render: (_, record) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          onClick={() => handleRemoveItem(record)}
          style={{ cursor: 'pointer' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      ),
    },
  ];

  const orderListTable = (
    <Table
      style={{ width: '100%' }}
      columns={orderListColumns}
      dataSource={cartList.map((product) => ({
        ...product,
        key: product.key,
      }))}
      pagination={false}
    />
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Table
        style={{ width: '75%' }}
        columns={columns}
        dataSource={products.map((product) => ({
          ...product,
          key: `${product.id}-${Math.random()}`,
        }))}
      />
      <Card
        title="Order list"
        bordered={false}
        style={{
          width: '25%',
          marginLeft: '12px',
          boxShadow: '5px 5px 5px 10px #888888',
          overflowY: 'auto',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          {orderListTable}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              marginRight: '12px',
            }}
          >
            <h3>Total: {total}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductInventoryTable;
