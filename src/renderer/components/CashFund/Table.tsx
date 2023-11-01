/* eslint-disable no-console */
import React from 'react';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import collections from '@/renderer/database/db';
import moment from 'moment';

interface DataType {
  id: number;
  key: string;
  name: string;
  age: number;
}

const ProjectTable = ({ projects, handleDeleteResult, editProject }): any => {
  const doConfirm = async (id: number) => {
    const query = collections.cashfund.find({
      selector: {
        id: {
          $eq: id.toString(),
        },
      },
    });
    const result = await query.remove();

    if (result) {
      handleDeleteResult(result);

      message.success('Project is successfully deleted!');
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
      title: 'Cash Fund',
      dataIndex: 'cashfund',
      key: 'id',
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },

    {
      title: 'Action',
      key: 'cashFund.id',
      render: (_, record: any) => {
        const dateToday = moment().format('YYYY-MM-DD');
        return (
          <Space size="middle">
            <Button
              type="primary"
              style={{ backgroundColor: '#d9d764' }}
              onClick={() => editProject(record)}
              disabled={dateToday !== moment(record.date).format('YYYY-MM-DD')}
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
              <Button danger style={{ display: 'none' }}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={projects.map((project) => ({
        ...project,
        key: project.id, // Assuming 'id' is a unique identifier for each project
      }))}
    />
  );
};

export default ProjectTable;
