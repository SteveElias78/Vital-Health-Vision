
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ArtDecoCard } from '@/components/artdeco/ArtDecoCard';
import { ArtDecoCardHeader } from '@/components/artdeco/ArtDecoCardHeader';

interface Node {
  id: string;
  label: string;
  group: number;
  value: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
  strength?: number;
}

interface NetworkGraphProps {
  title: string;
  subtitle?: string;
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
  colorScheme?: string[];
}

export const NetworkGraphVisualization: React.FC<NetworkGraphProps> = ({
  title,
  subtitle,
  nodes,
  links,
  width = 800,
  height = 600,
  colorScheme = ['#FFC700', '#CCA000', '#997700', '#665000', '#332800']
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous rendering
    
    // Create a color scale
    const color = d3.scaleOrdinal(colorScheme);
    
    // Create a force simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.value * 2 + 15));
    
    // Add decorative background
    svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#000723" },
        { offset: "100%", color: "#1A1F2C" }
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);
    
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#gradient)");
    
    // Art Deco decorative elements
    svg.append("path")
      .attr("d", `M0,0 L${width},0 L${width},${height} L0,${height} Z`)
      .attr("stroke", "#FFC700")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("stroke-opacity", 0.3);
      
    // Create links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", d => Math.sqrt(d.value) + 1)
      .attr("stroke", "#FFC700")
      .attr("stroke-opacity", 0.2);
    
    // Create nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);
    
    // Add circles for each node
    node.append("circle")
      .attr("r", (d: any) => 5 + d.value * 2)
      .attr("fill", (d: any) => color(d.group.toString()))
      .attr("stroke", "#FFC700")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.8)
      .on("click", (event, d: any) => {
        setSelectedNode(d);
      });
    
    // Add text labels
    node.append("text")
      .text((d: any) => d.label)
      .attr("x", 12)
      .attr("y", 3)
      .style("font-family", "'Poppins', sans-serif")
      .style("font-size", "10px")
      .style("fill", "#FFC700");
    
    // Define drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height, colorScheme]);
  
  return (
    <ArtDecoCard className="w-full">
      <ArtDecoCardHeader title={title} subtitle={subtitle} />
      <div className="p-4">
        <div className="relative">
          <svg 
            ref={svgRef}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="rounded-md overflow-hidden"
          />
          
          {selectedNode && (
            <div className="absolute top-4 right-4 p-4 bg-midnight-900 border border-gold-500/30 rounded-md shadow-lg">
              <h4 className="text-gold-400 text-lg font-medium">{selectedNode.label}</h4>
              <p className="text-gold-300/70 text-sm">Group: {selectedNode.group}</p>
              <p className="text-gold-300/70 text-sm">Value: {selectedNode.value}</p>
              <button 
                onClick={() => setSelectedNode(null)}
                className="mt-2 px-2 py-1 bg-midnight-800 hover:bg-midnight-700 text-xs text-gold-400 rounded"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </ArtDecoCard>
  );
};

// Sample data generator for testing
export const generateNetworkData = (nodeCount: number = 15, density: number = 0.2) => {
  const nodes: Node[] = [];
  const links: Link[] = [];
  
  // Generate nodes
  for (let i = 0; i < nodeCount; i++) {
    const groupId = Math.floor(Math.random() * 5) + 1;
    nodes.push({
      id: `node-${i}`,
      label: `Condition ${i+1}`,
      group: groupId,
      value: Math.random() * 10 + 1
    });
  }
  
  // Generate links with specified density
  for (let i = 0; i < nodeCount; i++) {
    const linkCount = Math.floor(Math.random() * nodeCount * density);
    for (let j = 0; j < linkCount; j++) {
      const target = Math.floor(Math.random() * nodeCount);
      if (i !== target) {
        links.push({
          source: `node-${i}`,
          target: `node-${target}`,
          value: Math.random() * 5 + 1
        });
      }
    }
  }
  
  return { nodes, links };
};
