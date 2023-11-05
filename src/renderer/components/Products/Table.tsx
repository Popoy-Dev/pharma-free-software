import React from 'react';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import collections from '@/renderer/database/db';

interface DataType {
  id: number;
  key: string;
  product_name: string;
  category: string;
  indication: string;
  manufacture_price: number;
  selling_price: number;
  isVat: boolean;
}

const ProductTable = ({ products, handleDeleteResult, editProduct }): any => {
  const doConfirm = async (id: number) => {
    const query = collections.products.find({
      selector: {
        id: {
          $eq: id.toString(),
        },
      },
    });
    const result = await query.remove();

    if (result) {
      handleDeleteResult(result);

      message.success('Product is successfully deleted!');
    } else {
      message.error('Something wrong please try again!');
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error('Action canceled');
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'id',
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Indication',
      dataIndex: 'indication',
    },
    {
      title: 'Manufacture price',
      dataIndex: 'manufacture_price',
      sorter: (a, b) => a.manufacture_price - b.manufacture_price,
    },
    {
      title: 'Selling price',
      dataIndex: 'selling_price',
      sorter: (a, b) => a.selling_price - b.selling_price,
    },
    {
      title: 'isVat',
      dataIndex: 'isVat',
    },
    {
      title: 'Action',
      key: 'product.id',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            style={{ backgroundColor: '#d9d764' }}
            onClick={() => editProduct(record)}
          >
            Update
          </Button>

          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => {
              doConfirm(record.id);
            }}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
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
        defaultPageSize: 5,
        total: products?.total,
      }}
    />
  );
};

export default ProductTable;
