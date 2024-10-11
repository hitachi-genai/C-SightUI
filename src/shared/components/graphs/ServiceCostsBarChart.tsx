import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ServiceCostGraphProps {
  data: number[];
}

const ServiceCostsBarChart :React.FC<ServiceCostGraphProps> = ({ data }) => {
  const options = {
    chart: {
      type: 'column',
      backgroundColor: null,
      height: 60,
      width: 160,
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      visible: false,
      categories: ['Compute', 'Storage', 'Networking', 'Management and Governance', 'Other'],
    },
    yAxis: {
      visible: false,
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
        color: '#e74c3c',
        borderRadius: 3,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ServiceCostsBarChart;
