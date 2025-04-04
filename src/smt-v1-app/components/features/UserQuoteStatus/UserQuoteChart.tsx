import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './UserQuoteChart.css';

interface DailyQuoteData {
  user: string;
  dailyQuotes: number[];
  totalQuote: number;
}

interface UserQuoteChartProps {
  data: DailyQuoteData[];
  selectedUsers: string[];
}

const UserQuoteChart: React.FC<UserQuoteChartProps> = ({
  data,
  selectedUsers
}) => {
  // Aktif/Pasif kullanıcıları takip etmek için state
  const [hiddenUsers, setHiddenUsers] = useState<string[]>([]);

  const transformDataForChart = () => {
    const chartData = Array.from({ length: 31 }, (_, index) => ({
      day: index + 1,
      ...data.reduce(
        (acc, curr) => {
          if (
            (curr.user === 'TOTAL' || selectedUsers.includes(curr.user)) &&
            !hiddenUsers.includes(curr.user)
          ) {
            acc[curr.user] = curr.dailyQuotes[index] || 0;
          }
          return acc;
        },
        {} as Record<string, number>
      )
    }));
    return chartData;
  };

  // Genişletilmiş renk paleti
  const getLineColor = (user: string): string => {
    const colors = {
      TOTAL: '#ff6b6b',
      'Kadir Polat': '#00C49F',
      'Hasan Baydoğan': '#0088FE',
      'Özgürhan Polat': '#FFBB28',
      'Yağmur Beygu': '#FF8042',
      'Ahmet Durmaz': '#8884d8',
      'Rfq Team': '#82ca9d',
      'Furkan Maya': '#38bdf8',
      'Flyai Gm': '#818cf8',
      'Ahmet Deneme': '#f472b6',
      default: '#a3a3a3'
    };
    return colors[user] || colors.default;
  };

  // Legend item'a tıklandığında
  const handleLegendClick = (user: string) => {
    setHiddenUsers(prev =>
      prev.includes(user) ? prev.filter(u => u !== user) : [...prev, user]
    );
  };

  return (
    <div className="quote-chart-container">
      {' '}
      <div className="chart-legend">
        {data
          .filter(
            row => row.user === 'TOTAL' || selectedUsers.includes(row.user)
          )
          .map(row => (
            <div
              key={row.user}
              className={`legend-item ${
                hiddenUsers.includes(row.user) ? 'inactive' : ''
              }`}
              onClick={() => handleLegendClick(row.user)}
            >
              <span
                className="legend-color"
                style={{ backgroundColor: getLineColor(row.user) }}
              />
              <span className="legend-text">{row.user}</span>
            </div>
          ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={transformDataForChart()}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
            label={{ value: 'Days', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: 'Quotes', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />

          {data
            .filter(
              row =>
                (row.user === 'TOTAL' || selectedUsers.includes(row.user)) &&
                !hiddenUsers.includes(row.user)
            )
            .map(row => (
              <Line
                key={row.user}
                type="linear"
                dataKey={row.user}
                stroke={getLineColor(row.user)}
                strokeWidth={row.user === 'TOTAL' ? 2.5 : 1.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserQuoteChart;
