import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from "lucide-react";

export default function AbandonmentAnalysis({ analytics, titles }) {
  // Calculate abandonment points (mock data structure)
  const abandonmentData = [
    { chapter: 'Chapter 1-2', percentage: 15, readers: 1200 },
    { chapter: 'Chapter 3-5', percentage: 25, readers: 980 },
    { chapter: 'Chapter 6-8', percentage: 35, readers: 750 },
    { chapter: 'Chapter 9-12', percentage: 22, readers: 420 },
    { chapter: 'Chapter 13+', percentage: 3, readers: 180 }
  ];

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}>
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Abandonment Point Analysis
        </CardTitle>
        <p style={{ color: '#666666', fontSize: '14px' }}>
          Where readers typically stop reading
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={abandonmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="chapter" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666666', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666666', fontSize: 12 }}
                  label={{ value: 'Abandonment %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value}%`, 'Abandonment Rate']}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold" style={{ color: '#1a1a1a' }}>Key Insights</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <div className="text-red-600 font-semibold">35%</div>
                <div className="text-sm">
                  <div className="font-medium text-red-800">Highest abandonment</div>
                  <div className="text-red-600">Chapters 6-8 show critical drop-off</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div className="text-yellow-600 font-semibold">25%</div>
                <div className="text-sm">
                  <div className="font-medium text-yellow-800">Early abandonment</div>
                  <div className="text-yellow-600">Chapters 3-5 need attention</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="text-green-600 font-semibold">3%</div>
                <div className="text-sm">
                  <div className="font-medium text-green-800">High retention</div>
                  <div className="text-green-600">Strong finish for engaged readers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}