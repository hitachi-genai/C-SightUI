import React, { useState, useEffect } from 'react';
import CloudCostsLineChart from '../graphs/CloudCostsLineChart';
import ServiceCostsBarChart from '../graphs/ServiceCostsBarChart';
import { fetchTotalIncurredCost } from '../services/cloudCostService';
import { fetchTotalIncurredCostAllTime, fetchTotalIncurredCostLastMonth } from '../services/incurredCost';
import './cards.css';

const Cards = () => {
  const [incurredCosts, setIncurredCosts] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [maxIncurredCostAllTime, setMaxIncurredCostAllTime] = useState<number | null>(null); // State for maximum incurred cost

  useEffect(() => {
    const getTotalCost = async () => {
      try {
        const result = await fetchTotalIncurredCost();
        setTotalCost(result.data.totalIncurredCost);
        setIncurredCosts(result.data.incurredCostsByTimeUnit);
        
      } catch (error) {
        console.error('Failed to fetch total incurred cost:', error);
      }
    };


    const getAllTimeMaxCost = async () => {
      try {
        const result = await fetchTotalIncurredCostAllTime();
        console.log('All Time Costs Response:', result);
    
        
        const responseData = result[0]?.data;
    
        if (responseData && responseData.serviceCategories) {
          const incurredCosts = responseData.serviceCategories;

          if (Array.isArray(incurredCosts) && incurredCosts.length > 0) {
            const maxCost = Math.max(...incurredCosts.map(cost => cost.incurredCost));
            setMaxIncurredCostAllTime(maxCost);
          } else {
            console.error('No incurred costs found in the data.');
            setMaxIncurredCostAllTime(0);
          }
        } else {
          console.error('Incurred costs data is not available in the response');
          setMaxIncurredCostAllTime(0);
        }
      } catch (error) {
        console.error('Failed to fetch all-time incurred costs:', error);
      }
    };

    getTotalCost();
    getAllTimeMaxCost(); 
  }, []);

  return (
    <div className="dashboard-cards" style={{ display: 'flex', marginBottom: '16px' }}>
      <div className="card total-cost" style={{ flex: 1, marginRight: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>Total Cloud Costs</h3>
          <p>${totalCost ? totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</p>
          <CloudCostsLineChart incurredCosts={incurredCosts} />
          <span>↑ 25% Since last month</span>
        </div>
        <i className="far fa-light fa-money-bill-1" style={{ marginLeft: '8px', fontSize: '80px', color: '#70809078', marginTop: '-34%' }}></i>
      </div>

      <div className="card all-time-service" style={{ flex: 1, marginRight: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>All Time Service Costs | Max Compute</h3>
          <p>${maxIncurredCostAllTime !== null ? maxIncurredCostAllTime.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</p>
          <ServiceCostsBarChart data={[2, 4, 6, 8, 10]} />
          <span>↔ {maxIncurredCostAllTime ? maxIncurredCostAllTime : '0.00'} Cost range across service categories</span>
        </div>
        <i className="fas fa-magnifying-glass-dollar" style={{ marginLeft: '8px', fontSize: '80px', color: '#70809078', marginTop: '-34%' }}></i>
      </div>

      <div className="card last-month-service" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>Last Month Service Costs | Max Compute</h3>
          <p>$72,744</p>
          <ServiceCostsBarChart data={[2, 4, 6, 8, 10]} />
          <span>↔ $72,742 Cost range across service categories</span>
        </div>
        <i className="fas fa-calendar-day" style={{ marginLeft: '8px', fontSize: '80px', color: '#70809078', marginTop: '-34%' }}></i>
      </div>
    </div>
  );
}

export default Cards;
