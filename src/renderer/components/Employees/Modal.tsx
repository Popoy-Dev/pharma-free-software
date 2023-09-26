import React, { useEffect } from 'react';
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';

type FieldType = {
  name: string;
  position: string;
  rate: string;
  gcash: string;
};

const EmployeeModal = ({
  title,
  open,
  onOk,
  confirmLoading,
  onCancel,
  onFinish,
  onFinishFailed,
  editValue,
  form,
}: any) => {
  useEffect(() => {
    form.setFieldsValue({
      ...editValue,
    });
  }, [editValue]);
  return (
    <Modal
      title={title}
      footer={null}
      open={open}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <Form
        form={form}
        name="basic1"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={editValue}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please input full name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Position"
          name="position"
          rules={[{ required: true, message: 'Please input position!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Rate"
          name="rate"
          rules={[{ required: true, message: 'Please input rate!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Gcash Number"
          name="gcash"
          rules={[{ required: true, message: 'Please input gcash number!' }]}
        >
          <InputNumber style={{ width: '100%' }} maxLength={11} />
        </Form.Item>

        <Row justify="space-between">
          <Col>
            <Button type="default" onClick={onCancel}>
              Cancel
            </Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;
