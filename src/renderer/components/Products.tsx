/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { v4 as uuid } from 'uuid';

import { SearchOutlined } from '@ant-design/icons';
import ProductModal from './Products/Modal';
import ProductTable from './Products/Table';
import collections from '../database/db';

function Products() {
  const id = uuid();

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [productsSearch, setSearchProducts] = useState<any>([]);
  const [deleteResult, setDeleteResult] = useState('');
  const [modalText, setModalText] = useState('Content of the modal');

  const [editValue, setEditValue] = useState<any>({});

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
    setEditValue('');
  };
  const handleCancel = () => {
    setOpen(false);
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
    const result = await collections.products
      .find({
        sort: [{ product_name: 'asc' }],
      })
      .exec();
    if (result && result.length > 0) {
      const data = result.map((item) => item.toJSON());

      setProducts(data);
      setSearchProducts(data);
    } else {
      setProducts([]);
    }
  };
  const onFinish = async (values: any) => {
    if (editValue) {
      try {
        // Fetch the document you want to modify by its ID
        const existingDoc = await collections.products
          .findOne({ selector: { id: editValue.id } })
          .exec();

        if (existingDoc) {
          await existingDoc.update({
            id: editValue.id,
            product_name: values.product_name,
            category: values.category,
            indication: values.indication,
            manufacture_price: values.manufacture_price,
            selling_price: values.selling_price,
            isVat: values.isVat,
          });
          setOpen(false);
          getProducts();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error modifying product:', error);
      }
    } else {
      try {
        const result = await collections.products.insert({
          id,
          product_name: values.product_name,
          category: values.category,
          indication: values.indication,
          manufacture_price: values.manufacture_price,
          selling_price: values.selling_price,
          isVat: values.isVat,
        });
        if (result.isInstanceOfRxDocument) {
          setOpen(false);
          form.setFieldsValue({
            product_name: '',
            category: '',
            indication: '',
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
  }, [deleteResult]);

  const handleDeleteResult = (data) => {
    console.log('data', data);
    setDeleteResult(data);
  };

  const editProduct = (list) => {
    setOpen(true);
    setEditValue(list);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <Input
          onKeyUp={handleSearch}
          prefix={<SearchOutlined />}
          placeholder="Search Product"
          style={{ width: '30%', textAlign: 'left', marginBottom: '12px' }}
        />
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={showModal} style={{ marginBottom: '12px' }}>
          add product
        </Button>
        <ProductModal
          title={editValue ? `Edit product` : 'Add Product'}
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          modalText={modalText}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          editValue={editValue}
          form={form}
        />
      </div>
      <ProductTable
        products={productsSearch}
        handleDeleteResult={handleDeleteResult}
        editProduct={editProduct}
      />
    </div>
  );
}

export default Products;
