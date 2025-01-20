import { useState } from 'react';
import { DatePicker, Select, Card, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';
import { useQuery } from 'react-query';
import { getStatistics } from '../api';

const { RangePicker } = DatePicker;
const { Option } = Select;

function Statistics() {
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);

  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery(['statistics', dateRange], () =>
    getStatistics({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    })
  );

  if (isError) {
    return <div>加载数据失败</div>;
  }

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
