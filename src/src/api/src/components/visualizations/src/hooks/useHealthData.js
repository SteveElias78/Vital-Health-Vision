// src/components/dashboard/HealthDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Select, Tabs, Button, Spin, Alert } from 'antd';
import RadialHealthViz from '../visualizations/RadialHealthViz';
import useHealthData from '../../hooks/useHealthData';

const { Option } = Select;
const { TabPane } = Tabs;

/**
 * Main dashboard component that displays health data visualizations
 * and provides controls for data filtering and exploration
 */
const HealthDashboard = () => {
  // Dashboard state
  const [activeCategory, setActiveCategory] = useState('chronic-disease');
  const [activeDemographic, setActiveDemographic] = useState('Overall');
  const [activeLocation, setActiveLocation] = useState('United States');
  const [activeYear, setActiveYear] = useState(2023);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch health data using our custom hook
  const chronicDisease = useHealthData('chronic-disease', {
    filters: {
      demographic: activeDemographic,
      location: activeLocation,
      year: activeYear
    },
    sortBy: 'value',
    limit: 10
  });
  
  const mentalHealth = useHealthData('mental-health', {
    filters: {
      demographic: activeDemographic,
      location: activeLocation,
      year: activeYear
    },
    sortBy: 'value',
    limit: 8
  });
  
  const lgbtqHealth = useHealthData('lgbtq-health', {
    filters: {
      year: activeYear
    },
    sortBy: 'disparity',
    limit: 8
  });
  
  // Helper function to transform raw data for visualizations
  const transformForViz = (data, valueField = 'value', labelField = 'category') => {
    return data.map(item => ({
      label: item[labelField] || 'Unknown',
      value: parseFloat(item[valueField]) || 0,
      demographic: item.demographic || 'Overall',
      location: item.location || activeLocation,
      year: item.year || activeYear
    }));
  };
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  // Handle demographic filter change
  const handleDemographicChange = (demographic) => {
    setActiveDemographic(demographic);
  };
  
  // Handle location filter change
  const handleLocationChange = (location) => {
    setActiveLocation(location);
  };
  
  // Handle year filter change
  const handleYearChange = (year) => {
    setActiveYear(parseInt(year));
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Generate visualization based on active category
  const renderVisualization = () => {
    switch (activeCategory) {
      case 'chronic-disease':
        if (chronicDisease.loading) {
          return <Spin size="large" />;
        }
        
        if (chronicDisease.error) {
          return <Alert type="error" message={chronicDisease.error} />;
        }
        
        return (
          <RadialHealthViz
            data={transformForViz(chronicDisease.data, 'value', 'category')}
            title="Chronic Disease Prevalence"
            subtitle={`${activeLocation}, ${activeYear}`}
            valueField="value"
            labelField="label"
            sourceInfo={chronicDisease.sourceInfo}
            onSegmentClick={(segment) => console.log('Segment clicked:', segment)}
          />
        );
        
      case 'mental-health':
        if (mentalHealth.loading) {
          return <Spin size="large" />;
        }
        
        if (mentalHealth.error) {
          return <Alert type="error" message={mentalHealth.error} />;
        }
        
        return (
          <RadialHealthViz
            data={transformForViz(mentalHealth.data, 'value', 'metric')}
            title="Mental Health Indicators"
            subtitle={`${activeLocation}, ${activeYear}`}
            valueField="value"
            labelField="label"
            colorRange={['#f1c40f', '#e67e22', '#d35400', '#c0392b', '#a37707']}
            sourceInfo={mentalHealth.sourceInfo}
            onSegmentClick={(segment) => console.log('Segment clicked:', segment)}
          />
        );
        
      case 'lgbtq-health':
        if (lgbtqHealth.loading) {
          return <Spin size="large" />;
        }
        
        if (lgbtqHealth.error) {
          return <Alert type="error" message={lgbtqHealth.error} />;
        }
        
        return (
          <RadialHealthViz
            data={transformForViz(lgbtqHealth.data, 'value', 'category')}
            title="LGBTQ+ Health Disparities"
            subtitle={`By Demographic Group, ${activeYear}`}
            valueField="value"
            labelField="label"
            colorRange={['#f1c40f', '#9b59b6', '#3498db', '#1abc9c', '#16a085']}
            sourceInfo={lgbtqHealth.sourceInfo}
            onSegmentClick={(segment) => console.log('Segment clicked:', segment)}
          />
        );
        
      default:
        return <Alert type="warning" message="Select a health category to view visualization" />;
    }
  };
  
  // Render dashboard controls
  const renderControls = () => {
    return (
      <Card className="dashboard-controls">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <label>Health Category</label>
            <Select
              value={activeCategory}
              onChange={handleCategoryChange}
              style={{ width: '100%' }}
            >
              <Option value="chronic-disease">Chronic Disease</Option>
              <Option value="mental-health">Mental Health</Option>
              <Option value="lgbtq-health">LGBTQ+ Health</Option>
            </Select>
          </Col>
          
          <Col span={6}>
            <label>Demographic</label>
            <Select
              value={activeDemographic}
              onChange={handleDemographicChange}
              style={{ width: '100%' }}
              disabled={activeCategory === 'lgbtq-health'}
            >
              <Option value="Overall">Overall</Option>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="18-24">18-24 Years</Option>
              <Option value="25-44">25-44 Years</Option>
              <Option value="45-64">45-64 Years</Option>
              <Option value="65+">65+ Years</Option>
            </Select>
          </Col>
          
          <Col span={6}>
            <label>Location</label>
            <Select
              value={activeLocation}
              onChange={handleLocationChange}
              style={{ width: '100%' }}
              disabled={activeCategory === 'lgbtq-health'}
            >
              <Option value="United States">United States</Option>
              <Option value="California">California</Option>
              <Option value="Texas">Texas</Option>
              <Option value="New York">New York</Option>
              <Option value="Florida">Florida</Option>
              <Option value="Hawaii">Hawaii</Option>
            </Select>
          </Col>
          
          <Col span={6}>
            <label>Year</label>
            <Select
              value={activeYear}
              onChange={handleYearChange}
              style={{ width: '100%' }}
            >
              <Option value={2023}>2023</Option>
              <Option value={2022}>2022</Option>
              <Option value={2021}>2021</Option>
              <Option value={2020}>2020</Option>
              <Option value={2019}>2019</Option>
            </Select>
          </Col>
        </Row>
      </Card>
    );
  };
  
  return (
    <div className="health-dashboard">
      <h1 className="dashboard-title">Vital Health Vision Dashboard</h1>
      
      {renderControls()}
      
      <Tabs activeKey={activeTab} onChange={handleTabChange} className="dashboard-tabs">
        <TabPane tab="Overview" key="overview">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card className="visualization-card">
                {renderVisualization()}
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="Comparisons" key="comparisons">
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Card title="By Demographics" className="comparison-card">
                <Spin tip="Coming soon..." />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="By Geography" className="comparison-card">
                <Spin tip="Coming soon..." />
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="Trends" key="trends">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card title="Historical Trends" className="trends-card">
                <Spin tip="Coming soon..." />
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="Predictions" key="predictions">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card title="Predictive Models" className="predictions-card">
                <Spin tip="Coming soon..." />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HealthDashboard;