import React from 'react';
import { Button, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  totalSold: any;
  totalStock: any;
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
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
    },
    {
      title: 'Stock',
      dataIndex: 'totalStock',
      key: 'id',
      sorter: (a, b) => a.totalStock - b.totalStock,
    },
    {
      title: 'Sold',
      dataIndex: 'totalSold',
      key: 'id',
      sorter: (a, b) => a.totalSold - b.totalSold,
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
      pagination={{
        defaultPageSize: 2,
        total: products?.total,
      }}
    />
  );
};

export default ProductInventoryTable;
