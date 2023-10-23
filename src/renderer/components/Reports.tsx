import React, { useState } from 'react';
import type { DatePickerProps } from 'antd';
import { Button, DatePicker, Table, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import collections from '../database/db';

interface DataType {
  product_id: any;
  quantity: number;
  selling_price: any;
  senior_selling_price: number;
  id: number;
  key: string;
  product_name: string;
  stockTotal: string;
}

function Reports() {
  const [ordedData, setOrderData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewOrderData, setViewOrderData] = useState<any>([]);
  const viewOrder = (record) => {
    setIsModalOpen(true);
    setViewOrderData(record);
  };
  const orderListColumns: ColumnsType<any> = [
    {
      title: 'Date and Time',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'View Order',
      key: 'key', // Define a unique key for the column
      render: (_, record) => (
        <Button type="primary" onClick={() => viewOrder(record)}>
          View
        </Button>
      ),
    },
  ];

  const itemListColumns: ColumnsType<DataType> = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Price x Quantity',
      key: 'price', // Define a unique key for the column
      render: (_, record) => {
        // Use a conditional statement to check the property and render accordingly
        const priceToDisplay =
          !record.senior_selling_price || record.senior_selling_price === null
            ? record.selling_price
            : record.senior_selling_price;

        return (
          <span>
            {priceToDisplay} x {record.quantity}
          </span>
        );
      },
    },
    {
      title: 'Total',
      key: 'quantity',
      render: (_, record) => {
        // Use a conditional statement to check the property and render accordingly
        const price =
          !record.senior_selling_price || record.senior_selling_price === null
            ? record.selling_price
            : record.senior_selling_price;

        const priceTodisplay = price * record.quantity;

        return <span>{priceTodisplay}</span>;
      },
    },
  ];

  const onChange: DatePickerProps['onChange'] = async (date, dateString) => {
    let orderMapData;
    const start = moment(dateString).format('YYYY-MM-DD');
    const end = moment(dateString).format('YYYY-MM-DD');

    const resultOrder = await collections.order
      .find({
        selector: {
          date: {
            $gte: `${start} 01:00:00 AM`,
            $lte: `${end} 12:00:00 PM`,
          },
        },
        sort: [{ date: 'asc' }],
      })
      .exec();
    if (resultOrder && resultOrder.length > 0) {
      orderMapData = resultOrder.map((item) => item.toJSON());
    }
    setOrderData(orderMapData);
  };

  const orderListTable = (
    <Table
      style={{ width: '100%' }}
      columns={orderListColumns}
      dataSource={
        ordedData &&
        ordedData?.map((product) => ({
          ...product,
          key: product.id,
        }))
      }
      pagination={{
        defaultPageSize: 10,
        total: ordedData?.total,
      }}
    />
  );
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const itemListTable = (
    <Table
      style={{ width: '100%' }}
      columns={itemListColumns}
      dataSource={viewOrderData.order}
      pagination={false}
    />
  );
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Reports</h1>
        <DatePicker
          onChange={onChange}
          style={{ width: '30%', textAlign: 'left', marginBottom: '12px' }}
        />
      </div>
      {orderListTable}
      <div style={{ width: '75%', margin: 'auto', marginTop: '36px' }}>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          {itemListTable}
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                marginTop: '16px',
              }}
            >
              <div style={{ alignItems: 'flex-start' }}>
                <p style={{ margin: 0 }}>
                  Discount:{'    '}
                  {viewOrderData.totalRegularPrice === viewOrderData.total
                    ? Number(0).toFixed(2)
                    : Number(viewOrderData.totalRegularPrice - viewOrderData.total).toFixed(2)}
                </p>

                <p style={{ margin: 0 }}>
                  Customer Money:{'    '}
                  {Number(viewOrderData.customerMoney).toFixed(2) || Number(0).toFixed(2)}
                </p>

                <p style={{ fontWeight: 'bold', margin: 0 }}>
                  Total Amount:{'    '} {viewOrderData.total}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Reports;
