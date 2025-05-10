
/**
 * ClaudeService - A simplified service for AI-powered health insights
 * This service provides preset health insights and analysis capabilities
 * for the demo version of the application
 */

import { HealthDataCategory } from '@/data/demo/DemoDataService';

export type InsightType = 'summary' | 'trends' | 'recommendations' | 'correlations';

export interface HealthInsight {
  id: string;
  title: string;
  content: string;
  category: HealthDataCategory;
  insightType: InsightType;
  confidenceScore: number; // 0 to 1
  sources?: string[];
  timestamp: string;
}

export class ClaudeService {
  /**
   * Generate an insight for the specified health data category and type
   */
  async generateInsight(category: HealthDataCategory, type: InsightType): Promise<HealthInsight> {
    // In a real implementation, this would call Claude API
    // For the demo, we return preset insights
    
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const presetInsight = this.getPresetInsight(category, type);
    return presetInsight;
  }
  
  /**
   * Generate multiple insights for a dashboard view
   */
  async generateDashboardInsights(category: HealthDataCategory): Promise<HealthInsight[]> {
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return [
      this.getPresetInsight(category, 'summary'),
      this.getPresetInsight(category, 'trends'),
      this.getPresetInsight(category, 'recommendations')
    ];
  }
  
  /**
   * Process a user query about health data
   */
  async processQuery(query: string, context: { category: HealthDataCategory }): Promise<string> {
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple pattern matching for demo queries
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('trend') || lowerQuery.includes('change') || lowerQuery.includes('over time')) {
      return this.getPresetInsight(context.category, 'trends').content;
    }
    
    if (lowerQuery.includes('recommend') || lowerQuery.includes('should') || lowerQuery.includes('advise')) {
      return this.getPresetInsight(context.category, 'recommendations').content;
    }
    
    if (lowerQuery.includes('correlate') || lowerQuery.includes('factor') || lowerQuery.includes('cause')) {
      return this.getPresetInsight(context.category, 'correlations').content;
    }
    
