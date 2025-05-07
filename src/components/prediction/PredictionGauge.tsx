
import React from 'react';

interface PredictionGaugeProps {
  value: number;
  confidence: number;
  type: 'obesity' | 'diabetes' | 'hypertension';
}

export const PredictionGauge: React.FC<PredictionGaugeProps> = ({ value, confidence, type }) => {
  // Constants for gauge visualization
  const radius = 100;
  const strokeWidth = 15;
  const centerX = radius + strokeWidth;
  const centerY = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  
  // Set min/max based on prediction type
  const min = type === 'obesity' ? 10 : type === 'diabetes' ? 0 : 0;
  const max = type === 'obesity' ? 60 : type === 'diabetes' ? 30 : 100;
  const range = max - min;
  
  // Calculate percentage and arc length
  const percentage = Math.max(0, Math.min(100, ((value - min) / range) * 100));
  const arcLength = (percentage / 100) * circumference;

  // Generate decorative tick marks at 5% intervals
  const tickMarks = [];
  for (let i = 0; i <= 20; i++) {
    const angle = (i * 270 / 20 - 225) * Math.PI / 180;
    const x1 = centerX + (radius - 5) * Math.cos(angle);
    const y1 = centerY + (radius - 5) * Math.sin(angle);
    const x2 = centerX + (radius + 5) * Math.cos(angle);
    const y2 = centerY + (radius + 5) * Math.sin(angle);
    
    // Make some ticks more prominent for Art Deco effect
    const tickWidth = i % 5 === 0 ? 2 : 1;
    const opacity = i % 5 === 0 ? 1 : 0.5;
    
    tickMarks.push(
      <line 
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#FFC700"
        strokeWidth={tickWidth}
        opacity={opacity}
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={2 * (radius + strokeWidth)} height={2 * (radius + strokeWidth)} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#33394F"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
        />
        
        {/* Foreground arc */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - arcLength}
          strokeLinecap="round"
        />
        
        {/* Define gradient for the foreground arc */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFC700" />
            <stop offset="100%" stopColor={percentage > 50 ? '#FF4500' : '#FFC700'} />
          </linearGradient>
        </defs>
        
        {/* Tick marks */}
        {tickMarks}
      </svg>
      
      {/* Center value display */}
      <div className="absolute flex flex-col items-center justify-center w-32 h-32">
        <span className="text-3xl font-light text-gold-400">{value}</span>
        <span className="text-sm text-gold-300">
          {type === 'obesity' ? '% Prevalence' : 
           type === 'diabetes' ? '% Risk' : 'Score'}
        </span>
      </div>
      
      {/* Confidence indicator */}
      <div className="mt-2 text-center">
        <div className="flex items-center justify-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${confidence > 0.8 ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span className="text-sm text-gold-300">
            {confidence > 0.8 ? 'High' : 'Medium'} Confidence ({Math.round(confidence * 100)}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default PredictionGauge;
