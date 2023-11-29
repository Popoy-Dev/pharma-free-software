import React from 'react';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import collections from '@/renderer/database/db';
import moment from 'moment';

interface DataType {
  id: number;
  key: string;
  customerName: string;
  notes: string;
}

const CustomerTable = ({ customers, handleDeleteResult, editCustomer }): any => {
  const doConfirm = async (id: number) => {
    const query = collections.customers.find({
      selector: {
        id: {
          $eq: id.toString(),
        },
      },
    });
    const result = await query.remove();

    if (result) {
      handleDeleteResult(result);

      message.success('Customer is successfully deleted!');
    } else {
      message.error('Something wrong please try again!');
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error('Action canceled');
  };

  const today = moment();

  const calculateDaysToBirthday = ({ birthday }: any) => {
    const nextBirthday = moment(birthday).set('year', today.year());

    if (nextBirthday.isSameOrBefore(today)) {
      // If birthday has already occurred this year, set it to next year
      nextBirthday.add(1, 'year');
    }

    return nextBirthday.diff(today, 'days');
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'id',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'SC/PWD number',
      dataIndex: 'cardNumber',
      key: 'id',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Date',
      dataIndex: 'birthday',
      key: 'id',
      sorter: (a, b) => {
        const daysToBirthdayA = calculateDaysToBirthday(a);
        const daysToBirthdayB = calculateDaysToBirthday(b);

        return daysToBirthdayA - daysToBirthdayB;
      },
      render: (text) => moment(text).format('MMM DD, YYYY'),
    },
    {
      title: 'Action',
      key: 'customer.id',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            style={{ backgroundColor: '#d9d764' }}
            onClick={() => editCustomer(record)}
          >
            View
          </Button>

          <Popconfirm
            title="Are you sure to delete this customer?"
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
      dataSource={customers.map((customer) => ({
        ...customer,
        key: customer.id,
      }))}
      pagination={{
        defaultPageSize: 5,
        total: customers?.total,
      }}
    />
  );
};

export default CustomerTable;
