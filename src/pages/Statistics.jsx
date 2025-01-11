import { useState, useEffect } from 'react';
import { DatePicker, Select, Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';

const { RangePicker } = DatePicker;
const { Option } = Select;

const mockData = [
  { date: '2025-01-01', amount: 150 },
  { date: '2025-01-02', amount: 80 },
  { date: '2025-01-03', amount: 200 },
  { date: '2025-01-04', amount: 120 },
  { date: '2025-01-05', amount: 300 },
  { date: '2025-01-06', amount: 180 },
  { date: '2025-01-07', amount: 250 },
];

function Statistics() {
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: 替换为真实API请求
        await new Promise((resolve) => setTimeout(resolve, 500)); // 模拟网络延迟
        const filteredData = mockData.filter((item) =>
          dayjs(item.date).isBetween(dateRange[0], dateRange[1], null, '[]')
        );
        setChartData(filteredData);
      } catch (err) {
        setError(err);
        console.error('获取数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const getOption = () => {
    if (chartData.length === 0) {
      return {
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: '#999',
          },
        },
      };
    }

    return {
      title: {
        text: '消费统计',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: chartData.map((item) => item.date),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '消费金额',
          type: 'bar',
          data: chartData.map((item) => item.amount),
          itemStyle: {
            color: '#1890ff',
          },
        },
      ],
    };
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 24 }}>
        <Card>
          <div style={{ marginBottom: 24 }}>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: 300 }}
            />
          </div>
          <ReactECharts option={getOption()} style={{ height: 400 }} />
        </Card>
      </div>
    </div>
  );
}

export default Statistics;
