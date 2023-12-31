/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import ProductInventoryModal from './Inventory/Modal';
import ProductInventoryTable from './Inventory/Table';
import collections from '../database/db';
import { activationCheck } from '../assets/js/activation';

function Inventory() {
  const id = uuid();

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [productsSearch, setSearchProducts] = useState<any>([]);
  const [modalText, setModalText] = useState('Content of the modal');

  const [selectProduct, setSelectProduct] = useState<any>({});
  const [inventoryProducts, setInventoryProducts] = useState<any>([]);
  const [activation, setActivation] = useState<any>('');

  // Create a Moment.js object for the current date
  const currentDate = moment();

  // Format the current date in the desired format
  const formattedDate = currentDate.format('YYYY-MM-DD hh:mm:ss A');

  const handleCancel = () => {
    setOpen(false);
    setInventoryProducts([]);
  };

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const getProducts = async () => {
    let dataFetchInventory;
    let dataProduct: any;

    const resultInventoriesFetch = await collections.inventory.find().exec();
    if (resultInventoriesFetch && resultInventoriesFetch.length > 0) {
      dataFetchInventory = resultInventoriesFetch.map((item) => item.toJSON());
    } else {
      dataFetchInventory = [];
    }

    const resultProduct = await collections.products
      .find({ sort: [{ product_name: 'asc' }] })
      .exec();
    if (resultProduct && resultProduct.length > 0) {
      dataProduct = resultProduct.map((item) => item.toJSON());

      const updatedDataProduct = dataProduct.map((element) => {
        const matchResult = dataFetchInventory.filter((item) => element.id === item.product_id);
        if (matchResult.length > 0) {
          // Calculate the total sold quantity for all matching items
          const totalSold = matchResult.reduce((sum, item) => sum + item.sold, 0);
          const totalStock = matchResult.reduce((sum, item) => sum + item.quantity, 0);
          // Add the totalSold property to the element
          return { ...element, totalSold, totalStock: totalStock - totalSold };
        }

        return { ...element, totalSold: 0, totalStock: 0 };
      });

      setProducts(updatedDataProduct);
      setSearchProducts(updatedDataProduct);
    } else {
      setProducts([]);
    }
  };

  const getInventoryProduct = async (product) => {
    // query where product id

    const result = await collections.inventory.find().where('product_id').eq(product.id).exec();

    if (result && result.length > 0) {
      const data = result.map((item) => item.toJSON());

      setInventoryProducts(data);
    } else {
      setInventoryProducts([]);
    }
  };
  const onFinish = async (values: any) => {
    if (selectProduct) {
      try {
        const result = await collections.inventory.insert({
          id,
          product_id: selectProduct.id,
          quantity: values.quantity,
          date: formattedDate,
          sold: 0,
        });
        if (result.isInstanceOfRxDocument) {
          getInventoryProduct(selectProduct);
          setOpen(true);
          form.setFieldsValue({
            quantity: '',
          });
          getProducts();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving product:', error);
      }
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    setActivation(activationCheck());
    getProducts();
  }, []);

  const viewInventory = (product) => {
    // only one
    setSelectProduct(product);

    // get
    getInventoryProduct(product);
    setOpen(true);
  };
  const handleSearch = async (e: any) => {
    const result = products.filter((data) => {
      if (!e.target.value) {
        return products;
      }
      return data.product_name.toLocaleLowerCase().includes(e.target.value.toLowerCase());
    });

    setSearchProducts(result);
  };

  const exportToCSV = () => {
    const newArray = products.map((obj) => {
      const { id: removeId, ...rest }: any = obj;
      return rest;
    });

    const header = Object.keys(newArray[0]).join(',');

    const csvData = newArray.map((row) => Object.values(row).join(',')).join('\n');

    const csvString = `${header}\n${csvData}`;

    console.log(csvString);

    const blob = new Blob([csvString], { type: 'text/csv' });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Inventory.csv';
    a.click();

    window.URL.revokeObjectURL(url);
    return '';
  };
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Inventory</h1>
        <div>
          <Button
            type="primary"
            shape="round"
            disabled={activation === undefined || activation === 0}
            onClick={exportToCSV}
            icon={<DownloadOutlined />}
          >
            Download Inventory
          </Button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          {activation === undefined || activation === 0 ? (
            <Alert
              description="Effortlessly export your inventory data for greater control and insights.if you're ready to unleash the power of data export, reach out to us today!"
              type="warning"
              showIcon
            />
          ) : (
            <h1>{}</h1>
          )}
        </div>
        <Input
          onKeyUp={handleSearch}
          prefix={<SearchOutlined />}
          placeholder="Product name"
          style={{ width: '30%', textAlign: 'left', marginBottom: '12px', marginLeft: '24px' }}
        />
      </div>

      <div style={{ textAlign: 'right' }}>
        <ProductInventoryModal
          title="Title"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          modalText={modalText}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          selectProduct={selectProduct}
          form={form}
          inventoryProducts={inventoryProducts}
        />
      </div>

      <ProductInventoryTable products={productsSearch} viewInventory={viewInventory} />
    </div>
  );
}

export default Inventory;
