import React, { useEffect } from 'react';
import { Button, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';

type FieldType = {
  customerName: string;
  notes: string;
  cardNumber: string;
  birthday: Date;
};

const CustomerModal = ({
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
      birthday: editValue.birthday ? dayjs(editValue.birthday, 'YYYY-MM-DD') : null,
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
        name="customer"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={editValue}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Customer name"
          name="customerName"
          rules={[{ required: true, message: 'Please input customer name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="SC/PWD number" name="cardNumber">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Birthday" name="birthday">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Notes"
          name="notes"
          rules={[{ required: true, message: 'Please input notes!' }]}
        >
          <TextArea rows={8} placeholder="Notes" />
        </Form.Item>

        <Row justify="space-between">
          <Col>
            <Button type="default" onClick={onCancel}>
              Cancel
            </Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CustomerModal;
