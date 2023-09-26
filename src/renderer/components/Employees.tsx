/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'antd';
import EmployeeModal from './Employees/Modal';
import EmployeeTable from './Employees/Table';
import collections from '../database/db';

function Employees() {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [employees, setEmployees] = useState<any>([]);
  const [deleteResult, setDeleteResult] = useState('');
  const [modalText, setModalText] = useState('Content of the modal');

  const [editValue, setEditValue] = useState<any>({});

  const showModal = () => {
    setOpen(true);
    form.setFieldsValue({
      name: '',
      position: '',
      rate: '',
      gcash: '',
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

  const getEmployees = async () => {
    const result = await collections.employees.find().exec();
    if (result && result.length > 0) {
      const data = result.map((item) => item.toJSON());

      setEmployees(data);
    } else {
      setEmployees([]);
    }
  };
  const onFinish = async (values: any) => {
    if (editValue) {
      try {
        // Fetch the document you want to modify by its ID
        const existingDoc = await collections.employees
          .findOne({ selector: { id: editValue.id } })
          .exec();

        if (existingDoc) {
          await existingDoc.update({
            id: editValue.id,
            name: values.name,
            position: values.position,
            rate: values.rate,
            gcash: values.gcash,
          });
          setOpen(false);
          getEmployees();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error modifying employee:', error);
      }
    } else {
      try {
        const result = await collections.employees.insert({
          id: Math.floor(Math.random() * 100).toString(),
          name: values.name,
          position: values.position,
          rate: values.rate,
          gcash: values.gcash,
        });
        if (result.isInstanceOfRxDocument) {
          setOpen(false);
          form.setFieldsValue({
            name: '',
            position: '',
            rate: '',
            gcash: '',
          });
          getEmployees();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving employee:', error);
      }
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    getEmployees();
  }, [deleteResult]);

  const handleDeleteResult = (data) => {
    console.log('data', data);
    setDeleteResult(data);
  };

  const editEmployee = (list) => {
    setOpen(true);
    setEditValue(list);
  };

  return (
    <div>
      <h1>Employees</h1>
      <div style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={showModal}>
          Create new employee
        </Button>
        <EmployeeModal
          title="Title"
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
      <EmployeeTable
        employees={employees}
        handleDeleteResult={handleDeleteResult}
        editEmployee={editEmployee}
      />
    </div>
  );
}

export default Employees;
