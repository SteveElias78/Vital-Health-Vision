
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BarChart, Brain, Heart } from 'lucide-react';

interface CategoryProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export const CategorySelector: React.FC<CategoryProps> = ({ category, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <CategoryCard 
        title="Obesity Data"
        description="BMI distributions and trends"
        icon={<BarChart className="h-6 w-6" />}
        isActive={category === 'obesity'}
        onClick={() => onCategoryChange('obesity')}
      />
      
      <CategoryCard 
        title="Mental Health"
        description="Depression and anxiety metrics"
        icon={<Brain className="h-6 w-6" />}
        isActive={category === 'mental-health'}
        onClick={() => onCategoryChange('mental-health')}
      />
      
      <CategoryCard 
        title="LGBTQ+ Health"
        description="Health disparities and access"
        icon={<Heart className="h-6 w-6" />}
        isActive={category === 'lgbtq-health'}
        onClick={() => onCategoryChange('lgbtq-health')}
      />
    </div>
  );
};

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  isActive,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "transition-all cursor-pointer flex items-center p-4 w-full sm:w-auto sm:min-w-[200px]",
        isActive 
          ? "bg-blue-900/30 border-blue-500/50 text-blue-300" 
          : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700/50"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center mr-3",
        isActive ? "bg-blue-900/50 text-blue-300" : "bg-gray-700 text-gray-400"
      )}>
        {icon}
      </div>
      <div>
        <h3 className={cn(
          "font-medium",
          isActive ? "text-blue-300" : "text-gray-200"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-sm",
          isActive ? "text-blue-300/70" : "text-gray-400"
        )}>
          {description}
        </p>
      </div>
    </Card>
  );
};
