// src/App.js - Main application component integrating all our features
import './styles/main.css';
import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Row, Col, Card } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined,
  BulbOutlined,
  CloudOutlined,
  TeamOutlined,
  GlobalOutlined,
  SettingOutlined
} from '@ant-design/icons';

// Import our components
import HealthDashboard from './components/dashboard/HealthDashboard';
import RadialHealthViz from './components/visualizations/RadialHealthViz';
import ClaudeInsights from './components/insights/ClaudeInsights';
import useHealthData from './hooks/useHealthData';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

// Example mock data for demonstration
const MOCK_CHRONIC_DISEASE_DATA = [
  { category: 'Diabetes', value: 12.5, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Hypertension', value: 29.3, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Heart Disease', value: 7.2, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Asthma', value: 8.4, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Obesity', value: 41.9, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Cancer', value: 4.8, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Stroke', value: 2.5, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'COPD', value: 6.4, location: 'United States', demographic: 'Overall', year: 2023 }
];

const MOCK_SOURCE_INFO = {
  primary: 'CDC_SODA',
  fetchedAt: new Date().toISOString(),
  validation: {
    confidenceScore: 0.95,
    discrepancies: []
  }
};

/**
 * Main application component for Vital Health Vision
 */
const App = () => {
  // Application state
  const [activeNav, setActiveNav] = useState('dashboard');
  
  // Fetch mental health data using our hook
  const mentalHealthData = useHealthData('mental-health', {
    limit: 8,
    sortBy: 'value'
  });
  
  // Handle navigation menu clicks
  const handleNavClick = (e) => {
    setActiveNav(e.key);
  };
  
  // Render content based on active navigation
  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <HealthDashboard />;
      
      case 'visualize':
        return (
          <div className="visualize-screen">
            <Title level={2}>Health Data Visualizations</Title>
            <Row gutter={[24, 24]}>
              <Col span={16}>
                <Card title="Chronic Disease Prevalence" className="viz-card">
                  <RadialHealthViz 
                    data={MOCK_CHRONIC_DISEASE_DATA}
                    valueField="value"
                    labelField="category"
                    title="Chronic Disease Prevalence"
                    subtitle="United States, 2023"
                    sourceInfo={MOCK_SOURCE_INFO}
                    height={500}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="AI Analysis" className="insights-card">
                  <ClaudeInsights 
                    data={MOCK_CHRONIC_DISEASE_DATA}
                    datasetName="chronic disease prevalence data"
                    visualization="radial chart"
                    filters={{ location: 'United States', year: 2023 }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        );
      
      case 'predictions':
        return (
          <div className="predictions-screen">
            <Title level={2}>Predictive Models</Title>
            <Text>Coming soon: Health outcome predictions using machine learning.</Text>
          </div>
        );
      
      case 'settings':
        return (
          <div className="settings-screen">
            <Title level={2}>Application Settings</Title>
            <Card title="Data Sources">
              <Text>Configure which data sources to use for each health category.</Text>
            </Card>
            <Card title="API Configuration" style={{ marginTop: 16 }}>
              <Text>Configure connection to Claude API and other data services.</Text>
            </Card>
          </div>
        );
      
      default:
        return <HealthDashboard />;
    }
  };
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header" style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        <div className="logo" style={{ marginRight: 20 }}>
          <img 
            src="/logo.png" 
            alt="Vital Health Vision" 
            style={{ height: 40, width: 'auto' }} 
          />
        </div>
        <Title level={3} style={{ color: '#f9ca24', margin: 0, flex: 1 }}>
          Vital Health Vision
        </Title>
        <div>
          <Button type="text" style={{ color: '#f9ca24' }}>Help</Button>
          <Button type="text" style={{ color: '#f9ca24' }}>About</Button>
        </div>
      </Header>
      
      <Layout>
        <Sider width={200} theme="dark" style={{ background: '#0a0f1c', borderRight: '1px solid rgba(249, 202, 36, 0.3)' }}>
          <Menu
            mode="inline"
            selectedKeys={[activeNav]}
            onClick={handleNavClick}
            style={{ height: '100%', borderRight: 0, background: 'transparent' }}
            theme="dark"
          >
            <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="visualize" icon={<PieChartOutlined />}>
              Visualizations
            </Menu.Item>
            <Menu.Item key="trends" icon={<LineChartOutlined />}>
              Trends Analysis
            </Menu.Item>
            <Menu.Item key="predictions" icon={<BulbOutlined />}>
              Predictions
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="demographics" icon={<TeamOutlined />}>
              Demographics
            </Menu.Item>
            <Menu.Item key="geography" icon={<GlobalOutlined />}>
              Geographic
            </Menu.Item>
            <Menu.Item key="sources" icon={<CloudOutlined />}>
              Data Sources
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        
        <Layout style={{ padding: '0 24px 24px', background: '#131a2c' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#131a2c',
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;