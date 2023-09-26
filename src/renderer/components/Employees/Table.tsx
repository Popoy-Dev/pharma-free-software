import React from 'react';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import collections from '@/renderer/database/db';

interface DataType {
  id: number;
  key: string;
  name: string;
  position: string;
  rate: string;
  gcash: number;
}

const EmployeeTable = ({ employees, handleDeleteResult, editEmployee }): any => {
  const doConfirm = async (id: number) => {
    const query = collections.employees.find({
      selector: {
        id: {
          $eq: id.toString(),
        },
      },
    });
    const result = await query.remove();

    if (result) {
      handleDeleteResult(result);

      message.success('Employee is successfully deleted!');
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
      title: 'Full Name',
      dataIndex: 'name',
      key: 'id',
    },
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
    },
    {
      title: 'Gcash',
      dataIndex: 'gcash',
    },
    {
      title: 'Action',
      key: 'employee.id',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            style={{ backgroundColor: '#d9d764' }}
            onClick={() => editEmployee(record)}
          >
            Update {record.name}{' '}
          </Button>

          <Popconfirm
            title="Are you sure to delete this task?"
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
      dataSource={employees.map((employee) => ({
        ...employee,
        key: employee.id,
      }))}
    />
  );
};

export default EmployeeTable;
