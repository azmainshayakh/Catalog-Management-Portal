import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function SeriesPerformanceChart({ titles, analytics }) {
  // Group titles by series and calculate performance
  const seriesPerformance = titles
    .filter(title => title.series_name)
    .reduce((acc, title) => {
      const seriesName = title.series_name;
      const titleAnalytics = analytics.filter(a => a.title_id === title.id);
      const totalAdds = titleAnalytics
        .filter(a => a.metric_type === 'kobo_plus_adds')
        .reduce((sum, a) => sum + a.metric_value, 0);

      if (acc[seriesName]) {
        acc[seriesName].adds += totalAdds;
        acc[seriesName].titles += 1;
      } else {
        acc[seriesName] = {
          name: seriesName,
          adds: totalAdds,
          titles: 1
        };
      }
      return acc;
    }, {});

  const seriesData = Object.values(seriesPerformance)
    .sort((a, b) => b.adds - a.adds)
    .slice(0, 8);

  const COLORS = [
    '#bf0000', '#3b82f6', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'
  ];

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}>
          Series Performance
        </CardTitle>
        <p style={{ color: '#666666', fontSize: '14px' }}>
          K+ adds by book series
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={seriesData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="adds"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {seriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value.toLocaleString(), 'K+ Adds']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}