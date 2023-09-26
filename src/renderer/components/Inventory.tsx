/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'antd';
import { v4 as uuid } from 'uuid';

import moment from 'moment';
import ProductInventoryModal from './Inventory/Modal';
import ProductInventoryTable from './Inventory/Table';
import collections from '../database/db';

function Inventory() {
  const id = uuid();

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [modalText, setModalText] = useState('Content of the modal');

  const [selectProduct, setSelectProduct] = useState<any>({});
  const [inventoryProducts, setInventoryProducts] = useState<any>([]);

  // Create a Moment.js object for the current date
  const currentDate = moment();

  // Format the current date in the desired format
  const formattedDate = currentDate.format('YYYY-MM-DD hh:mm:ss A');
  const showModal = () => {
    setOpen(true);
    form.setFieldsValue({
      product_name: '',
      category: '',
      indication: '',
      manufacture_price: '',
      selling_price: '',
      isVat: '',
    });
    setSelectProduct('');
  };
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
    const result = await collections.products.find().exec();
    if (result && result.length > 0) {
      const data = result.map((item) => item.toJSON());

      setProducts(data);
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
    getProducts();
  }, []);

  const viewInventory = (product) => {
    // only one
    setSelectProduct(product);

    // get
    getInventoryProduct(product);
    setOpen(true);
  };
  return (
    <div>
      <h1>Inventory</h1>
      <div style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={showModal} style={{ marginBottom: '12px' }}>
          add product
        </Button>
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
      <ProductInventoryTable products={products} viewInventory={viewInventory} />
    </div>
  );
}

export default Inventory;
