// src/components/insights/ClaudeInsights.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card, Spin, Typography, Button, Input, Tag, Empty } from 'antd';

const { Title, Paragraph, Text } = Typography;

/**
 * ClaudeInsights component provides AI-powered analysis and insights on health data
 * 
 * @param {Object} props
 * @param {Array} props.data - The dataset being visualized
 * @param {string} props.datasetName - Name/description of the dataset
 * @param {string} props.visualization - Type of visualization being shown
 * @param {Object} props.filters - Any filters applied to the data
 * @param {function} props.onInsightSelected - Callback when user selects an insight
 */
const ClaudeInsights = ({ 
  data, 
  datasetName = "health data", 
  visualization = "visualization", 
  filters = {}, 
  onInsightSelected 
}) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);
  
  // Generate prompt for Claude based on data context
  const generatePrompt = useCallback(() => {
    // Create a summary of the data for context
    const dataSize = data?.length || 0;
    const filterDescription = Object.entries(filters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    const dataContext = `
      I'm analyzing a dataset with ${dataSize} records of ${datasetName}.
      ${filterDescription ? `The data is filtered by: ${filterDescription}.` : ''}
      ${visualization ? `I'm looking at a ${visualization} visualization of this data.` : ''}
    `;
    
    // For large datasets, include only a sample
    const sampleData = data?.slice(0, 5) || [];
    
    return {
      prompt: `${dataContext}
      
      Here's a sample of the data:
      ${JSON.stringify(sampleData, null, 2)}
      
      Please provide 3-5 insightful observations about this health data. Focus on trends, patterns, outliers, and potential correlations. When possible, suggest health implications or actionable insights.`,
      query: query || null
    };
  }, [data, datasetName, visualization, filters, query]);
  
  // Function to fetch insights from Claude API
  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would be replaced with your actual API implementation
      // using the Anthropic API endpoint
      const promptData = generatePrompt();
      
      // Since we don't have an actual Claude API integration yet,
      // we'll simulate it with mock insights for demo purposes
      
      // In a real implementation, you would call your API:
      /*
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 1000,
          prompt: promptData.prompt,
          query: promptData.query
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      const insightText = result.completion || '';
      */
      
      // For demo purposes, generate mock insights based on the data type
      const mockInsights = generateMockInsights(datasetName, promptData.query);
      
      // Process mocked insights
      const insightsList = mockInsights.map((text, index) => ({
        id: `insight-${index}`,
        text: text,
        type: detectInsightType(text),
        timestamp: new Date().toISOString(),
      }));
      
      setInsights(insightsList);
    } catch (err) {
      console.error('Error fetching insights from Claude:', err);
      setError('Failed to get AI insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [generatePrompt, datasetName]);
  
  // Generate mock insights based on dataset type
  const generateMockInsights = (datasetName, userQuery = null) => {
    if (userQuery) {
      // If user provided a specific query, respond to that
      return [
        `Based on the ${datasetName}, your query about "${userQuery}" reveals a significant correlation between socioeconomic status and access to preventive care. Lower-income demographics show 35% less access to regular check-ups.`,
        `The data indicates regional disparities in healthcare outcomes related to your query. Rural areas show consistently higher rates of chronic conditions compared to urban centers with similar demographic profiles.`,
        `Looking at temporal trends relevant to your question, there has been a gradual improvement in health outcomes over the past 5 years, particularly in areas with increased telehealth adoption.`
      ];
    }
    
    // Otherwise provide general insights based on the dataset type
    if (datasetName.includes('chronic')) {
      return [
        `There's a strong correlation between lifestyle factors and chronic disease prevalence. Areas with higher physical activity rates show up to 28% lower diabetes incidence.`,
        `Socioeconomic disparities are evident in chronic disease outcomes. Lower-income communities show significantly higher rates of hypertension and heart disease compared to affluent areas.`,
        `Geographic analysis reveals "hot spots" of chronic disease concentration in specific regions, suggesting environmental or community-level factors may be influencing health outcomes.`,
        `Preventive care access appears to be a strong predictor of disease management effectiveness. Regions with better healthcare infrastructure show better outcomes for the same demographic profiles.`
      ];
    } else if (datasetName.includes('mental')) {
      return [
        `Anxiety and depression prevalence show strong seasonal patterns, with higher rates reported during winter months and significant drops during spring.`,
        `There's a notable urban-rural divide in mental health resource utilization. Urban populations report 45% higher rates of seeking professional mental health services despite similar prevalence rates.`,
        `Age demographics reveal concerning trends in youth mental health. The 18-24 age group shows the most rapid increase in reported mental health conditions over the past 5 years.`,
        `The data suggests a positive correlation between community support programs and improved mental health outcomes, particularly in communities with robust social service networks.`
      ];
    } else if (datasetName.includes('lgbtq')) {
      return [
        `Mental health disparities between LGBTQ+ and non-LGBTQ+ populations remain significant, with LGBTQ+ individuals reporting approximately 2.5x higher rates of anxiety and depression.`,
        `Healthcare access metrics show improvement over time, but transgender individuals still face the largest barriers to care, with 31% reporting discrimination in healthcare settings.`,
        `Regional analysis reveals that LGBTQ+ health outcomes are strongly correlated with state-level policies and protections. States with comprehensive non-discrimination laws show significantly better health metrics.`,
        `The data indicates that supportive community resources act as protective factors, with LGBTQ+ individuals in areas with dedicated healthcare services reporting 40% better health outcomes.`
      ];
    } else {
      return [
        `The data reveals significant demographic variations in health outcomes, with social determinants of health accounting for approximately 60% of the observed disparities.`,
        `Time-series analysis indicates gradual improvement in overall population health metrics, though disparities between demographic groups have remained relatively stable.`,
        `Geographic clustering of health outcomes suggests localized environmental or community factors may be influencing population health in specific regions.`,
        `Prevention initiatives correlate strongly with improved health outcomes, particularly in communities where such programs have been consistently funded and implemented.`
      ];
    }
  };
  
  // Detect the type of insight (pattern, trend, outlier, etc.)
  const detectInsightType = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('increas') || lowerText.includes('decreas') || lowerText.includes('trend')) {
      return 'trend';
    } else if (lowerText.includes('correlat') || lowerText.includes('relat') || lowerText.includes('associat')) {
      return 'correlation';
    } else if (lowerText.includes('outlier') || lowerText.includes('anomal') || lowerText.includes('unusual')) {
      return 'outlier';
    } else if (lowerText.includes('recommend') || lowerText.includes('suggest') || lowerText.includes('action')) {
      return 'recommendation';
    }
    
    return 'observation';
  };
  
  // Fetch insights when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      fetchInsights();
    }
  }, [data, fetchInsights]);
  
  // Handle user query submission
  const handleQuerySubmit = (e) => {
    e.preventDefault();
    fetchInsights();
    setShowAskForm(false);
  };
  
  // Handle when user clicks on an insight
  const handleInsightClick = (insight) => {
    if (onInsightSelected) {
      onInsightSelected(insight);
    }
  };
  
  // Get icon for insight type
  const getInsightIcon = (type) => {
    switch (type) {
      case 'trend':
        return '📈';
      case 'correlation':
        return '🔄';
      case 'outlier':
        return '⚠️';
      case 'recommendation':
        return '💡';
      default:
        return '🔍';
    }
  };
  
  return (
    <Card 
      className="claude-insights-container"
      title={
        <div className="claude-insights-header">
          <span>AI Insights by Claude</span>
          <Button 
            type="primary"
            onClick={() => setShowAskForm(!showAskForm)}
            className="ask-claude-button"
          >
            {showAskForm ? 'Cancel' : 'Ask Claude'}
          </Button>
        </div>
      }
      bordered={false}
    >
      {showAskForm && (
        <div className="claude-query-form">
          <Input.Search
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about this data..."
            enterButton="Ask"
            onSearch={handleQuerySubmit}
            className="claude-query-input"
          />
        </div>
      )}
      
      <div className="claude-insights-content">
        {loading ? (
          <div className="claude-loading">
            <Spin size="large" />
            <Text>Claude is analyzing the data...</Text>
          </div>
        ) : error ? (
          <div className="claude-error">
            <Text type="danger">{error}</Text>
            <Button onClick={fetchInsights} type="primary" style={{ marginTop: 16 }}>
              Try Again
            </Button>
          </div>
        ) : insights.length > 0 ? (
          <div className="claude-insights-list">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`claude-insight-item insight-type-${insight.type}`}
                onClick={() => handleInsightClick(insight)}
              >
                <div className="insight-icon">{getInsightIcon(insight.type)}</div>
                <div className="insight-content">
                  <Paragraph>{insight.text}</Paragraph>
                  <Tag color={getTagColor(insight.type)}>
                    {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                  </Tag>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="No insights available yet" />
        )}
      </div>
      
      <div className="claude-insights-footer">
        <Text type="secondary" className="claude-powered-by">
          Powered by Anthropic's Claude AI
        </Text>
      </div>
    </Card>
  );
};

// Helper function to get color for tags
const getTagColor = (type) => {
  switch (type) {
    case 'trend':
      return 'green';
    case 'correlation':
      return 'blue';
    case 'outlier':
      return 'orange';
    case 'recommendation':
      return 'gold';
    default:
      return 'default';
  }
};

ClaudeInsights.propTypes = {
  data: PropTypes.array.isRequired,
  datasetName: PropTypes.string,
  visualization: PropTypes.string,
  filters: PropTypes.object,
  onInsightSelected: PropTypes.func
};

export default ClaudeInsights;