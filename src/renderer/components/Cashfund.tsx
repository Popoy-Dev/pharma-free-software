/* eslint-disable no-console */
import { Button, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import moment from 'moment';
import ProjectModal from './CashFund/Modal';
import collections from '../database/db';
import ProjectTable from './CashFund/Table';

function Project() {
  const id = uuid();
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [projects, setProjects] = useState<any>([]);
  const [deleteResult, setDeleteResult] = useState('');
  const [cashToday, setCashToday] = useState('');
  const [modalText, setModalText] = useState('Content of the modal');
  // const [isProjectEditModal, setIsProjectEditModalVisible] = useState(false);
  const [editValue, setEditValue] = useState<any>({});

  // Create a Moment.js object for the current date
  const currentDate = moment();

  // Format the current date in the desired format
  const formattedDate = currentDate.format('YYYY-MM-DD hh:mm:ss A');

  const showModal = () => {
    setOpen(true);
    form.setFieldsValue({
      cashfund: '',
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

  const getProjects = async () => {
    const result = await collections.cashfund
      .find({ sort: [{ date: 'desc' }] })

      .exec();

    if (result && result.length > 0) {
      const data = result.map((item) => item.toJSON());
      setProjects(data);
    } else {
      setProjects([]);
    }
  };
  const onFinish = async (values: any) => {
    if (editValue) {
      try {
        // Fetch the document you want to modify by its ID
        const existingDoc = await collections.cashfund
          .findOne({ selector: { id: editValue.id } })
          .exec();

        if (existingDoc) {
          await existingDoc.update({
            id: editValue.id,
            cashfund: values.cashfund,
            date: formattedDate,
          });
          setOpen(false);
          setCashToday(values.cashfund);
          getProjects();
        }
      } catch (error) {
        console.error('Error modifying cash fund:', error);
      }
    } else {
      try {
        const result = await collections.cashfund.insert({
          id,
          cashfund: values.cashfund,
          date: formattedDate,
        });
        if (result.isInstanceOfRxDocument) {
          setOpen(false);
          form.setFieldsValue({
            cashfund: '',
          });
          getProjects();
        }
      } catch (error) {
        console.error('Error saving project:', error);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    getProjects();
  }, [deleteResult]);
  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('id', id);
  }, []);

  const handleDeleteResult = (data) => {
    setDeleteResult(data);
  };

  const editProject = (list) => {
    setOpen(true);
    setEditValue(list);
  };

  useEffect(() => {
    // Assuming you have a 'projects' array and want to check the date of the first project
    // eslint-disable-next-line no-shadow
    const cashToday = moment(projects && projects[0]?.date);

    // Create a Moment.js object for the current date
    const currentDateToday = moment();
    // Check if the date of the first project matches the current date (ignoring time)
    if (currentDateToday.isSame(cashToday, 'day')) {
      setCashToday(projects[0]?.cashfund);
    } else {
      setCashToday('');
    }
  }, [projects]);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Cash Fund</h1>
        <h1 style={{ fontSize: '36px' }}>₱{!cashToday ? ' No Cash Fund for today!' : cashToday}</h1>
      </div>
      <div style={{ textAlign: 'right' }}>
        {!cashToday && (
          <Button type="primary" onClick={showModal} style={{ marginBottom: '12px' }}>
            Create cash fund
          </Button>
        )}

        <ProjectModal
          title="Cash Fund"
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

      <ProjectTable
        projects={projects}
        handleDeleteResult={handleDeleteResult}
        editProject={editProject}
      />
    </div>
  );
}

export default Project;
