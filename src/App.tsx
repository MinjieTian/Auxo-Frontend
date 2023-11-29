import axios from 'axios'
import './App.css'
import { FC, useEffect, useState } from 'react'
import type { ColumnsType } from 'antd/es/table';
import { Table, Slider, Modal, Button, Form, Input, InputNumber } from 'antd';

interface DataType {
  id: number;
  description: string;
  price: number;
  quantity: number;
}

type FieldType = {
  description?: string;
  price?: number;
  quantity?: number;
};

const App: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [parts, setParts] = useState<DataType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
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
      render: (_: any, { quantity }: DataType) =>
        <Slider
          max={quantity}
          min={0}
          defaultValue={0}
        />

    }
  ]

  console.log(showModal)
  if (loading) return null
  return (
    <div>
      <Table
        columns={columns}
        dataSource={parts}
        rowKey={'id'}
      />

      <Button
        onClick={() => setShowModal(true)}
      >
        Add new part
      </Button>


      <Modal
        title="Add new part"
        open={showModal}
        onCancel={() => setShowModal(false)}
      >
        <Form
          layout='horizontal'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item<FieldType>
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input your price!' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item<FieldType>
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please input your quantity!' }]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  )
}

export default App
