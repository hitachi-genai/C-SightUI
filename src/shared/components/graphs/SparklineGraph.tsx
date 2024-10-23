import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface SparklineGraphProps {
  data: { date: string; incurredCost: number }[]; // Updated to include date and incurredCost
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
      type: 'datetime', // Use datetime type for x-axis
      labels: {
        enabled: false, // Hide labels for this small sparkline
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
      formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
        const date = Highcharts.dateFormat('%Y-%m-%d', this.x as number); // Format date
        return `<b>Date: ${date}</b><br/><b>Cost: $${this.y}</b>`; // Show both date and cost
      },
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
        data: data.map((point) => [new Date(point.date).getTime(), point.incurredCost]), // Map to [timestamp, cost]
        name: '',
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default SparklineGraph;
