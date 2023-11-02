import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Image, Pagination, Row } from 'antd';
import axios from 'axios';

function Shops() {
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<any>(3);

  useEffect(() => {
    axios
      .get('http://localhost:3000/advertisements')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handlePageChange = (page: number, size?: number) => {
    setPageSize(size);
    setCurrentPage(page);
  };
  const getBadgeColor = (badgeValue) => {
    switch (badgeValue) {
      case 'Hot Sales':
        return 'red';
      case 'Fast Moving':
        return 'Orange';
      case 'New Items':
        return 'blue';
      case 'Limited Stock':
        return 'Burgundy';
      case 'Best Seller':
        return 'Gold';
      case 'Discounted':
        return 'Pink';
      case 'Free Shipping':
        return 'Green';
      case 'Featured':
        return 'Silver';
      case 'Clearance':
        return 'Brown';
      case 'Top Rated':
        return 'Black ';
      default:
        return 'white';
    }
  };
  const startItem = (currentPage - 1) * pageSize;
  const endItem = currentPage * pageSize;
  const displayedData = data.slice(startItem, endItem);
  return (
    <div>
      <Row gutter={16}>
        {displayedData.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Col span={8} key={index} style={{ marginTop: '16px' }}>
            <Badge.Ribbon text={item.badge} color={getBadgeColor(item.badge)}>
              <Card title={item.title.toUpperCase()} bordered={false}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      style={{ width: '250px', height: '200px', textAlign: 'center' }}
                      src={item.image}
                    />
                  </div>
                  <div style={{ marginTop: '16px', letterSpacing: '1.4px', lineHeight: '30px' }}>
                    <div>
                      Generic Name: <span style={{ fontWeight: 'bold' }}>{item.genericName}</span>{' '}
                    </div>
                    <div>
                      Supplier Name: <span style={{}}>{item.shopName}</span>{' '}
                    </div>
                    <div>
                      Contact Number: <span style={{}}>{item.contact}</span>{' '}
                    </div>
                  </div>
                </div>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <Pagination
          current={currentPage}
          defaultCurrent={1}
          total={data.length}
          defaultPageSize={pageSize}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Shops;
