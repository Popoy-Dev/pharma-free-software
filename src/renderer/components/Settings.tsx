import { Alert, Breadcrumb, Button, Form, Input, Select, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { activationCheck } from '../assets/js/activation';

function Settings() {
  const [isSetting, setIsSetting] = useState(true);
  const [isActivation, setIsActivation] = useState(false);
  const [isNewSetup, IsNewSetup] = useState(false);
  const [activationSuccess, isActivationSuccess] = useState(false);
  const [remainingDays, setRemainingDays] = useState('');
  const [pharmacyInfo, setPharmacyInfo] = useState<any>('');
  const [api, contextHolder] = notification.useNotification();

  type FieldType = {
    cashier_name?: string;
    pharmacy_name?: string;
    address?: string;
    tin_no?: string;
    cell_no?: string;
  };
  const [form] = Form.useForm();
  const openNotificationWithIcon = (type: any) => {
    api[type]({
      message: 'Success!',
      description: 'Receipt details have been saved successfully.',
    });
  };

  const onFinish = (values: any) => {
    let ownerId: any = Math.floor(Math.random() * 10000);
    // eslint-disable-next-line no-unused-expressions
    ownerId = String(ownerId) + values.pharmacy_name;
    const combinedValue = {
      ...values,
      ownerId,
    };

    localStorage.setItem('user', JSON.stringify(combinedValue));
    openNotificationWithIcon('success');
  };

  useEffect(() => {
    const value: any = localStorage.getItem('user');
    IsNewSetup(true);
    if (value) {
      const parseData = JSON.parse(value);
      setPharmacyInfo(parseData);
      if (parseData) {
        // Set initial form values and disable the form fields
        form.setFieldsValue({ ...parseData });
        // setIsFormDisabled(true);
      }
    }
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleSetting = () => {
    setIsSetting(true);
    setIsActivation(false);
  };

  const handleActivation = () => {
    setIsSetting(false);
    setIsActivation(true);
  };

  const breadCrumbTabs = () => (
    <Breadcrumb
      items={[
        {
          onClick: handleSetting,
          title: (
            <div style={{ cursor: 'pointer' }}>
              <HomeOutlined />
              <span>Receipt Details</span>
            </div>
          ),
        },
        {
          onClick: handleActivation,
          title: (
            <div style={{ cursor: 'pointer' }}>
              <UserOutlined />
              <span>Activation</span>
            </div>
          ),
        },
      ]}
    />
  );
  const openNotificationWithIconActivation = (type: any) => {
    let message = '';
    let description = '';

    if (type === 'success') {
      message = 'Success!';
      description = 'Application successfully activated.';
    } else {
      message = 'Error!';
      description = 'Wrong activation number.';
    }
    api[type]({
      message,
      description,
    });
  };

  const onFinishActivate = (values: any) => {
    let word2;
    switch (values.duration) {
      case 'onemonth':
        word2 = 'onemo';
        break;
      case 'sixmonth':
        word2 = 'sixmo';
        break;
      case 'oneyear':
        word2 = 'oneyr';
        break;
      default:
        break;
    }

    const today = new Date();
    const month = today.toLocaleString('default', { month: 'short' }).toLowerCase();
    const day = String(today.getDate()).padStart(2, '0');
    const word1 = `${month}${day}`;

    let combinedWord = '';
    const maxLen = Math.max(word1.length, word2.length);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < maxLen; i++) {
      if (i < word1.length) {
        combinedWord += word1[i];
      }
      if (i < word2.length) {
        combinedWord += word2[i];
      }
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const activateNumberYear = combinedWord + currentYear;

    if (values.activation === combinedWord) {
      isActivationSuccess(true);
      localStorage.setItem('activation', JSON.stringify(activateNumberYear));
      openNotificationWithIconActivation('success');
    } else {
      openNotificationWithIconActivation('error');
    }
  };

  useEffect(() => {
    // localStorage.setItem('activation', 'null');

    const value: any = localStorage.getItem('activation');
    if (!value || value === 'null') {
      isActivationSuccess(false);
    } else {
      isActivationSuccess(true);
    }
  }, []);

  useEffect(() => {
    const value: any = localStorage.getItem('activation');
    if (!value || value === 'null') {
      isActivationSuccess(false);
    } else {
      const differenceInDays = activationCheck();
      setRemainingDays(differenceInDays);
      if (differenceInDays === 0 || !differenceInDays) {
        localStorage.setItem('activation', 'null');
      }
    }
  }, [activationSuccess]);
  const settingsComponent = () =>
    // eslint-disable-next-line no-unused-expressions
    isSetting ? (
      <div>
        {isNewSetup && (
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
    isActivation ? (
      <div>
        <div style={{ width: '50%', margin: 'auto', marginTop: '36px' }}>
          <h3 style={{ textAlign: 'left' }}>Activation</h3>
          {!activationSuccess ? (
            <Form
              name="activate"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinishActivate}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Duration Period"
                name="duration"
                rules={[{ required: true, message: 'Please select duration!' }]}
              >
                <Select
                  style={{ width: '100%' }}
                  options={[
                    { value: 'onemonth', label: 'One Month' },
                    { value: 'sixmonth', label: 'Six Month' },
                    { value: 'oneyear', label: '1 Year' },
                  ]}
                />
              </Form.Item>

              <Form.Item<any>
                label="Activation Number"
                name="activation"
                rules={[{ required: true, message: 'Please input activation number!' }]}
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
          ) : (
            <Alert
              message="Premium Access Activated."
              description={`Congratulations! Your premium access has been successfully activated. You now have ${remainingDays} days to enjoy all the premium features.`}
              type="success"
              showIcon
            />
          )}
        </div>
      </div>
    ) : (
      ''
    );

  return (
    <div>
      {contextHolder}
      <div> {breadCrumbTabs()}</div>
      <div>{settingsComponent()}</div>
      <div>{activationComponent()}</div>
      <div />
    </div>
  );
}

export default Settings;
