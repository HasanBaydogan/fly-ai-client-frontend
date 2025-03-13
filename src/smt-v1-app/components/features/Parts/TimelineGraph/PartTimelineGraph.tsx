import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { useAppContext } from 'providers/AppProvider';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';

dayjs.extend(customParseFormat);

echarts.use([
  LineChart,
  CanvasRenderer,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

export interface PartGraphItem {
  priceDate: string;
  unitPriceCost: number;
}

export interface PartTimelineGraphProps {
  graphData?: PartGraphItem[];
}

const PartTimelineGraph: React.FC<PartTimelineGraphProps> = ({
  graphData = []
}) => {
  const { getThemeColor } = useAppContext();

  const sortedData = [...graphData].sort(
    (a, b) =>
      dayjs(a.priceDate, 'DD.MM.YYYY').valueOf() -
      dayjs(b.priceDate, 'DD.MM.YYYY').valueOf()
  );

  const dateOccurrence: Record<string, number> = {};

  const seriesData = sortedData.map(item => {
    const date = dayjs(item.priceDate, 'DD.MM.YYYY');
    const dateKey = date.format('YYYY-MM-DD');
    const count = dateOccurrence[dateKey] || 0;
    dateOccurrence[dateKey] = count + 1;
    const offset = count * 60000;
    return [date.valueOf() + offset, item.unitPriceCost];
  });

  const distinctYears = new Set(
    sortedData.map(item => dayjs(item.priceDate, 'DD.MM.YYYY').year())
  );
  const labelFormatter = (value: number) =>
    distinctYears.size > 1
      ? dayjs(value).format('D MMM YYYY')
      : dayjs(value).format('D MMM');

  const values = sortedData.map(item => item.unitPriceCost);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const padding = maxValue > 100 ? 1000 : range * 0.2 || 1;
  const yAxisMin = minValue - padding;
  const yAxisMax = maxValue + padding;

  const options = {
    color: [getThemeColor('success')],
    tooltip: {
      trigger: 'axis',
      backgroundColor: getThemeColor('body-bg'),
      borderColor: getThemeColor('secondary-bg'),
      formatter: (params: any) =>
        params
          .map((p: any) => {
            const formattedCost = p.data[1].toLocaleString('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            return `${dayjs(p.data[0]).format(
              'D MMM YYYY'
            )}<br/>$${formattedCost}`;
          })
          .join('')
    },
    legend: {
      bottom: 10,
      data: ['Unit Price Cost'],
      textStyle: {
        color: getThemeColor('body-color'),
        fontWeight: 600,
        fontSize: 16,
        fontFamily: 'Nunito Sans'
      }
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: getThemeColor('tertiary-bg') }
      },
      axisLabel: {
        color: getThemeColor('body-color'),
        fontSize: 12,
        formatter: labelFormatter
      }
    },
    yAxis: {
      type: 'value',
      min: yAxisMin,
      max: yAxisMax,
      axisLine: {
        lineStyle: { color: getThemeColor('tertiary-bg') }
      },
      axisLabel: {
        color: getThemeColor('body-color'),
        fontSize: 12,
        formatter: (value: number) =>
          '$' +
          value.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
      },
      splitLine: {
        lineStyle: {
          color: getThemeColor('tertiary-bg'),
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'Unit Price Cost',
        type: 'line',
        data: seriesData,
        smooth: false
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: 20,
      containLabel: true
    }
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={options}
      opts={{ renderer: 'canvas' }}
      style={{ minHeight: '320px', width: '100%' }}
    />
  );
};

export default PartTimelineGraph;
