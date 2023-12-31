import React, { useEffect, useState } from 'react';
import { Button, Card, InputNumber, Space, Table, Checkbox, notification, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import collections from '../../database/db';

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

const ProductInventoryTable = ({ productsInventories, searchInputFocused }): any => {
  const [cartList, setCartList] = useState<any>([]);
  const [data, setData] = useState([]); // Your data here
  const [focusedInput, setFocusedInput] = useState(null);
  const [isSeniorGlobalValue, setIsSenior] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState<any>([]);
  const [totalSold, setTotalSold] = useState<any>([]);
  const [customerMoney, setCustomerMoney] = useState<any>(0);
  const [ownerId, setOwnerId] = useState<any>(null);
  const [receiptDetails, setReceiptDetails] = useState<any>({});
  const [receiptWarningMessage, setReceiptWarningMessage] = useState('');

  const [api, contextHolder] = notification.useNotification();
  // Create a Moment.js object for the current date
  const currentDate = moment();
  const id = uuid();
  // Format the current date in the desired format
  const formattedDate = currentDate.format('YYYY-MM-DD hh:mm:ss A');

  useEffect(() => {
    const value: any = localStorage?.getItem('user');

    if (value) {
      const parseData = JSON.parse(value);
      setOwnerId(parseData?.ownerId);
      const shopDetails = {
        pharmacy: parseData?.pharmacy_name,
        address: parseData?.address,
        cashierName: parseData?.cashier_name,
        tin_no: parseData?.tin_no,
        cell_no: parseData?.cell_no,
      };

      setReceiptDetails(shopDetails);
    } else {
      // Handle the case when 'user' data is not found in localStorage.
      // You can set default values or show an error message here.
      setReceiptWarningMessage('Please set up receipt details in the Settings page.');
    }
  }, []);
  const seniorItemComputation = (isSenior, newCartList) => {
    let total = 0;
    let seniorDiscount = 0;
    if (isSenior) {
      const updatedCartList = newCartList.map((list) => {
        if (list.isVat === 'Vat') {
          const vatValue = 28 / 25;
          const vatComputation = list.selling_price / vatValue;
          seniorDiscount = vatComputation * (20 / 100);

          // eslint-disable-next-line no-unused-vars
          total = vatComputation - seniorDiscount;

          return {
            ...list,
            senior_selling_price: total.toFixed(2),
          };
        }
        const vatComputation = list.selling_price;

        seniorDiscount = vatComputation * (20 / 100);
        total = vatComputation - seniorDiscount;

        return {
          ...list,
          senior_selling_price: total.toFixed(2),
        };
      });
      setCartList(updatedCartList);

      // Now, updatedCartList contains the updated prices
    } else {
      // Recompute prices without the discount when isSenior is false
      const updatedCartList = newCartList.map((list) => {
        if (list.isVat === 'Vat') {
          return {
            ...list,
            senior_selling_price: null,
          };
        }
        // Revert to the original price by adding 12 and 20
        return {
          ...list,
          senior_selling_price: null,
        };
      });
      setCartList(updatedCartList);
    }
  };

  const handleAddList = (record, quantity) => {
    setDisabledButtons([...disabledButtons, record.id]);
    const dataList = {
      ...record,
      quantity,
      ownerId,
    };

    const newCartList = [...cartList, dataList];
    seniorItemComputation(isSeniorGlobalValue, newCartList);
  };

  const handleRemoveItem = (itemToRemove) => {
    // Use filter to create a new cartList without the item to be removed
    const updatedCartList = cartList.filter((item) => item.key !== itemToRemove.key);

    const updateDisabledButtons = disabledButtons.filter((item) => item !== itemToRemove.id);
    setDisabledButtons([...updateDisabledButtons]);

    // Update the cartList state with the updated list
    setCartList(updatedCartList);
  };

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
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
    },
    {
      title: 'Price',
      dataIndex: 'selling_price',
      key: 'selling_price',
      sorter: (a, b) => a.selling_price - b.selling_price,
    },
    {
      title: 'Stock',
      dataIndex: 'stockTotal',
      key: 'stockTotal',
      render: (_, record) => <p>{String(Number(record.stockTotal || 0) - totalSold[record.id])}</p>,
      sorter: (a, b) => Number(a.stockTotal) - Number(b.stockTotal),
    },
    {
      title: 'Action',
      key: 'id',
      render: (_, record, i) => (
        <Space size="middle">
          <InputNumber
            min={1}
            key={i} // Add a unique key
            onChange={(event) => handleInputChange(event, i)}
            disabled={
              Number(record.stockTotal) - totalSold[record.id] <= 0 ||
              Number(record.stockTotal) === 0 ||
              disabledButtons.includes(record.id)
            }
            value={data[i] || 0}
            // eslint-disable-next-line max-len
            autoFocus={!searchInputFocused && focusedInput === i} // Autofocus based on focusedInput state
          />
          <Button
            type="primary"
            disabled={
              Number(record.stockTotal) - totalSold[record.id] <= 0 ||
              disabledButtons.includes(record.id) ||
              Number(data[i]) > Number(record.stockTotal) - totalSold[record.id] ||
              !Number(data[i])
            }
            onClick={() => handleAddList(record, data[i])}
          >
            Add
          </Button>
        </Space>
      ),
    },
  ];

  const total = cartList
    .reduce(
      (acc, item) =>
        acc + parseFloat(item.senior_selling_price || item.selling_price) * item.quantity,
      0,
    )
    .toFixed(2);

  const totalRegularPrice = cartList
    .reduce((acc, item) => acc + parseFloat(item.selling_price) * item.quantity, 0)
    .toFixed(2);
  const calculateItemProfit = (item) => {
    const manufacturePrice = parseFloat(item.manufacture_price);
    const sellingPrice = parseFloat(item.senior_selling_price || item.selling_price);
    const { quantity } = item;

    return (sellingPrice - manufacturePrice) * quantity;
  };
  const totalProfit = cartList.reduce((acc, item) => acc + calculateItemProfit(item), 0).toFixed(2);
  const openNotificationWithIcon = (type: any) => {
    api[type]({
      message: 'Order Success!',
      description: 'Order has been successfully placed.',
    });
  };

  // Refactored order list columns
  const orderListColumns: ColumnsType<DataType> = [
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
  const handleSenior = (e: CheckboxChangeEvent) => {
    setIsSenior(e.target.checked);
    seniorItemComputation(e.target.checked, cartList);
  };
  const getInventory = async () => {
    const resultInventory = await collections.inventory.find().exec();
    if (resultInventory && resultInventory.length > 0) {
      const dataInventory = resultInventory.map((item) => item.toJSON());

      // eslint-disable-next-line camelcase
      const computedTotalSold = dataInventory?.reduce((acc, { product_id, sold }) => {
        // Ensure 'sold' is a numeric value
        // eslint-disable-next-line no-param-reassign
        sold = parseFloat(sold) || 0;

        // eslint-disable-next-line camelcase
        if (!acc[product_id]) {
          // eslint-disable-next-line camelcase
          acc[product_id] = 0;
        }
        // eslint-disable-next-line camelcase
        acc[product_id] += sold;

        return acc;
      }, {}); // Initialize acc as an empty object
      setTotalSold(computedTotalSold);
    }
  };
  useEffect(() => {
    getInventory();
  }, []);

  const handleSaveOrder = async () => {
    if (cartList.length !== 0) {
      const result = await collections.order.insert({
        id,
        order: cartList,
        totalProfit,
        total,
        date: formattedDate,
        totalRegularPrice,
        customerMoney,
      });
      // eslint-disable-next-line no-underscore-dangle

      if (result.isInstanceOfRxDocument) {
        openNotificationWithIcon('success');
        setCartList([]);
        setDisabledButtons([]);
      }

      cartList.forEach(async (element) => {
        const res = await collections.inventory
          .findOne({ selector: { product_id: element.id } })
          .exec();
        if (res) {
          await res.update({
            $set: {
              sold: Number(res.sold) + element.quantity,
            },
          });
          getInventory();
        }
      });
      axios
        .post('http://localhost:5012/add', {
          cartList,
          customerMoney,
          total,
          totalRegularPrice,
          receiptDetails,
          id,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      setIsSenior(false);
    }
  };

  const handleCustomerMoney = (value) => {
    setCustomerMoney(value);
    setFocusedInput(null);
  };
  return (
    <div>
      {receiptWarningMessage && (
        <Alert message="Warning" description={receiptWarningMessage} type="warning" showIcon />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {contextHolder}

        <Table
          style={{ width: '53%' }}
          columns={columns}
          dataSource={productsInventories.map((product) => ({
            ...product,
            key: `${product.id}-${Math.random()}`,
          }))}
          pagination={{
            defaultPageSize: 5,
            total: productsInventories?.total,
          }}
        />
        <Card
          title="Order list"
          extra={
            <Checkbox onChange={handleSenior} checked={isSeniorGlobalValue}>
              Senior{' '}
            </Checkbox>
          }
          bordered={false}
          style={{
            width: '45%',
            marginLeft: '12px',
            boxShadow: '5px 5px 5px 10px #888888',
            overflowY: 'auto',
            top: '-90px',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            {orderListTable}
            <div
              style={{
                position: 'absolute',
                display: 'inline',
                bottom: '-10px',
                right: 0,
                marginRight: '12px',
                marginTop: '25px',
                marginBottom: '12px',
              }}
            >
              <div>
                Total: {total}{' '}
                {cartList.length !== 0 && (
                  <>
                    <InputNumber
                      min={1}
                      onChange={(value) => handleCustomerMoney(value)}
                      value={customerMoney}
                      onBlur={(e) => e.preventDefault()} // Prevent focus from moving away
                    />
                    <Button
                      type="primary"
                      onClick={handleSaveOrder}
                      disabled={total > customerMoney}
                    >
                      Buy
                    </Button>
                  </>
                )}
                <div style={{ marginTop: '12px' }}>
                  Change: {customerMoney > total && (customerMoney - total).toFixed(2)}{' '}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductInventoryTable;
