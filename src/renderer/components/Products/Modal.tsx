import React, { useEffect } from 'react';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';

type FieldType = {
  product_name: string;
  category: string;
  indication: string;
  manufacture_price: number;
  selling_price: number;
  isVat: boolean;
};

const ProductModal = ({
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
        name="product"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={editValue}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Product name"
          name="product_name"
          rules={[{ required: true, message: 'Please input Product name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select>
            <Select.Option value="Branded">Branded</Select.Option>
            <Select.Option value="Generic">Generic</Select.Option>
            <Select.Option value="Galenical">GALENICAL</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item<FieldType>
          label="Indication"
          name="indication"
          rules={[{ required: true, message: 'Please input rate!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Manufacture Price"
          name="manufacture_price"
          rules={[{ required: true, message: 'Please input manufacture number!' }]}
        >
          <InputNumber style={{ width: '100%' }} maxLength={11} />
        </Form.Item>
        <Form.Item<FieldType>
          label="Selling Price"
          name="selling_price"
          rules={[{ required: true, message: 'Please input selling price!' }]}
        >
          <InputNumber style={{ width: '100%' }} maxLength={11} />
        </Form.Item>
        <Form.Item label="Vat/Non-Vat" name="isVat">
          <Select>
            <Select.Option value="Vat">Vat</Select.Option>
            <Select.Option value="Non-Vat">Non-Vat</Select.Option>
          </Select>
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

export default ProductModal;
