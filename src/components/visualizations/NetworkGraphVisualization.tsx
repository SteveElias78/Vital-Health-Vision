
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { faker } from '@faker-js/faker';

interface NetworkNode {
  id: string;
  name: string;
  value: number;
  category: string;
  color?: string;
}

interface NetworkLink {
  source: string;
  target: string;
  strength: number;
  label?: string;
}

interface NetworkGraphVisualizationProps {
  title: string;
  subtitle?: string;
  nodes: NetworkNode[];
  links: NetworkLink[];
  width?: number;
  height?: number;
}

export const NetworkGraphVisualization: React.FC<NetworkGraphVisualizationProps> = ({
  title,
  subtitle,
  nodes,
  links,
  width = 700,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<NetworkLink | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Node positions and simulation state
  const nodesRef = useRef<any[]>([]);
  const linksRef = useRef<any[]>([]);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initialize node positions
    nodesRef.current = nodes.map(node => ({
      ...node,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
      radius: Math.sqrt(node.value) * 5 + 10
    }));
    
    linksRef.current = links.map(link => {
      const sourceNode = nodesRef.current.find(n => n.id === link.source);
      const targetNode = nodesRef.current.find(n => n.id === link.target);
      return { ...link, sourceNode, targetNode };
    });
    
    // Simple force simulation
    let animationFrameId: number;
    
    const simulate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw links
      linksRef.current.forEach(link => {
        const sourceNode = link.sourceNode;
        const targetNode = link.targetNode;
        if (!sourceNode || !targetNode) return;
        
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        
        // Determine if link is hovered
        const isHovered = link === hoveredLink;
        
        ctx.strokeStyle = isHovered ? '#FFC700' : `rgba(228, 195, 137, ${link.strength * 0.7})`;
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.stroke();
      });
      
      // Draw nodes
      nodesRef.current.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        
        // Determine if node is hovered
        const isHovered = node === hoveredNode;
        
        const nodeColor = node.color || getColorForCategory(node.category);
        const fillColor = isHovered ? '#FFC700' : nodeColor;
        
        ctx.fillStyle = fillColor;
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(228, 195, 137, 0.6)';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();
        
        // Draw node name if hovered
        if (isHovered) {
          ctx.font = '12px sans-serif';
          ctx.fillStyle = '#FFC700';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, node.x, node.y - node.radius - 5);
        }
      });
      
      // Simple force simulation
      nodesRef.current.forEach(node => {
        // Apply repulsive forces between nodes
        nodesRef.current.forEach(otherNode => {
          if (node === otherNode) return;
          
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const force = 1000 / (distance * distance);
          
          node.vx += (dx / distance) * force * 0.01;
          node.vy += (dy / distance) * force * 0.01;
        });
        
        // Apply attractive forces for linked nodes
        linksRef.current.forEach(link => {
          if (link.source === node.id || link.target === node.id) {
            const otherNode = link.source === node.id ? link.targetNode : link.sourceNode;
            if (!otherNode) return;
            
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
            
            node.vx -= (dx / distance) * link.strength * 0.1;
            node.vy -= (dy / distance) * link.strength * 0.1;
          }
        });
        
        // Apply center gravity
        node.vx += (width / 2 - node.x) * 0.0005;
        node.vy += (height / 2 - node.y) * 0.0005;
        
        // Apply damping
        node.vx *= 0.97;
        node.vy *= 0.97;
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Boundary constraints
        if (node.x < node.radius) {
          node.x = node.radius;
          node.vx *= -0.5;
        }
        if (node.x > width - node.radius) {
          node.x = width - node.radius;
          node.vx *= -0.5;
        }
        if (node.y < node.radius) {
          node.y = node.radius;
          node.vy *= -0.5;
        }
        if (node.y > height - node.radius) {
          node.y = height - node.radius;
          node.vy *= -0.5;
        }
      });
      
      animationFrameId = requestAnimationFrame(simulate);
    };
    
    simulate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, links, width, height, hoveredNode, hoveredLink]);
  
  // Handle mouse interactions
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setMousePos({ x, y });
      
      // Check for node hover
      const hoveredNode = nodesRef.current.find(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= node.radius;
      }) || null;
      
      setHoveredNode(hoveredNode);
      
      // Check for link hover if no node is hovered
      if (!hoveredNode) {
        const hoveredLink = linksRef.current.find(link => {
          const sourceNode = link.sourceNode;
          const targetNode = link.targetNode;
          if (!sourceNode || !targetNode) return false;
          
          // Distance from point to line segment
          const a = { x: sourceNode.x, y: sourceNode.y };
          const b = { x: targetNode.x, y: targetNode.y };
          const p = { x, y };
          
          const distToSegment = distanceToLineSegment(a, b, p);
          return distToSegment < 5;
        }) || null;
        
        setHoveredLink(hoveredLink);
      } else {
        setHoveredLink(null);
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Helper function to calculate distance from point to line segment
  const distanceToLineSegment = (a: {x: number, y: number}, b: {x: number, y: number}, p: {x: number, y: number}) => {
    const A = p.x - a.x;
    const B = p.y - a.y;
    const C = b.x - a.x;
    const D = b.y - a.y;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
      xx = a.x;
      yy = a.y;
    } else if (param > 1) {
      xx = b.x;
      yy = b.y;
    } else {
      xx = a.x + param * C;
      yy = a.y + param * D;
    }
    
    const dx = p.x - xx;
    const dy = p.y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Helper to get color based on category
  const getColorForCategory = (category: string) => {
    switch (category) {
      case 'Health Condition':
        return '#FF9500';
      case 'Risk Factor':
        return '#FF3B30';
      case 'Demographic':
        return '#34C759';
      case 'Social Determinant':
        return '#5AC8FA';
      case 'Intervention':
        return '#AF52DE';
      default:
        return '#E4C389';
    }
  };
  
  return (
    <Card className="art-deco-border">
      <CardHeader>
        <CardTitle className="text-gold-400">{title}</CardTitle>
        {subtitle && <CardDescription className="text-gold-300/70">{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas 
            ref={canvasRef}
            width={width}
            height={height}
            className="border border-gold-500/30 rounded bg-midnight-900/50"
          />
          
          {/* Hover tooltip */}
          {(hoveredNode || hoveredLink) && (
            <div 
              className="absolute bg-midnight-950/90 border border-gold-500/50 p-2 rounded text-sm pointer-events-none z-10"
              style={{ 
                left: mousePos.x + 10, 
                top: mousePos.y + 10,
                maxWidth: '200px'
              }}
            >
              {hoveredNode && (
                <div>
                  <div className="font-medium text-gold-400">{hoveredNode.name}</div>
                  <div className="text-gold-300">{hoveredNode.category}</div>
                  <div className="text-gold-300/70">Value: {hoveredNode.value}</div>
                </div>
              )}
              
              {hoveredLink && (
                <div>
                  <div className="font-medium text-gold-400">Relationship</div>
                  <div className="text-gold-300">
                    {links.find(l => l.source === hoveredLink.source && l.target === hoveredLink.target)?.label || 'Associated with'}
                  </div>
                  <div className="text-gold-300/70">Strength: {(hoveredLink.strength * 100).toFixed(0)}%</div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-2">
            {['Health Condition', 'Risk Factor', 'Demographic', 'Social Determinant', 'Intervention'].map(category => (
              <div key={category} className="flex items-center text-xs">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: getColorForCategory(category) }}
                />
                <span className="text-gold-300">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data generator for demo purposes
export const generateNetworkData = () => {
  // Generate nodes
  const healthConditions = [
    'Obesity', 'Diabetes', 'Hypertension', 'Heart Disease', 'Depression', 
    'Anxiety', 'COPD', 'Asthma', 'Cancer'
  ];
  
  const riskFactors = [
    'Smoking', 'Physical Inactivity', 'Poor Diet', 'Alcohol Use', 
    'High BMI', 'Stress'
  ];
  
  const demographics = [
    'Age', 'Gender', 'Race/Ethnicity', 'Income', 'Education'
  ];
  
  const socialDeterminants = [
    'Food Access', 'Healthcare Access', 'Housing', 'Employment',
    'Social Support', 'Transportation'
  ];
  
  const interventions = [
    'Exercise Programs', 'Dietary Counseling', 'Medication', 
    'Therapy', 'Policy Changes', 'Education'
  ];
  
  const nodes: NetworkNode[] = [
    ...healthConditions.map(name => ({
      id: name.replace(/\s+/g, ''),
      name,
      value: faker.number.int({ min: 15, max: 40 }),
      category: 'Health Condition'
    })),
    ...riskFactors.map(name => ({
      id: name.replace(/\s+/g, ''),
      name,
      value: faker.number.int({ min: 10, max: 30 }),
      category: 'Risk Factor'
    })),
    ...demographics.map(name => ({
      id: name.replace(/\s+/g, ''),
      name,
      value: faker.number.int({ min: 8, max: 25 }),
      category: 'Demographic'
    })),
    ...socialDeterminants.map(name => ({
      id: name.replace(/\s+/g, ''),
      name,
      value: faker.number.int({ min: 12, max: 35 }),
      category: 'Social Determinant'
    })),
    ...interventions.map(name => ({
      id: name.replace(/\s+/g, ''),
      name,
      value: faker.number.int({ min: 10, max: 20 }),
      category: 'Intervention'
    }))
  ];
  
  // Generate links
  const links: NetworkLink[] = [];
  
  // Health conditions to risk factors
  healthConditions.forEach(condition => {
    const conditionId = condition.replace(/\s+/g, '');
    
    // Each condition related to 2-4 risk factors
    const numLinks = faker.number.int({ min: 2, max: 4 });
    const linkedRiskFactors = faker.helpers.arrayElements(riskFactors, numLinks);
    
    linkedRiskFactors.forEach(factor => {
      const factorId = factor.replace(/\s+/g, '');
      links.push({
        source: conditionId,
        target: factorId,
        strength: faker.number.float({ min: 0.4, max: 0.9 }),
        label: 'Risk Factor For'
      });
    });
    
    // Each condition related to 1-2 demographics
    const linkedDemographics = faker.helpers.arrayElements(demographics, faker.number.int({ min: 1, max: 2 }));
    linkedDemographics.forEach(demo => {
      const demoId = demo.replace(/\s+/g, '');
      links.push({
        source: conditionId,
        target: demoId,
        strength: faker.number.float({ min: 0.3, max: 0.7 }),
        label: 'Correlated With'
      });
    });
    
    // Each condition related to 1-3 interventions
    const linkedInterventions = faker.helpers.arrayElements(interventions, faker.number.int({ min: 1, max: 3 }));
    linkedInterventions.forEach(intervention => {
      const interventionId = intervention.replace(/\s+/g, '');
      links.push({
        source: interventionId,
        target: conditionId,
        strength: faker.number.float({ min: 0.5, max: 0.8 }),
        label: 'Treats'
      });
    });
  });
  
  // Risk factors to social determinants
  riskFactors.forEach(factor => {
    const factorId = factor.replace(/\s+/g, '');
    
    // Each risk factor related to 1-2 social determinants
    const linkedSocialFactors = faker.helpers.arrayElements(socialDeterminants, faker.number.int({ min: 1, max: 2 }));
    linkedSocialFactors.forEach(social => {
      const socialId = social.replace(/\s+/g, '');
      links.push({
        source: socialId,
        target: factorId,
        strength: faker.number.float({ min: 0.4, max: 0.8 }),
        label: 'Influences'
      });
    });
  });
  
  // Some random additional connections to make network more interesting
  for (let i = 0; i < 10; i++) {
    const sourceNode = faker.helpers.arrayElement(nodes);
    const targetNode = faker.helpers.arrayElement(nodes.filter(n => n.id !== sourceNode.id));
    
    links.push({
      source: sourceNode.id,
      target: targetNode.id,
      strength: faker.number.float({ min: 0.2, max: 0.5 }),
      label: 'Related To'
    });
  }
  
  return { nodes, links };
};
