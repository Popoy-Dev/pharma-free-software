import React, { useEffect, useState } from 'react';
import collections from '../database/db';

const Dashboard = () => {
  const [cashFund, setCashFund] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
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

  useEffect(() => {
    dashboardData();
  }, []);

  return (
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
  );
};

export default Dashboard;
