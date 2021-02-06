import React, { PureComponent } from 'react';
import { useQuery } from 'react-query';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import Reports from '../../../../services/api/Reports';

// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 },
// ];
const { getExchangeStatus } = new Reports();

const RADIAN = Math.PI / 180;

const ExChangeChart: React.FC = () => {
  const { data } = useQuery('chart', getExchangeStatus);
  debugger;
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
    const x = cx + radius * Math.cos(midAngle * RADIAN);
    const y = cy + radius * Math.sin(midAngle * RADIAN);
    debugger;
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {data[index].item1} ({value})
      </text>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={650}>
      <PieChart height={650}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={300}
          labelLine={false}
          label={renderCustomizedLabel}
          fill="#8884d8"
          dataKey="item2"
        >
          {data &&
            data.length &&
            data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={'#' + entry.item4} />
            ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExChangeChart;
