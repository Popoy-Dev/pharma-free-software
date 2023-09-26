import React, { useEffect } from 'react';
import { Button, Col, Form, InputNumber, Modal, Row } from 'antd';

type FieldType = {
  cashfund: string;
};

const ProjectModal = ({
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
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={editValue}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Cash fund"
          name="cashfund"
          rules={[{ required: true, message: 'Please input cash fund!' }]}
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

export default ProjectModal;
