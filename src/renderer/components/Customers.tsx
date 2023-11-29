/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { v4 as uuid } from 'uuid';

import { SearchOutlined } from '@ant-design/icons';
import CustomerModal from './Customers/Modal';
import CustomerTable from './Customers/Table';
import collections from '../database/db';

function Customers() {
  const id = uuid();

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [customers, setCustomers] = useState<any>([]);
  const [customersSearch, setSearchCustomers] = useState<any>([]);
  const [deleteResult, setDeleteResult] = useState('');
  const [modalText, setModalText] = useState('Content of the modal');

  const [editValue, setEditValue] = useState<any>({});

  const showModal = () => {
    setOpen(true);
    form.setFieldsValue({
      customerName: '',
      cardNumber: '',
      birthday: '',
      notes: '',
    });
    setEditValue('');
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const getCustomers = async () => {
    const result = await collections.customers
      .find({
        sort: [{ customerName: 'asc' }],
      })
      .exec();
    if (result && result.length > 0) {
      const data = result.map((item) => item.toJSON());

      setCustomers(data);
      setSearchCustomers(data);
    } else {
      setCustomers([]);
    }
  };
  const onFinish = async (values: any) => {
    if (editValue) {
      try {
        // Fetch the document you want to modify by its ID
        const existingDoc = await collections.customers
          .findOne({ selector: { id: editValue.id } })
          .exec();

        if (existingDoc) {
          await existingDoc.update({
            id: editValue.id,
            customerName: values.customerName,
            cardNumber: values.cardNumber,
            birthday: values.birthday.format('YYYY-MM-DD'),
            notes: values.notes,
          });
          setOpen(false);
          getCustomers();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error modifying customer:', error);
      }
    } else {
      try {
        const result = await collections.customers.insert({
          id,
          customerName: values.customerName,
          cardNumber: values.cardNumber,
          birthday: values.birthday.format('YYYY-MM-DD'),
          notes: values.notes,
        });
        if (result.isInstanceOfRxDocument) {
          setOpen(false);
          form.setFieldsValue({
            customerName: '',
            cardNumber: '',
            birthday: '',
            notes: '',
          });
          getCustomers();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving customer:', error);
      }
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    getCustomers();
  }, [deleteResult]);

  const handleDeleteResult = (data) => {
    setDeleteResult(data);
  };

  const editCustomer = (list): any => {
    setOpen(true);
    setEditValue(list);
  };
  const handleSearch = async (e: any) => {
    const result = customers.filter((data) => {
      if (!e.target.value) {
        return customers;
      }
      return data.customerName.toLocaleLowerCase().includes(e.target.value.toLowerCase());
    });

    setSearchCustomers(result);
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Customers</h1>
        <Input
          onKeyUp={handleSearch}
          prefix={<SearchOutlined />}
          placeholder="Search Customer"
          style={{ width: '30%', textAlign: 'left', marginBottom: '12px' }}
        />
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={showModal} style={{ marginBottom: '12px' }}>
          add customer
        </Button>
        <CustomerModal
          title={editValue ? `Edit customer` : 'Add customer'}
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          modalText={modalText}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          editValue={editValue}
          form={form}
        />
      </div>
      <CustomerTable
        customers={customersSearch}
        handleDeleteResult={handleDeleteResult}
        editCustomer={editCustomer}
      />
    </div>
  );
}

export default Customers;
