import React, { useState, useEffect } from 'react';
import type { DatePickerProps } from 'antd';
import { Button, DatePicker, Table, Modal, Row, Col, Popconfirm, message, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import axios from 'axios';
import collections from '../database/db';
import { activationCheck } from '../assets/js/activation';

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
  const [isVoid, setIsVoid] = useState(false);
  const [viewOrderData, setViewOrderData] = useState<any>([]);
  const [receiptDetails, setReceiptDetails] = useState<any>({});
  const [startDate, setStartDate] = useState<any>('');
  const [endDate, setEndDate] = useState<any>('');
  const [activation, setActivation] = useState<any>('');

  useEffect(() => {
    const value: any = localStorage?.getItem('user');

    setActivation(activationCheck());

    if (value) {
      const parseData = JSON.parse(value);

      const shopDetails = {
        pharmacy: parseData?.pharmacy_name,
        address: parseData?.address,
        cashierName: parseData?.cashier_name,
        tin_no: parseData?.tin_no,
        cell_no: parseData?.cell_no,
      };

      setReceiptDetails(shopDetails);
    } else {
      console.log('Please set up receipt details in the Settings page.');
    }
  }, []);
  const viewOrder = (record, isVoidValue) => {
    setIsModalOpen(true);
    setIsVoid(isVoidValue);
    setViewOrderData(record);
  };
  const orderListColumns: ColumnsType<any> = [
    {
      title: 'Date and Time',
      key: 'date',
      render: (_, record) => <p>{moment(record.date).format('MMMM DD YYYY, h:mm:ss a')}</p>,
      sorter: (a, b) => {
        const dateA = moment(a.date);
        const dateB = moment(b.date);
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      },
    },
    {
      title: 'View Order',
      key: 'key', // Define a unique key for the column
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => viewOrder(record, false)}
          disabled={activation === undefined || activation === 0}
        >
          View
        </Button>
      ),
    },
    {
      title: 'Void',
      key: 'key', // Define a unique key for the column
      render: (_, record) => {
        const orderId = record.id.substring(record.id.length - 7);
        return (
          <Button
            danger
            onClick={() => viewOrder(record, true)}
            disabled={record?.order.isVoid || activation === undefined || activation === 0}
          >
            {orderId}
          </Button>
        );
      },
      sorter: (a, b) => {
        const isVoidA = a.order?.isVoid || false;
        const isVoidB = b.order?.isVoid || false;

        return isVoidA - isVoidB; // Sort in ascending order
      },
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
    setStartDate(start);
    setEndDate(end);
    const resultOrder = await collections.order
      .find({
        selector: {
          date: {
            $gte: `${start} 00:00:00 AM`,
            $lte: `${end} 23:59:59 PM`,
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

  const itemListTable = () => {
    const orderDataTable = { ...viewOrderData.order };
    delete orderDataTable.isVoid;
    const dataArray = Object.keys(orderDataTable).map((key) => orderDataTable[key]);

    return (
      <Table
        style={{ width: '100%' }}
        columns={itemListColumns}
        dataSource={dataArray}
        pagination={false}
      />
    );
  };

  const handleReprint = async () => {
    const { order, customerMoney, total, totalRegularPrice, id } = viewOrderData;
    const cartList = order;
    const reprint = true;
    await axios
      .post('http://localhost:5012/add', {
        cartList,
        customerMoney,
        total,
        totalRegularPrice,
        reprint,
        receiptDetails,
        id,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const confirm: any = async () => {
    const { order } = viewOrderData;
    let dataFetchInventory;

    const resultInventoriesFetch = await collections.inventory.find().exec();
    if (resultInventoriesFetch && resultInventoriesFetch.length > 0) {
      dataFetchInventory = resultInventoriesFetch.map((item) => item.toJSON());
    } else {
      dataFetchInventory = [];
    }

    order.map(async (orderItem) => {
      const { id: orderId, quantity: orderQuantity } = orderItem;

      const existingDoc = await collections.inventory
        .findOne({ selector: { product_id: orderId } })
        .exec();
      // eslint-disable-next-line no-underscore-dangle
      const { date, product_id: productId, sold, quantity, id } = existingDoc._data;
      if (existingDoc) {
        await existingDoc.update({
          id,
          product_id: productId,
          quantity,
          sold: sold - orderQuantity,
          date,
        });
      }
      const inventoryItem = dataFetchInventory.find((item) => item.product_id === id);
      if (inventoryItem) {
        return {
          ...inventoryItem,
          quantity: inventoryItem.quantity - quantity,
        };
      }
      return orderItem;
    });

    const existingOrder = await collections.order
      .findOne({ selector: { id: viewOrderData.id } })
      .exec();
    // eslint-disable-next-line no-underscore-dangle
    const orderExisting = existingOrder._data;
    if (existingOrder) {
      await existingOrder.update({
        ...orderExisting,
        totalProfit: '0',
        total: '0',
        order: { ...order, isVoid: true },
      });
    }
    let orderMapData;
    const resultOrder = await collections.order
      .find({
        selector: {
          date: {
            $gte: `${startDate} 00:00:00 AM`,
            $lte: `${endDate} 23:59:59 PM`,
          },
        },
        sort: [{ date: 'asc' }],
      })
      .exec();
    if (resultOrder && resultOrder.length > 0) {
      orderMapData = resultOrder.map((item) => item.toJSON());
    }
    setOrderData(orderMapData);
    setIsModalOpen(false);
    message.success('Order item has been successfully voided!');
  };

  const cancel: any = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
  };
  return (
    <div>
      <h1>Reports</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          {activation === undefined || activation === 0 ? (
            <Alert
              description="Unlock exclusive perks by managing your daily transactions, including the option to void items for refunds and reprint receipts. Reach out to us today!"
              type="warning"
              showIcon
            />
          ) : (
            <h1>{}</h1>
          )}
        </div>
        <DatePicker
          onChange={onChange}
          style={{ width: '30%', textAlign: 'left', marginBottom: '12px', marginLeft: '24px' }}
        />
      </div>
      {orderListTable}
      <div style={{ width: '75%', margin: 'auto', marginTop: '36px' }}>
        <Modal
          title={moment(viewOrderData.date).format('MMMM DD YYYY, h:mm:ss a')}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          {itemListTable()}
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
                <p style={{ margin: 4 }}>
                  Discount:{'    '}
                  {viewOrderData.totalRegularPrice === viewOrderData.total
                    ? Number(0).toFixed(2)
                    : Number(viewOrderData.totalRegularPrice - viewOrderData.total).toFixed(2)}
                </p>

                <p style={{ margin: 4 }}>
                  Customer Money:{'    '}
                  {Number(viewOrderData.customerMoney).toFixed(2) || Number(0).toFixed(2)}
                </p>

                <p style={{ fontWeight: 'bold', margin: 4 }}>
                  Total Amount:{'    '} {viewOrderData.total}
                </p>
              </div>
            </div>
          </div>
          <Row justify="space-between" style={{ marginTop: '24px' }}>
            <Col>
              <Button type="default" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
            <Col>
              {isVoid ? (
                <Popconfirm
                  title="Confirm Void Order"
                  description="Are you certain you want to void this order?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger htmlType="submit">
                    Void
                  </Button>
                </Popconfirm>
              ) : (
                <Button type="primary" htmlType="submit" onClick={handleReprint}>
                  Submit
                </Button>
              )}
            </Col>
          </Row>
        </Modal>
      </div>
    </div>
  );
}

export default Reports;
