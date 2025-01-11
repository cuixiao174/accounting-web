import { useState } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from 'antd';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';

const { RangePicker } = DatePicker;
const { Option } = Select;

const initialRecords = [
  {
    id: 1,
    type: '餐饮',
    amount: 50,
    date: '2025-01-10',
    username: '用户A',
  },
  {
    id: 2,
    type: '交通',
    amount: 8,
    date: '2025-01-09',
    username: '用户B',
  },
];

function Records() {
  const [records, setRecords] = useState(initialRecords);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setRecords(records.filter((record) => record.id !== id));
    message.success('删除成功');
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newRecord = {
        ...values,
        id: Date.now(),
        date: dayjs(values.date).format('YYYY-MM-DD'),
        username: '当前用户',
      };
      setRecords([...records, newRecord]);
      setIsModalVisible(false);
      message.success('添加成功');
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>
            新增消费记录
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          pagination={false}
        />

        <Modal
          title="新增消费记录"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="type"
              label="类型"
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select placeholder="请选择消费类型">
                <Option value="餐饮">餐饮</Option>
                <Option value="交通">交通</Option>
                <Option value="娱乐">娱乐</Option>
                <Option value="购物">购物</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="amount"
              label="金额"
              rules={[{ required: true, message: '请输入金额' }]}
            >
              <Input prefix="¥" type="number" />
            </Form.Item>

            <Form.Item
              name="date"
              label="日期"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default Records;
