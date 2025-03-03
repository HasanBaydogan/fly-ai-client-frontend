import React, { useEffect } from 'react';
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

// Register the required ECharts components and renderer
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

  const xAxisData = sortedData.map(item =>
    dayjs(item.priceDate, 'DD.MM.YYYY').format('D MMM')
  );
  const seriesData = sortedData.map(item => item.unitPriceCost);

  const options = {
    color: [getThemeColor('success')],
    tooltip: {
      trigger: 'axis',
      backgroundColor: getThemeColor('body-bg'),
      borderColor: getThemeColor('secondary-bg'),
      formatter: params =>
        params.map((p: any) => `${p.seriesName}: ${p.data}<br/>`).join('')
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
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: getThemeColor('tertiary-bg')
          }
        },
        axisLabel: {
          color: getThemeColor('body-color'),
          fontSize: 12
        }
      }
    ],
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: getThemeColor('tertiary-bg')
        }
      },
      axisLabel: {
        color: getThemeColor('body-color'),
        fontSize: 12
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
        smooth: true,
        areaStyle: {}
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
      opts={{ renderer: 'canvas' }} // Specify the renderer.
      style={{ minHeight: '320px', width: '100%' }}
    />
  );
};

export default PartTimelineGraph;
