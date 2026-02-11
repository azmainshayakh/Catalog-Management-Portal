import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TopTitlesChart({ topAddedTitles, topReadTitles }) {
  // Combine and format data for the chart
  const chartData = topAddedTitles.slice(0, 5).map((addedTitle, index) => {
    const readTitle = topReadTitles[index] || { opens: 0 };
    return {
      title: addedTitle.title.length > 20 ? addedTitle.title.substring(0, 20) + '...' : addedTitle.title,
      adds: addedTitle.adds,
      opens: readTitle.opens
    };
  });

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}>
          Top Titles Performance
        </CardTitle>
        <p style={{ color: '#666666', fontSize: '14px' }}>
          K+ Adds vs Opens comparison
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="title" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666666', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666666', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="adds" 
                name="K+ Adds"
                fill="#bf0000" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="opens" 
                name="Opens"
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}