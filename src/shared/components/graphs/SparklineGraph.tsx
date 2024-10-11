import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface SparklineGraphProps {
  data: number[];
}

const SparklineGraph: React.FC<SparklineGraphProps> = ({ data }) => {
  const options = {
    chart: {
      type: 'area', 
      backgroundColor: null,
      borderWidth: 0,
      margin: [2, 0, 2, 0],
      width: 120,
      height: 30, 
      style: {
        overflow: 'visible',
      },
      skipClone: true, 
    },
    title: {
      text: '',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      startOnTick: false,
      endOnTick: false,
      tickPositions: [],
    },
    yAxis: {
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      startOnTick: false,
      endOnTick: false,
      tickPositions: [0],
    },
    tooltip: {
      hideDelay: 0,
      outside: true,
      shared: true,
      formatter: function () {
        return `<b>${this.y}</b>`; // Only shows the y value, no "Series 1"
      }
    },
    legend: {
      enabled: false, 
    },
    plotOptions: {
      series: {
        animation: false,
        lineWidth: 1,
        shadow: false,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        marker: {
          radius: 2, 
          states: {
            hover: {
              radius: 3, 
            },
          },
        },
        fillOpacity: 0.25, 
      },
    },
    series: [
      {
        data,
        name: '',
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default SparklineGraph;
