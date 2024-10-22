import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ServiceCostsBarChartProps {
  categories: string[]; 
  data: number[];  
}
const ServiceCostsBarChart: React.FC<ServiceCostsBarChartProps> = ({ categories, data }) => {
  const options = {
    chart: {
      type: 'column',
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
      categories: categories,
    },
    yAxis: {
      visible: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,   
        borderWidth: 4,     
      }
    },
    
    tooltip: {
      useHTML: true,
      headerFormat: '',
      pointFormat: '<span>{point.category}</span><br/>Cost ($): <b>{point.y}</b>',
      backgroundColor: 'white',
      borderColor: 'black',
      borderRadius: 10,
      borderWidth: 1,
      shadow: true,
      style: {
        color: '#000',
        fontSize: '10px',
      },
    },
    legend: {
      enabled: false, 
    },
    series: [
      {
        data: data, 
        color: '#FFFFFF',
        borderRadius: 3,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ServiceCostsBarChart;
