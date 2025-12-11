import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Instructor, Package } from '../types';

interface PerformanceRadarProps {
  data: Instructor['performance'];
  compareData?: Instructor['performance'];
}

export const PerformanceRadar: React.FC<PerformanceRadarProps> = ({ data, compareData }) => {
  const chartData = [
    { subject: 'Punctuality', A: data.punctuality, B: compareData?.punctuality || 0, fullMark: 100 },
    { subject: 'Clarity', A: data.clarity, B: compareData?.clarity || 0, fullMark: 100 },
    { subject: 'Patience', A: data.patience, B: compareData?.patience || 0, fullMark: 100 },
    { subject: 'Knowledge', A: data.knowledge, B: compareData?.knowledge || 0, fullMark: 100 },
    { subject: 'Safety', A: data.safety, B: compareData?.safety || 0, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Selected"
            dataKey="A"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.6}
          />
          {compareData && (
             <Radar
             name="Comparison"
             dataKey="B"
             stroke="#3b82f6"
             fill="#3b82f6"
             fillOpacity={0.4}
           />
          )}
          {compareData && <Legend />}
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PricingBarChartProps {
  packages: Package[];
}

export const PricingBarChart: React.FC<PricingBarChartProps> = ({ packages }) => {
  const data = packages.map(p => ({
    name: p.name,
    costPerLesson: p.price / p.lessons,
    savings: (75 - (p.price / p.lessons)) * p.lessons // Assuming base price 75
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{fontSize: 12}} />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Cost/Lesson ($)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Total Savings ($)', angle: 90, position: 'insideRight' }} />
          <Tooltip cursor={{fill: '#f3f4f6'}} />
          <Legend />
          <Bar yAxisId="left" dataKey="costPerLesson" name="Cost Per Lesson" fill="#8884d8" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="savings" name="Total Savings" fill="#82ca9d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface CoverageMapProps {
  instructors: Instructor[];
  testCentres: { name: string, x: number, y: number }[];
}

export const CoverageMap: React.FC<CoverageMapProps> = ({ instructors, testCentres }) => {
  const instructorData = instructors.map(i => ({ x: i.coordinates.x, y: i.coordinates.y, z: 100, name: i.name, type: 'Instructor' }));
  const centreData = testCentres.map(t => ({ x: t.x, y: t.y, z: 200, name: t.name, type: 'Test Centre' }));

  return (
    <div className="h-80 w-full bg-slate-50 rounded-lg border border-slate-200 overflow-hidden relative">
      <div className="absolute top-2 left-2 bg-white/80 p-2 rounded text-xs z-10 shadow-sm pointer-events-none">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Instructor</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Test Centre</div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="Longitude" hide domain={[0, 400]} />
          <YAxis type="number" dataKey="y" name="Latitude" hide domain={[0, 400]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
              if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                      <div className="bg-white p-2 border border-gray-200 shadow-md rounded text-sm">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-gray-500">{data.type}</p>
                      </div>
                  );
              }
              return null;
          }} />
          <Scatter name="Instructors" data={instructorData} fill="#22c55e" shape="circle" />
          <Scatter name="Test Centres" data={centreData} fill="#ef4444" shape="triangle" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}