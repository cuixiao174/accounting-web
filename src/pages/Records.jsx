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
  Tabs,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';
import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../api/records';
import {
  getConsumptionTypes,
  createConsumptionType,
  updateConsumptionType,
  deleteConsumptionType,
} from '../api/consumptionType';

const { RangePicker } = DatePicker;
const { Option } = Select;

function Records() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('records');
  const [form] = Form.useForm();
  const [typeForm] = Form.useForm();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // 消费类型相关状态
  const {
    data: consumptionTypes,
    isLoading: isTypesLoading,
    isError: isTypesError,
  } = useQuery('consumptionTypes', getConsumptionTypes);

  const createTypeMutation = useMutation(createConsumptionType, {
    onSuccess: () => {
      queryClient.invalidateQueries('consumptionTypes');
      message.success('消费类型添加成功');
    },
  });

  const updateTypeMutation = useMutation(
    (type) => updateConsumptionType(type.id, type),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('consumptionTypes');
        message.success('消费类型更新成功');
      },
    }
  );

  const deleteTypeMutation = useMutation(deleteConsumptionType, {
    onSuccess: () => {
      queryClient.invalidateQueries('consumptionTypes');
      message.success('消费类型删除成功');
    },
  });

  const {
    data: records = [],
    isLoading,
    isError,
  } = useQuery(['consumptionRecords', user?.id], () => getRecords(user?.id), {
    select: (data) => (Array.isArray(data.records) ? data.records : []),
  });
  const createMutation = useMutation(createRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(['consumptionRecords', user?.id]);
      message.success('添加成功');
    },
    onError: (error) => {
      message.error(`添加失败: ${error.message}`);
    },
  });
  const updateMutation = useMutation(
    (record) => updateRecord(record.id, record),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['consumptionRecords', user?.id]);
        message.success('更新成功');
      },
    }
  );
  const deleteMutation = useMutation(deleteRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(['consumptionRecords', user?.id]);
      message.success('删除成功');
    },
  });

  const columns = [
    {
      title: '消费类型',
      dataIndex: 'consumptionTypeId',
      key: 'consumptionTypeId',
    },
    {
      title: '消费金额',
      dataIndex: 'consumptionAmount',
      key: 'consumptionAmount',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
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

  const typeIdMap = new Map(
    consumptionTypes?.map(
      (item) => [item.consumptionType, item.id] // [键, 值]
    )
  );
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const record = {
          consumptionTypeId: typeIdMap.get(values.consumptionType),
          consumptionAmount: values.consumptionAmount,
          createdAt: dayjs(values.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          userId: user.id,
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
      })
      .catch((error) => {
        console.error('表单验证失败:', error);
      });
  };

  if (!user) {
    return <div>请先登录</div>;
  }

  if (isError) {
    return <div>加载数据失败</div>;
  }

  const typeColumns = [
    {
      title: '时间类型',
      dataIndex: 'timeType',
      key: 'timeType',
    },
    {
      title: '消费类型',
      dataIndex: 'consumptionType',
      key: 'consumptionType',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleTypeEdit(record)}
            style={{ color: 'var(--primary)' }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleTypeDelete(record.id)}
            style={{ color: '#ff4d4f' }}
          />
        </>
      ),
    },
  ];

  const handleTypeAdd = () => {
    typeForm.resetFields();
    setIsTypeModalVisible(true);
  };

  const handleTypeEdit = (type) => {
    typeForm.setFieldsValue(type);
    setIsTypeModalVisible(true);
  };

  const handleTypeDelete = (id) => {
    deleteTypeMutation.mutate(id);
  };

  const handleTypeOk = () => {
    typeForm.validateFields().then((values) => {
      if (typeForm.getFieldValue('id')) {
        updateTypeMutation.mutate({
          id: typeForm.getFieldValue('id'),
          ...values,
        });
      } else {
        createTypeMutation.mutate(values);
      }
      setIsTypeModalVisible(false);
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            activeTab === 'records' ? (
              <Button type="primary" onClick={handleAdd}>
                新增消费记录
              </Button>
            ) : (
              <Button type="primary" onClick={handleTypeAdd}>
                新增消费类型
              </Button>
            )
          }
          items={[
            {
              key: 'records',
              label: '消费记录',
              children: (
                <Table
                  columns={columns}
                  dataSource={records}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
            {
              key: 'types',
              label: '消费类型管理',
              children: (
                <Table
                  columns={typeColumns}
                  dataSource={consumptionTypes}
                  rowKey="id"
                  pagination={false}
                  loading={isTypesLoading}
                />
              ),
            },
          ]}
        />

        <Modal
          title="新增消费记录"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="consumptionType"
              label="类型"
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select placeholder="请选择消费类型">
                {(consumptionTypes || []).map((type) => (
                  <Option key={type.id} value={type.consumptionType}>
                    {type.consumptionType}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="consumptionAmount"
              label="金额"
              rules={[{ required: true, message: '请输入金额' }]}
            >
              <Input prefix="¥" type="number" />
            </Form.Item>

            <Form.Item rules={[{ required: true, message: '请选择日期' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="消费类型管理"
          open={isTypeModalVisible}
          onOk={handleTypeOk}
          onCancel={() => setIsTypeModalVisible(false)}
        >
          <Form form={typeForm} layout="vertical">
            <Form.Item
              name="time_type"
              label="时间类型"
              rules={[{ required: true, message: '请输入时间类型' }]}
            >
              <Input placeholder="例如：月度、季度、年度" />
            </Form.Item>

            <Form.Item
              name="consumption_type"
              label="消费类型"
              rules={[{ required: true, message: '请输入消费类型' }]}
            >
              <Input placeholder="例如：餐饮、交通、娱乐" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default Records;
