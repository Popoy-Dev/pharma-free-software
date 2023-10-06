import React from 'react';
import { Button, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  id: number;
  key: string;
  product_name: string;
}

const ProductInventoryTable = ({ products, viewInventory }): any => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'id',
    },
    {
      title: 'Stock',
      dataIndex: 'totalStock',
      key: 'id',
    },
    {
      title: 'Sold',
      dataIndex: 'totalSold',
      key: 'id',
    },
    {
      title: 'Action',
      key: 'product.id',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => viewInventory(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products.map((product) => ({
        ...product,
        key: product.id,
      }))}
    />
  );
};

export default ProductInventoryTable;
