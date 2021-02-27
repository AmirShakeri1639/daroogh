import { from } from 'jalali-moment';
import React, { PureComponent } from 'react';
import { useQuery } from 'react-query';
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Line,
  Legend,
  Tooltip,
} from 'recharts';
import Reports from '../../../../services/api/Reports';
import './style.css';

const { getExchangeStatus } = new Reports();

const RADIAN = Math.PI / 180;

const ExChangeChart: React.FC = () => {
  const { data } = useQuery('chart', getExchangeStatus);

  const renderCustomizedLabel: any = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
    index,
  }: {
    cx: any;
    cy: any;
    midAngle: any;
    innerRadius: any;
    outerRadius: any;
    percent: any;
    value: any;
    index: any;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        ({value})
      </text>
    );
  };
  return (

    
    <ResponsiveContainer width="100%" height={400}>
      <PieChart >
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={'100%'}
          labelLine={false}
          label={renderCustomizedLabel}
          fill="#8884d8"
          dataKey="item2"
          nameKey="item1"
        >
          {data &&
            data.length &&
            data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={'#' + entry.item4} />
            ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '99%' }} />
        {data &&
          data.length &&
          data.map((entry: any, index: number) => (
            <Line
              key={`Line-${index}`}
              dataKey="item1"
              name={'ami'}
              alignmentBaseline="text-after-edge"
              type="monotone"
              stroke={'#' + entry.item4}
            />
          ))}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExChangeChart;
