import { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Spin,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getRecords, createRecord, updateRecord, deleteRecord } from '../api';

const { RangePicker } = DatePicker;
const { Option } = Select;

function Records() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: records, isLoading, isError } = useQuery('records', getRecords);
  const createMutation = useMutation(createRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries('records');
      message.success('添加成功');
    },
  });
  const updateMutation = useMutation(
    (record) => updateRecord(record.id, record),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('records');
        message.success('更新成功');
      },
    }
  );
  const deleteMutation = useMutation(deleteRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries('records');
      message.success('删除成功');
    },
  });

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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: 'var(--primary)' }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{ color: '#ff4d4f' }}
          />
        </>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const record = {
        ...values,
        date: dayjs(values.date).format('YYYY-MM-DD'),
      };

      if (form.getFieldValue('id')) {
        updateMutation.mutate({
          id: form.getFieldValue('id'),
          ...record,
        });
      } else {
        createMutation.mutate(record);
      }
      setIsModalVisible(false);
    });
  };

  if (isError) {
    return <div>加载数据失败</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">
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
