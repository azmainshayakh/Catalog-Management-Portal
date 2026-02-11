import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricsCards({ title, value, icon: Icon, trend, trendUp }) {
  // Update the title if it's "Subscribers" to "K+"
  const displayTitle = title === "Subscribers" ? "K+" : title;
  
  return (
    <Card className="glass-effect border-0 shadow-lg hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            trendUp ? 'bg-emerald-100' : 'bg-rose-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              trendUp ? 'text-emerald-600' : 'text-rose-600'
            }`} />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trendUp ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{displayTitle}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}