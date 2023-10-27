import { Breadcrumb, Button, Form, Input, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

function Settings() {
  const [isSetting, setIsSetting] = useState(true);
  const [isActivation, setIsActivation] = useState(false);
  const [pharmacyInfo, setPharmacyInfo] = useState<any>('');

  type FieldType = {
    cashier_name?: string;
    pharmacy_name?: string;
    address?: string;
    tin_no?: string;
    cell_no?: string;
  };
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    let ownerId: any = Math.floor(Math.random() * 10000);
    // eslint-disable-next-line no-unused-expressions
    ownerId = String(ownerId) + values.pharmacy_name;
    const combinedValue = {
      ...values,
      ownerId,
    };

    localStorage.setItem('user', JSON.stringify(combinedValue));
  };

  useEffect(() => {
    const value: any = localStorage.getItem('user');
    const parseData = JSON.parse(value);
    setPharmacyInfo(parseData);

    if (parseData) {
      // Set initial form values and disable the form fields
      form.setFieldsValue({ ...parseData });
      // setIsFormDisabled(true);
    }
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleSetting = () => {
    setIsSetting(true);
    setIsActivation(false);
  };

  const breadCrumbTabs = () => (
    <Breadcrumb
      items={[
        {
          onClick: handleSetting,
          title: (
            <div style={{ cursor: 'pointer' }}>
              <HomeOutlined />
              <span>Settings</span>
            </div>
          ),
        },
        {
          onClick: handleSetting,
          title: (
            <div style={{ cursor: 'pointer' }}>
              <UserOutlined />
              <span>Application List</span>
            </div>
          ),
        },
      ]}
    />
  );

  const settingsComponent = () =>
    // eslint-disable-next-line no-unused-expressions
    isSetting ? (
      <div>
        {!pharmacyInfo ? (
          <Spin />
        ) : (
          <div style={{ width: '50%', margin: 'auto', marginTop: '36px' }}>
            <h3 style={{ textAlign: 'left' }}>Fill up for receipt details</h3>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              initialValues={pharmacyInfo}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="Pharmacy Name"
                name="pharmacy_name"
                rules={[{ required: true, message: 'Please input pharmacy name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input shop address' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                label="TIN number"
                name="tin_no"
                rules={[{ required: true, message: 'Please input TIN number' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                label="Phone number"
                name="cell_no"
                rules={[{ required: true, message: 'Please input phone number!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                label="Cashier Name"
                name="cashier_name"
                rules={[{ required: true, message: 'Please input cashier name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ display: pharmacyInfo ? '' : '' }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    ) : (
      ''
    );

  const activationComponent = () =>
    // eslint-disable-next-line no-unused-expressions
    isActivation ? <div> hello</div> : '';

  return (
    <div>
      <div> {breadCrumbTabs()}</div>
      <div>{settingsComponent()}</div>
      <div>{activationComponent()}</div>
      <div />
    </div>
  );
}

export default Settings;
