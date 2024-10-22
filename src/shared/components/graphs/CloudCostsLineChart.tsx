import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface CloudCostsLineChartProps {
  incurredCosts: { date: string; incurredCost: number }[];
}
const CloudCostsLineChart : React.FC<CloudCostsLineChartProps> = ({ incurredCosts }) => {
  const chartData = incurredCosts.map(item => ({
    x: new Date(item.date).getTime(), 
    y: Math.floor(item.incurredCost), 
  }));
  const options = {
    chart: {
      type: 'area',
      backgroundColor: null,
      height: 80,
      width: 200, 
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      visible: false,
      type: 'datetime'
    },
    yAxis: {
      visible: false,
    },
    legend: {
      enabled: false, 
    },
    tooltip: {
      shadow: true,
      pointFormat: 'Cost: <b>{point.y}</b>',
    },
    series: [
      {
        data: chartData,
        color: '#FFFFFF',  
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
