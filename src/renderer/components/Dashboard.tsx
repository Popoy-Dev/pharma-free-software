import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Button, Modal } from 'antd';
import collections from '../database/db';

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    }
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
      <div style={{ textAlign: 'right', marginBottom: '12px' }}>
        <Button type="primary" onClick={showModal}>
          Calendar
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
            <h2 style={{ fontSize: '34px', margin: 0 }}>₱{totalSales.toFixed(2)}</h2>
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
            <h2 style={{ fontSize: '34px', margin: 0 }}>₱{totalProfit.toFixed(2)}</h2>
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
            <h2 style={{ fontSize: '34px', margin: 0 }}>₱{investment.toFixed(2)}</h2>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#1d91e3' }}>Investments</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
