import { Breadcrumb } from 'antd';
import React from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

function Settings() {
  const handleSetting = () => {
    console.log('hello');
  };
  return (
    <div>
      <div>
        {' '}
        <Breadcrumb
          items={[
            {
              onClick: handleSetting,
              title: <HomeOutlined />,
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
            {
              title: 'Application',
            },
          ]}
        />
      </div>
    </div>
  );
}

export default Settings;
