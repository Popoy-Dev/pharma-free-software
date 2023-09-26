import React, { useEffect } from 'react';
import { Button, Col, Form, InputNumber, Modal, Row, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type FieldType = {
  quantity: string;
};
interface DataType {
  quantity: number;
  date: string;
}

const ProductModal = ({
  open,
  onOk,
  confirmLoading,
  onCancel,
  onFinish,
  onFinishFailed,
  selectProduct,
  form,
  inventoryProducts,
}: any) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'id',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'id',
    },
  ];
  useEffect(() => {
    form.setFieldsValue({
      ...selectProduct,
    });
  }, [selectProduct]);
  return (
    <Modal
      title={selectProduct.product_name}
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
        initialValues={selectProduct}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: 'Please input manufacture number!' }]}
        >
          <InputNumber style={{ width: '100%' }} maxLength={11} />
        </Form.Item>
        <Table
          columns={columns}
          dataSource={inventoryProducts.map((product) => ({
            ...product,
            key: product.id,
          }))}
        />

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
