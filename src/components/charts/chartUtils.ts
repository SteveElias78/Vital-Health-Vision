
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

// Function to export chart as image
export const exportChartAsImage = async (chartRef: React.RefObject<HTMLDivElement>, filename: string = 'chart') => {
  if (!chartRef.current) return;
  
  try {
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: null,
      scale: 2, // Better resolution
    });
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}.png`);
      }
    });
  } catch (error) {
    console.error('Error exporting chart:', error);
  }
};

// Function to export chart data as CSV
export const exportChartDataAsCSV = (data: any[], filename: string = 'chart-data') => {
  if (!data || !data.length) return;
  
  // Convert data to CSV format
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        // Handle commas and quotes in the data
        const cell = row[header] === null || row[header] === undefined ? '' : row[header];
        return typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell;
      }).join(',')
    )
  ];
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

// Function to process and animate time-series data
export interface TimeseriesDataPoint {
  date: string | number;
  value: number;
  [key: string]: any;
}

export const animateTimeSeries = (
  data: TimeseriesDataPoint[],
  setData: React.Dispatch<React.SetStateAction<TimeseriesDataPoint[]>>, 
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>,
  speed: number = 500
) => {
  setIsAnimating(true);
  let currentIndex = 0;
  
  const intervalId = setInterval(() => {
    if (currentIndex >= data.length) {
      clearInterval(intervalId);
      setIsAnimating(false);
      return;
    }
    
    setData(data.slice(0, currentIndex + 1));
    currentIndex += 1;
  }, speed);
  
  return () => {
    clearInterval(intervalId);
    setIsAnimating(false);
  };
};

// Function to get extent of data (min/max) for auto-zooming
export const getDataExtent = (data: any[], key: string): [number, number] => {
  const values = data.map(item => Number(item[key])).filter(val => !isNaN(val));
  return [Math.min(...values), Math.max(...values)];
};

// Zoom utilities
export interface ZoomState {
  domain: { x: [number, number] | null; y: [number, number] | null } | null;
}

export const applyZoomToData = (data: any[], zoomState: ZoomState | null, xKey: string) => {
  if (!zoomState?.domain?.x) return data;
  
  const [minX, maxX] = zoomState.domain.x;
  return data.filter(point => {
    const x = xKey === 'date' ? new Date(point[xKey]).getTime() : Number(point[xKey]);
    return x >= minX && x <= maxX;
  });
};