    // Default to summary
    return this.getPresetInsight(context.category, 'summary').content;
  }
  
  /**
   * Get preset insights for the demo
   */
  private getPresetInsight(category: HealthDataCategory, type: InsightType): HealthInsight {
    const timestamp = new Date().toISOString();
    const id = `insight-${category}-${type}-${Date.now()}`;
    
    // Preset insights based on category and type
    const presets: Record<HealthDataCategory, Record<InsightType, Omit<HealthInsight, 'id' | 'timestamp'>>> = {
      'obesity': {
        'summary': {
          title: 'Obesity Prevalence Overview',
          content: 'Analysis of the data indicates that obesity rates vary significantly by geographic region and demographic factors. The national average stands at 34.9%, with higher rates observed in the Southern states (38.1%) compared to Western states (30.5%). There\'s also a notable correlation between obesity rates and socioeconomic indicators.',
          category: 'obesity',
          insightType: 'summary',
          confidenceScore: 0.92,
          sources: ['CDC BRFSS 2024', 'NHANES 2022-2024']
        },
        'trends': {
          title: 'Obesity Rate Trends 2022-2025',
          content: 'Obesity rates have shown a concerning upward trend over the past three years, with an average annual increase of 0.6 percentage points nationwide. However, this trend is not uniform across all demographics. Adults aged 45-64 show the steepest increase (0.9pp annually), while the 18-24 age group has seen relative stability (+0.2pp annually). Urban areas are showing early signs of rate stabilization, potentially due to recent public health initiatives.',
          category: 'obesity',
          insightType: 'trends',
          confidenceScore: 0.87,
          sources: ['NHANES Longitudinal Data 2022-2025', 'CDC State Health Statistics']
        },
        'recommendations': {
          title: 'Policy Recommendations for Obesity Reduction',
          content: 'Based on the analyzed data, the most effective interventions would be: 1) Targeted programs for the 45-64 age demographic showing the fastest rate increase; 2) Expansion of successful urban health initiatives to suburban and rural areas; 3) Focus on accessibility to nutritious foods in regions with highest obesity rates; 4) Implement educational programs modeled after states showing obesity rate decreases. Early intervention programs in childhood would provide the highest long-term return on investment according to predictive modeling.',
          category: 'obesity',
          insightType: 'recommendations',
          confidenceScore: 0.82,
          sources: ['Public Health Intervention Outcomes Database', 'Systematic Reviews on Obesity Interventions']
        },
        'correlations': {
          title: 'Factors Correlating with Obesity Rates',
          content: 'Statistical analysis reveals several strong correlations with obesity rates: 1) Inverse correlation with education level (r=-0.72); 2) Inverse correlation with household income (r=-0.68); 3) Strong negative correlation with regular physical activity levels (r=-0.76); 4) Positive correlation with fast food restaurant density (r=0.65); 5) Negative correlation with healthcare access (r=-0.58). These correlations suggest multiple socioeconomic factors play significant roles in obesity prevalence.',
          category: 'obesity',
          insightType: 'correlations',
          confidenceScore: 0.89,
          sources: ['Socioeconomic Health Determinants Study 2024', 'CDC Behavioral Risk Factor Surveillance']
        }
      },
      'mental-health': {
        'summary': {
          title: 'Mental Health Status Overview',
          content: 'Current mental health data shows concerning trends across the population. Depression prevalence stands at 18.5% nationally, with anxiety disorders at 21.4%. These rates vary significantly based on geographic location, age, and socioeconomic factors. Urban centers show higher anxiety rates (23.8%) compared to rural areas (19.2%), while depression follows a different pattern with more uniformity across geographic regions.',
          category: 'mental-health',
          insightType: 'summary',
          confidenceScore: 0.88,
          sources: ['BRFSS Mental Health Module', 'National Health Interview Survey 2024']
        },
        'trends': {
          title: 'Mental Health Trends 2022-2025',
          content: 'Analysis shows a 12% increase in reported anxiety disorders over the past three years, with the sharpest rise among young adults (18-25). Depression diagnoses have increased at a slower rate (7% overall), but with a concerning 15% increase in the 45-64 age group. Access to mental health services has improved by approximately 5% nationally, though substantial regional disparities persist with rural areas showing minimal improvement in accessibility metrics.',
          category: 'mental-health',
          insightType: 'trends',
          confidenceScore: 0.85,
          sources: ['Longitudinal Mental Health Survey', 'Healthcare Access Database 2022-2025']
        },
        'recommendations': {
          title: 'Mental Health Service Improvement Recommendations',
          content: 'Based on the data analysis, priority initiatives should include: 1) Expanding telehealth mental health services to underserved rural areas showing access gaps; 2) Targeted interventions for the 45-64 demographic experiencing rapid increases in depression rates; 3) School and university-based early intervention programs to address rising anxiety in young adults; 4) Integration of mental health screening in primary care settings to improve early detection rates; 5) Community-based support programs in high-prevalence regions to supplement clinical services.',
          category: 'mental-health',
          insightType: 'recommendations',
          confidenceScore: 0.82,
          sources: ['Mental Health Intervention Effectiveness Studies', 'Healthcare Resource Allocation Models']
        },
        'correlations': {
          title: 'Factors Correlating with Mental Health Conditions',
          content: 'Statistical analysis identifies several significant correlations: 1) Strong connection between economic uncertainty and anxiety disorders (r=0.68); 2) Inverse correlation between community social support metrics and depression rates (r=-0.59); 3) Correlation between healthcare access limitations and untreated mental health conditions (r=0.72); 4) Moderate correlation between chronic physical health conditions and depression (r=0.51); 5) Strong correlation between workplace stress measures and anxiety disorders (r=0.64).',
          category: 'mental-health',
          insightType: 'correlations',
          confidenceScore: 0.86,
          sources: ['Socioeconomic Determinants of Mental Health Study', 'Workplace Health Survey 2024']
        }
      },
      'lgbtq-health': {
        'summary': {
          title: 'LGBTQ+ Health Overview',
          content: 'Analysis of LGBTQ+ health data reveals persistent disparities compared to the general population. Healthcare access scores average 76.3 nationally (versus 82.5 for the general population), with significant regional variations ranging from 58.4 to 89.2. Mental health conditions show elevated prevalence with depression rates 1.5x and anxiety 1.7x higher than general population baselines. Preventive care utilization shows improvement but remains 12% below general population rates.',
          category: 'lgbtq-health',
          insightType: 'summary',
          confidenceScore: 0.84,
          sources: ['LGBTQ+ Health Needs Assessment 2024', 'Healthcare Equality Index']
        },
        'trends': {
          title: 'LGBTQ+ Health Trends 2022-2025',
          content: 'The data shows gradual improvement in several key metrics over the past three years. Healthcare access scores have improved by 7.2 points nationally, with the most significant gains in urban centers with dedicated LGBTQ+ health services. Mental health support access has improved 13.5%, though rural areas show minimal change. Preventive care utilization has increased steadily at approximately 4.2% annually, approaching parity with general population rates in some regions. Provider training metrics show the most substantial improvement at 18.3% over three years.',
          category: 'lgbtq-health',
          insightType: 'trends',
          confidenceScore: 0.81,
          sources: ['Longitudinal LGBTQ+ Health Tracking Study', 'Healthcare Provider Training Database']
        },
        'recommendations': {
          title: 'LGBTQ+ Health Equity Recommendations',
          content: 'Based on the data analysis, the following initiatives would address the most critical needs: 1) Expansion of cultural competency training for healthcare providers, particularly in regions scoring below 65 on provider training metrics; 2) Development of telehealth services specifically addressing LGBTQ+ mental health needs in rural areas; 3) Community outreach programs to increase preventive care utilization in regions with rates below 60%; 4) Policy advocacy focused on the 12 states with lowest non-discrimination protection scores; 5) Integration of LGBTQ+ specific health modules in medical education curricula to address knowledge gaps identified in provider surveys.',
          category: 'lgbtq-health',
          insightType: 'recommendations',
          confidenceScore: 0.79,
          sources: ['Healthcare Equality Intervention Studies', 'LGBTQ+ Health Policy Research']
        },
        'correlations': {
          title: 'Factors Correlating with LGBTQ+ Health Outcomes',
          content: 'Analysis reveals several key correlations with positive health outcomes: 1) Strong correlation with provider training in LGBTQ+ healthcare needs (r=0.72); 2) Significant correlation with community support resources (r=0.63); 3) Correlation with comprehensive non-discrimination policies in healthcare settings (r=0.59); 4) Correlation with inclusive insurance coverage policies (r=0.56); 5) Strong correlation with accessible mental health services with LGBTQ+ competency (r=0.71). These factors explain approximately 68% of the variance in health outcome disparities.',
          category: 'lgbtq-health',
          insightType: 'correlations',
          confidenceScore: 0.83,
          sources: ['LGBTQ+ Health Determinants Study', 'Healthcare Policy Impact Analysis 2024']
        }
      },
      'chronic-disease': {
        'summary': {
          title: 'Chronic Disease Prevalence Overview',
          content: 'Analysis of chronic disease data shows that diabetes affects approximately 10.8% of the population, with heart disease at 8.6% and hypertension at 29.3%. Geographic distribution shows significant variation with diabetes rates ranging from 8.4% to 14.3% across regions. Age-stratified data reveals that 65+ population has the highest burden with 27.2% diabetes prevalence, 21.8% heart disease, and 63.5% hypertension rates.',
          category: 'chronic-disease',
          insightType: 'summary',
          confidenceScore: 0.93,
          sources: ['CDC Chronic Disease Surveillance System', 'National Health Interview Survey 2024']
        },
        'trends': {
          title: 'Chronic Disease Trends 2022-2025',
          content: 'Three-year trend analysis shows diabetes prevalence increasing at 0.3 percentage points annually, with the steepest rises in the 45-64 age group. Heart disease rates have remained relatively stable (+0.1pp annually) with slight decreases in some regions with enhanced prevention programs. Hypertension shows concerning growth at 0.5pp annually nationwide, with higher rates in the Southeast. Early-onset chronic conditions (under age 40) show the fastest growth rate, particularly for type 2 diabetes and hypertension.',
          category: 'chronic-disease',
          insightType: 'trends',
          confidenceScore: 0.89,
          sources: ['Longitudinal Disease Monitoring Program', 'Hospital Admission Data 2022-2025']
        },
        'recommendations': {
          title: 'Chronic Disease Prevention Recommendations',
          content: 'Data analysis supports these high-impact interventions: 1) Targeted screening programs for the 40-55 age group showing the fastest growth in early-stage hypertension; 2) Community-based lifestyle modification programs in the 15 counties with highest diabetes growth rates; 3) Workplace health initiatives focused on sedentary occupations with elevated chronic disease risk; 4) Expansion of the medication adherence support program showing 23% improvement in hypertension control rates; 5) Integration of digital health monitoring tools that demonstrated 18% improvement in diabetes management metrics in pilot programs.',
          category: 'chronic-disease',
          insightType: 'recommendations',
          confidenceScore: 0.85,
          sources: ['Chronic Disease Intervention Outcomes Database', 'Preventive Care Effectiveness Studies']
        },
        'correlations': {
          title: 'Factors Correlating with Chronic Disease Rates',
          content: 'Statistical analysis identified these significant correlations: 1) Strong correlation between physical inactivity and diabetes prevalence (r=0.71); 2) Correlation between dietary quality scores and heart disease rates (r=-0.64); 3) Association between preventive care utilization and controlled hypertension (r=0.68); 4) Strong correlation between obesity and diabetes (r=0.76); 5) Correlation between stress levels and hypertension (r=0.52); 6) Moderate correlation between sleep quality metrics and all studied chronic conditions (r ranging from 0.41 to 0.58).',
          category: 'chronic-disease',
          insightType: 'correlations',
          confidenceScore: 0.91,
          sources: ['Lifestyle and Disease Correlation Study 2024', 'Social Determinants of Health Database']
        }
      }
    };
    
    return {
      ...presets[category][type],
      id,
      timestamp
    };
  }
}

export const claudeService = new ClaudeService();
