import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Users,
  Eye,
  CreditCard
} from "lucide-react";

import MetricsCards from "../components/dashboard/MetricsCards";
import RecentTitles from "../components/dashboard/RecentTitles";
import RevenueChart from "../components/dashboard/RevenueChart";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [titles, setTitles] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [titlesData, subscriptionsData] = await Promise.all([
        base44.entities.Title.list("-created_date", 50),
        base44.entities.Subscription.list("-created_date", 50)
      ]);
      setTitles(titlesData);
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const metrics = {
    totalTitles: titles.length,
    activeTitles: titles.filter(t => t.status === 'active').length,
    totalRevenue: titles.reduce((sum, title) => sum + (title.revenue || 0), 0),
    totalSubscribers: subscriptions.reduce((sum, sub) => sum + (sub.subscriber_count || 0), 0)
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                  Welcome{user ? `, ${user.full_name || user.email}` : ' back'}
                </h1>
                <p className="text-slate-600 text-lg">
                  Here's what's happening with your catalog today
                </p>
              </div>
        <div className="flex gap-3">
          <Link to={createPageUrl("CatalogManagement")}>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg hover-lift">
              <BookOpen className="w-5 h-5 mr-2" />
              Manage Catalog
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCards
          title="Total Titles"
          value={metrics.totalTitles}
          icon={BookOpen}
          trend="+12% this month"
          trendUp={true}
        />
        <MetricsCards
          title="Active Titles"
          value={metrics.activeTitles}
          icon={TrendingUp}
          trend="+8% this month"
          trendUp={true}
        />
        <MetricsCards
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+24% this month"
          trendUp={true}
        />
        <MetricsCards
          title="Subscribers"
          value={metrics.totalSubscribers}
          icon={Users}
          trend="+18% this month"
          trendUp={true}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart titles={titles} />
          <RecentTitles titles={titles.slice(0, 5)} isLoading={isLoading} />
        </div>
        
        <div className="space-y-8">
          <QuickActions />
          
          <Card className="glass-effect border-0 shadow-xl hover-lift">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Catalog Views</p>
                    <p className="text-sm text-slate-500">This week</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">2.4K</p>
                  <p className="text-sm text-green-600">+15%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Subscription Rate</p>
                    <p className="text-sm text-slate-500">Conversion</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">12.8%</p>
                  <p className="text-sm text-blue-600">+3.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}