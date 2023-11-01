import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Alert, Button, Modal } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import moment from 'moment';
import collections from '../database/db';
import { activationCheck } from '../assets/js/activation';

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalRangeAmoutbyDate, setTotalRangeDateAmount] = useState<any>([]);

  const activation = activationCheck();
  const dashboardData = async () => {
    let inventoryData;
    const result = await collections.products.find().exec();
    const resultInventory = await collections.inventory.find().exec();
    if (resultInventory && resultInventory.length > 0) {
      inventoryData = resultInventory.map((item) => item.toJSON());
    }

    if (result && result.length > 0) {
      const data = result.map((item) => item.toJSON());

      const totalInvestmentByProduct = {};

      // Assuming your inventoryData and product arrays are defined

      inventoryData.forEach((item) => {
        const productId = item.product_id;
        const { quantity } = item;

        // Find the corresponding product in the product array
        const product = data.find((p) => p.id === productId);

        if (product) {
          const manufacturePrice = product.manufacture_price;

          // Calculate the investment for the current item
          const investmentCompute = quantity * manufacturePrice;

          // Add the calculated investment to the total investment for the product
          if (totalInvestmentByProduct[productId]) {
            totalInvestmentByProduct[productId] += investmentCompute;
          } else {
            totalInvestmentByProduct[productId] = investmentCompute;
          }
        }
      });
      let totalInvestment = 0;

      // Loop through the values in the totalInvestmentByProduct object and add them up
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const productId in totalInvestmentByProduct) {
        totalInvestment += totalInvestmentByProduct[productId];
      }

      setInvestment(totalInvestment);
    }

    const start = moment(selectedStartDate).format('YYYY-MM-DD');
    const end = moment(selectedEndDate).format('YYYY-MM-DD');

    if (start === end) {
      const orderResult = await collections.order
        .find({
          selector: {
            date: {
              $gte: `${start} 00:00:00 AM`,
              $lte: `${end} 23:59:59 PM`,
            },
          },
        })
        .exec();

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
        setTotalSales(totalSalesCompute || 0);
        setTotalProfit(totalProfitCompute || 0);
      }
    } else {
      const fetchOrderByDate = await collections.order
        .find({
          selector: {
            date: {
              $gte: start,
              $lte: moment(selectedEndDate).add(1, 'days').format('YYYY-MM-DD'),
            },
          },
          sort: [{ date: 'asc' }],
        })
        .exec();

      let dateRangeData;
      if (fetchOrderByDate && fetchOrderByDate.length > 0) {
        dateRangeData = fetchOrderByDate.map((item) => item.toJSON());
      }
      const totalSalesCompute = dateRangeData?.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.total),
        0,
      );
      const totalProfitCompute = dateRangeData?.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.totalProfit),
        0,
      );
      setTotalSales(totalSalesCompute || 0);
      setTotalProfit(totalProfitCompute || 0);
    }
  };

  const handleSelect = async (date: any) => {
    const { startDate, endDate } = date.selection;

    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);

    const start = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10);
    const end = new Date(
      endDate.getTime() - endDate.getTimezoneOffset() * 60000 + 24 * 60 * 60 * 1000,
    )
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
        sort: [{ date: 'asc' }],
      })
      .exec();

    let dateRangeData;
    if (fetchOrderByDate && fetchOrderByDate.length > 0) {
      dateRangeData = fetchOrderByDate.map((item) => item.toJSON());
    }
    const dataArray: any = [];
    const dateScalesMap = {};
    dateRangeData?.forEach((element: any) => {
      const newArray = {
        Date: moment(element.date, 'YYYY-MM-DD hh:mm:ss A').format('MMMM DD YYYY'),
        scales: Number(element.total),
      };
      dataArray.push(newArray);
    });

    dataArray?.forEach((element) => {
      const { Date, scales } = element;
      if (dateScalesMap[Date]) {
        dateScalesMap[Date] += scales;
      } else {
        dateScalesMap[Date] = scales;
      }
    });

    const result = Object.keys(dateScalesMap).map((Date) => ({
      Date,
      scales: Number(dateScalesMap[Date]?.toFixed(2)),
    }));

    setTotalRangeDateAmount(result);
  };
  useEffect(() => {
    dashboardData();
  }, []);

  useEffect(() => {
    dashboardData();
  }, [selectedEndDate]);
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        {activation === undefined ? (
          <Alert
            description="To unlock premium benefits, seize the opportunity to monitor your daily sales and profits. Message us now!"
            type="warning"
            showIcon
          />
        ) : (
          <h1>{}</h1>
        )}

        <Button type="primary" onClick={showModal} style={{ justifyContent: 'start-end' }}>
          Calendar
        </Button>
        <Modal
          title="Date Range Selector"
          open={isModalVisible}
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
            {activation === undefined ? (
              <h2 style={{ fontSize: '34px', margin: 0 }}>₱00.00</h2>
            ) : (
              <h2 style={{ fontSize: '34px', margin: 0 }}>
                ₱{totalSales && totalSales.toFixed(2)}
              </h2>
            )}

            <h2 style={{ fontSize: '20px', margin: 0, color: '#4cdf65' }}>Total Sales</h2>
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
            {activation === undefined ? (
              <h2 style={{ fontSize: '34px', margin: 0 }}>₱00.00</h2>
            ) : (
              <h2 style={{ fontSize: '34px', margin: 0 }}>
                ₱{totalProfit && totalProfit.toFixed(2)}
              </h2>
            )}

            <h2 style={{ fontSize: '20px', margin: 0, color: '#e9781c' }}>Total Profits</h2>
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
            <h2 style={{ fontSize: '34px', margin: 0 }}>₱{investment && investment.toFixed(2)}</h2>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#1d91e3' }}>Investments</h2>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', textAlign: 'center', marginTop: '400px', margin: 'auto' }}>
        <AreaChart
          width={1000}
          height={400}
          data={totalRangeAmoutbyDate}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="scales" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
        <h1 style={{ textAlign: 'center', color: '#4e9d5b' }}>Sales Chart</h1>
      </div>
    </div>
  );
};

export default Dashboard;
