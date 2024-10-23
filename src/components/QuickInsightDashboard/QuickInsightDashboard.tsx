import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsTreemap from 'highcharts/modules/treemap';
import { Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

HighchartsMore(Highcharts);
HighchartsTreemap(Highcharts);
// HighchartsGantt(Highcharts);

import './QuickInsightDashboard.css';

// Highcharts Configuration (same as before)
const lineChartOptions = {
  credits: { enabled: false },
  title: {
    text: '<h1 style="font-size: 16px; font-weight:800">Cost projections: Total monthly costs (infrastructure & staff)</h1>',
    useHTML: true,
    align: 'left',
  },

  xAxis: { categories: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'] },
  series: [
    { name: 'Forecast', data: [2650, 2675, 2700, 2725, 2750, 2775, 2800], type: 'line' },
    {
      name: 'Prediction confidence interval',
      type: 'arearange',
      data: [[2650, 2700], [2675, 2725], [2700, 2750], [2725, 2800], [2750, 2825]],
    },
  ],
};

const treemapOptions = {
  credits: { enabled: false },
  title: {
    text: '<h1 style="font-size: 16px;font-weight:800;">Cost allocation</h1>',
    useHTML: true,
    align: 'left',
  },
  series: [{
    type: 'treemap',
    layoutAlgorithm: 'squarified',
    data: [
      { name: 'Staff', value: 8116000, color: '#7cb5ec' },
      { name: 'Infrastructure', value: 8116000, color: '#434348' },
      { name: 'Development & Maintenance', value: 8116000, color: '#90ed7d' },
      { name: 'Runtime', value: 8116000, color: '#f7a35c' },
      { name: 'Other', value: 5000000, color: '#f15c80' },
    ],
  }],
};

// const ganttOptions = {
//   credits: { enabled: false },
//   title: {
//     text: '<h2 style="font-weight:bold;">GenAI Project Timeline</h2>', 
//     useHTML: true, // Allows HTML rendering
//   },
//   series: [{
//     name: 'GenAI Phases',
//     data: [
//       { name: 'Phase 1', start: Date.UTC(2024, 0, 1), end: Date.UTC(2024, 3, 30), completed: 0.5 },
//       { name: 'Phase 2', start: Date.UTC(2024, 4, 1), end: Date.UTC(2024, 6, 30), completed: 0.2 },
//     ],
//   }],
//   xAxis: {
//     tickInterval: 1000 * 60 * 60 * 24 * 30,
//     labels: { format: '{value:%b %Y}' },
//   },
// };

// Timeline Data
const timelineData = [
  { id: 1, content: 'Budget cycle: 2024/04/01-2024/06/30. Total budget: $12,375,000', start: '2024-04-01', end: '2024-06-30', group: 1 },
  { id: 2, content: 'Budget cycle: 2024/07/01-2024/09/30. Total budget: $9,900,000', start: '2024-07-01', end: '2024-09-30', group: 1 }
];
const timelineGroups = [
  { id: 1, content: 'Financial Year' }
];

const timelineOptions = {
  editable: false,
  margin: { item: 20 },
  orientation: { axis: 'top' },
};


// React Component
const QuickInsightDashboard: React.FC = () => {
  const totalBudget = 9900000;
  const expectedCosts = 12184615;
  const observedCosts = 9868323;

  const expectedPercentage = (expectedCosts / totalBudget) * 100;
  const observedPercentage = (observedCosts / totalBudget) * 100;

  // Reference for timeline DOM element
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [timelineInitialized, setTimelineInitialized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isCostVisible, setIsCostVisible] = useState(true);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const totalCostDropdown = () => {
    setIsCostVisible(!isCostVisible);
  };

  useEffect(() => {
    if (timelineRef.current && !timelineInitialized) {
      new Timeline(timelineRef.current, timelineData, timelineGroups, timelineOptions);
      setTimelineInitialized(true);
    }
  }, [timelineInitialized]);

  return (
    <div className="dashboard-container">

      {/* Metric Cards */}
      <div className="metrics-section">
        {/* The cards */}
        <div className="metric-card">
          <i className="fas fa-piggy-bank" ></i>
          <p>Total budget available for entire cycle</p>
          <h1 >$9,900,000</h1>
          <p>Applicable to budgeting period</p>
        </div>
        <div className="metric-card">
          <i className="fa-sharp fa-solid fa-receipt" ></i>
          <p>Total costs this cycle (staff & infrastructure)</p>
          <h1 >$9,695,226</h1>
          <p>Also includes build, maintenance & runtime costs</p>
        </div>
        <div className="metric-card">
          <i className="fas fa-sack-dollar" ></i>
          <p>Total revenue produced this cycle</p>
          <h1 >$2,807,434</h1>
          <p>ROI derived from use of GenAI applications</p>
        </div>
        <div className="metric-card">
          <i className="fas fa-scale-unbalanced" ></i>
          <p>Current balance this cycle</p>
          <h1 >$3,012,207</h1>
          <p>(Budget - Costs) + Revenue</p>
        </div>
      </div>


      {/* New Section: GenAI Project Timeline */}
      {/* <div className="timeline-section">
        <h1 style={{ marginBottom: '20px', marginTop: '20px' ,fontSize:'x-large',fontWeight:'800'}}>GenAI Project Timeline</h1>
        <hr style={{ border: '2px solid rgb(25, 118, 210)', borderRadius: '4px', marginBottom: '20px' }} />
        <div ref={timelineRef} className="vis-timeline-container"></div>
      </div> */}

      <div className="timeline-section">
        <h1 style={{ marginBottom: '20px', marginTop: '20px', fontSize: 'x-large', fontWeight: '800' }}>
          GenAI Project Timeline
        </h1>

        {/* Horizontal line */}
        <hr style={{ border: '2px solid rgb(25, 118, 210)', borderRadius: '4px', marginBottom: '20px' }} />

        {/* Dropdown Checkbox Icon */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'flex-end' }}>
          <i
            className={`fas fa-wrench ${dropdownVisible ? 'fas fa-wrench' : 'fas fa-wrench'}`}
            style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '973px', color: 'rgb(25, 118, 210)' }}
            onClick={toggleDropdown}
          ></i>
          
          <span style={{justifyContent: 'space-between'}}></span>
          <i className='fas fa-plus'
            // className={`fas ${dropdownVisible ? 'fa-minus' : 'fa-plus'}`}
            style={{ cursor: 'pointer', fontSize: '18px', color: 'rgb(25, 118, 210)' }}
          ></i>

          {/* Dropdown box */}
          {dropdownVisible && (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '25px',
                  right: '0',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  padding: '10px',
                  zIndex: 1000,
                  minWidth: '150px',
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Milestone type:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label>
                    <input type="checkbox" name="financial" defaultChecked />
                    Financial
                  </label>
                  <label>
                    <input type="checkbox" name="technical" />
                    Technical
                  </label>
                  <label>
                    <input type="checkbox" name="other" />
                    Other
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

      
        {/* Timeline Container */}
          <div ref={timelineRef} className="vis-timeline-container"></div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-column">
          {/* Progress Bar with Title */}
          <div className="progress-bar-panel">
            <h1 style={{ marginBottom: '16px', marginTop: '10px', fontSize: '16px', fontWeight: '800' }}>Budget burn rate: Total costs</h1>
            <hr style={{ border: '2px solid rgb(25, 118, 210)', borderRadius: '4px', marginBottom: '40px' }} />

            {/* Expected Costs */}
            <div className="progress-group">
              <span className="progress-text">Expected costs &nbsp;</span>
              <span className="progress-number pull-right">
                <b>{expectedCosts.toLocaleString()}</b> / <span>{totalBudget.toLocaleString()}</span>
              </span>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  style={{ width: `${expectedPercentage > 100 ? 100.077 : expectedPercentage}%`, minWidth: '100.077%' }}
                >
                  {expectedPercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Observed Costs */}
            <div className="progress-group">
              <span className="progress-text">Observed costs &nbsp;</span>
              <span className="progress-number pull-right">
                <b>{observedCosts.toLocaleString()}</b> / <span>{totalBudget.toLocaleString()}</span>
              </span>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-warning"
                  role="progressbar"
                  style={{ width: `${observedPercentage > 100 ? 100.077 : observedPercentage}%`, minWidth: '100.077%', paddingRight: '105px' }}
                >
                  {observedPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="chart-card">
            <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
          </div>
        </div>

        {/* Treemap in a different column but same row */}
        <div className="charts-column">
          <div className="chart-card">
            <HighchartsReact highcharts={Highcharts} options={treemapOptions} />
          </div>
        </div>
      </div>


    </div>
  );
};

export default QuickInsightDashboard;
