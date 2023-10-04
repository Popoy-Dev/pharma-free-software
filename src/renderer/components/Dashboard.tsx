import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Button, Modal } from 'antd';
import collections from '../database/db';

const Dashboard = () => {
  const [cashFund, setCashFund] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dashboardData = async () => {
    const result = await collections.cashfund
      .find({
        selector: {
          date: {
            $gte: `${currentDateString} 00:00:00 AM`,
          },
        },
      })
      .exec();
    if (result && result.length > 0) {
      const data = result.map((item) => item.toJSON());
      setCashFund(data[0]?.cashfund);
    }

    const orderResult = await collections.order.find().exec();
    if (orderResult && orderResult.length > 0) {
      const data = orderResult.map((item) => item.toJSON());
      const totalSalesCompute = data.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.total),
        0,
      );
      const totalProfitCompute = data.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.totalProfit),
        0,
      );
      setTotalSales(totalSalesCompute);
      setTotalProfit(totalProfitCompute);

      console.log('data', data);
    }
    console.log('data');
  };

  const handleSelect = async (date: any) => {
    const { startDate, endDate } = date.selection;

    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);

    const start = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10);
    const end = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10);

    const fetchOrderByDate = await collections.order
      .find({
        selector: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
        sort: [{ 'data.created_at': 'desc' }],
      })
      .exec();

    console.log('fetchOrderByDate', fetchOrderByDate);
    // let dataArray: any = []
    // fetchOrderByDate.forEach((element: any) => {
    //   const newArray = {
    //     Date: element.created_at,
    //     scales: element.order_totals_details.totalAmount,
    //   }
    //   dataArray.push(newArray)
    // })
    // let lineGraphData = dataArray.reduce((acc: any, obj: any) => {
    //   let Date = obj.Date
    //   let scales = obj.scales

    //   let existingTransactionDate = acc.find((ac: any) => ac.Date === Date)

    //   if (existingTransactionDate) {
    //     existingTransactionDate.scales += scales
    //   } else {
    //     acc.push({ Date, scales })
    //   }

    //   return acc
    // }, [])

    // setTotalRangeDateAmount(lineGraphData)
    // setTotalAmount(
    //   data?.reduce(
    //     (acc: any, obj: any) => acc + obj.order_totals_details.totalAmount,
    //     0
    //   )
    // )
  };
  useEffect(() => {
    dashboardData();
  }, []);
  const selectionRange = {
    startDate: selectedStartDate,
    endDate: selectedEndDate,
    key: 'selection',
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const modalContent = (
    <div>
      <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
        rangeColors={['#ffbc21']}
        showDateDisplay
      />
    </div>
  );
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          style={{
            flex: '1',
            height: '100px',
            border: '1px solid #d4d971',
            margin: '0 5px',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 10px 20px rgba(39, 220, 117, 0.2)', // Add the boxShadow property
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
            }}
          >
            <h2 style={{ fontSize: '34px', margin: 0 }}>₱{cashFund.toFixed(2)}</h2>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#4cdf65' }}>Cashfund</h2>
          </div>
        </div>
        <div
          style={{
            flex: '1',
            height: '100px',
            border: '1px solid #d4d971',
            margin: '0 5px',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 10px 20px rgba(229, 146, 29, 0.2)', // Add the boxShadow property
          }}
        >
          {' '}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
            }}
          >
            <h2 style={{ fontSize: '34px', margin: 0 }}>₱{totalSales.toFixed(2)}</h2>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#e9781c' }}>Total Sale</h2>
          </div>
        </div>
        <div
          style={{
            flex: '1',
            height: '100px',
            border: '1px solid #d4d971',
            margin: '0 5px',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 10px 20px rgba(0, 191, 243, 0.2)', // Add the boxShadow property
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
            }}
          >
            <h2 style={{ fontSize: '34px', margin: 0 }}>₱{totalProfit.toFixed(2)}</h2>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#1d91e3' }}>Total Profit</h2>
          </div>
        </div>
      </div>
      <div>
        <Button type="primary" onClick={showModal}>
          Open Modal
        </Button>
        <Modal
          title="Date Range Selector"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={600}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              OK
            </Button>,
          ]}
        >
          {modalContent}
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
