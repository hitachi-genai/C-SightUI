import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface CloudCostsLineChartProps {
  incurredCosts: { date: string; incurredCost: number }[]; // totalCost can be a number or null
}
const CloudCostsLineChart : React.FC<CloudCostsLineChartProps> = ({ incurredCosts }) => {
  const chartData = incurredCosts.map(item => ({
    x: new Date(item.date).getTime(), // Convert date to timestamp
    y: item.incurredCost,
  }));
  const options = {
    chart: {
      type: 'area',
      backgroundColor: null,
      height: 60,
      width: 160, // adjust width to match the style you want
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    legend: {
      enabled: false, // Disable legend
    },
    tooltip: {
      pointFormat: 'Cost: <b>{point.y}</b>',
    },
    series: [
      {
        data: chartData,
        color: '#00bff3',
        fillOpacity: 0.2,
        marker: {
          enabled: true,
          radius: 3,
        },
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default CloudCostsLineChart;
