import axios from 'axios'
import './App.css'
import { FC, useEffect, useState } from 'react'
import type { ColumnsType } from 'antd/es/table';
import { Table, Slider, Modal, Button, Form, Input, InputNumber, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { editOrderJson, useCreatePart, usePlaceOrder } from './utils';
import './App.css';

export interface OrderResult {
  items: {
    description: string,
    quantity: number,
    price: number
  }[],
  totalPrice: number
}

export interface DataType {
  id: number;
  description: string;
  price: number;
  quantity: number;
}

export type NewPartsType = {
  description?: string;
  price?: number;
  quantity?: number;
};

export interface OrderObj {
  [key: number]: number
}

export interface OrderJson {
  selectedParts: PartInOrder[]
}

export interface PartInOrder {
  id: number,
  quantity: number
}

const App: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [parts, setParts] = useState<DataType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [orderList, setOrderList] = useState<OrderObj>({});
  const { onCreatePart } = useCreatePart(setLoading, setShowModal, setParts, form);
  const { onPlaceOrder } = usePlaceOrder(setLoading, setParts, setOrderList, orderList);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const parts = await axios.get('http://localhost:5189/parts');
        setParts(parts.data.result)
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    })()

  }, [])

  const changeOrderList = debounce((id, e) => {
    setOrderList({ ...orderList, [id]: e });
  }, 200)

  //antd table config
  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: `description`
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, { quantity, id }: DataType) => {
        if (quantity <= 0) return 'Out of Stock'
        return (
          <div className={'Quantity'}>
            <span>In stock: {quantity}</span>
            <Slider
              max={quantity}
              min={0}
              defaultValue={0}
              onChange={e => changeOrderList(id, e)}
            />
          </div>
        )
      }

    }
  ]

  if (loading) return <Spin/>

  return (
    <div>
      <Table
        columns={columns}
        dataSource={[...parts]}
        rowKey={'id'}
      />

      <Button
        onClick={() => setShowModal(true)}
        id='btn-App-AddNewPart'
      >
        Add new part
      </Button>


      <Button
        onClick={onPlaceOrder}
        type='primary'
      >
        Place Order
      </Button>


      <Modal
        title="Add new part"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={form.submit}
      >
        <Form
          layout='horizontal'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 14 }}
          onFinish={onCreatePart}
          form={form}
        >
          <Form.Item<NewPartsType>
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<NewPartsType>
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input your price!' }]}
          >
            <InputNumber min={0.1} />
          </Form.Item>
          <Form.Item<NewPartsType>
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please input your quantity!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default App
