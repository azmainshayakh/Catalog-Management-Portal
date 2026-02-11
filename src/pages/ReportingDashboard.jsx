import React, { useState, useEffect } from 'react';
import { Title, Analytics, SalesData, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BookOpen, 
  Eye,
  Download,
  BarChart3
} from "lucide-react";

import TopTitlesChart from "../components/reporting/TopTitlesChart";
import SeriesPerformanceChart from "../components/reporting/SeriesPerformanceChart";
import AbandonmentAnalysis from "../components/reporting/AbandonmentAnalysis";
import SalesBreakdown from "../components/reporting/SalesBreakdown";
import MetricCard from "../components/reporting/MetricCard";

export default function ReportingDashboard() {
  const [titles, setTitles] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedGeo, setSelectedGeo] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange, selectedGeo]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [titlesData, analyticsData, salesDataResult, userData] = await Promise.all([
        Title.list("-created_date"),
        Analytics.list("-date"),
        SalesData.list("-date"),
        User.me()
      ]);
      
      setTitles(titlesData);
      setAnalytics(analyticsData);
      setSalesData(salesDataResult);
      setUser(userData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  // Filter data based on selected date range and geo
  const filterDataByRange = (data) => {
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const geoMatch = selectedGeo === 'all' || item.geo === selectedGeo;
      return itemDate >= startDate && geoMatch;
    });
  };

  // Calculate KPIs
  const filteredAnalytics = filterDataByRange(analytics);
  const filteredSalesData = filterDataByRange(salesData);

  const kpis = {
    totalAdds: filteredAnalytics
      .filter(a => a.metric_type === 'kobo_plus_adds')
      .reduce((sum, a) => sum + a.metric_value, 0),
    totalOpens: filteredAnalytics
      .filter(a => a.metric_type === 'opens')
      .reduce((sum, a) => sum + a.metric_value, 0),
    totalNetSales: filteredSalesData.reduce((sum, s) => sum + s.net_sales, 0),
    totalUnits: filteredSalesData.reduce((sum, s) => sum + s.units_sold, 0)
  };

  // Top Added Titles
  const topAddedTitles = filteredAnalytics
    .filter(a => a.metric_type === 'kobo_plus_adds')
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.title_id === curr.title_id);
      if (existing) {
        existing.adds += curr.metric_value;
      } else {
        const title = titles.find(t => t.id === curr.title_id);
        acc.push({
          title_id: curr.title_id,
          title: title?.title || 'Unknown',
          author: title?.author || 'Unknown',
          adds: curr.metric_value
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.adds - a.adds)
    .slice(0, 10);

  // Top Read Titles
  const topReadTitles = filteredAnalytics
    .filter(a => a.metric_type === 'opens')
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.title_id === curr.title_id);
      if (existing) {
        existing.opens += curr.metric_value;
      } else {
        const title = titles.find(t => t.id === curr.title_id);
        acc.push({
          title_id: curr.title_id,
          title: title?.title || 'Unknown',
          author: title?.author || 'Unknown',
          opens: curr.metric_value
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.opens - a.opens)
    .slice(0, 10);

  const canViewReports = () => user?.permissions?.view_reports || ['owner', 'admin', 'super_user'].includes(user?.role);
  const canExportData = () => user?.permissions?.export_data || ['owner', 'admin', 'super_user'].includes(user?.role);

  const exportToCsv = () => {
    if (!canExportData()) return;

    const csvData = filteredSalesData.map(sale => {
      const title = titles.find(t => t.id === sale.title_id);
      return {
        Date: sale.date,
        Title: title?.title || 'Unknown',
        'Net Sales': sale.net_sales,
        Units: sale.units_sold,
        'Price per Unit': sale.price_per_unit,
        Platform: sale.platform,
        Partner: sale.partner,
        Geo: sale.geo,
        Currency: sale.currency
      };
    });

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!canViewReports()) {
    return (
      <div className="bg-white rounded-lg p-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
            Access Denied
          </h1>
          <p style={{ color: '#666666' }}>
            You don't have permission to view reports. Contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: '600' }}>
              Reporting Dashboard
            </h1>
            <p style={{ color: '#666666', fontSize: '14px' }}>
              Analytics insights for Kobo Plus performance and sales data
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedGeo} onValueChange={setSelectedGeo}>
              <SelectTrigger className="w-40 h-10 border-gray-300">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 h-10 border-gray-300">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            {canExportData() && (
              <button
                onClick={exportToCsv}
                className="kobo-button-primary flex items-center gap-2"
                style={{
                  backgroundColor: '#bf0000',
                  border: '1px solid #bf0000',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="K+ Adds"
            value={kpis.totalAdds.toLocaleString()}
            icon={BookOpen}
            trend="+12%"
            trendUp={true}
          />
          <MetricCard
            title="Total Opens"
            value={kpis.totalOpens.toLocaleString()}
            icon={Eye}
            trend="+8%"
            trendUp={true}
          />
          <MetricCard
            title="Net Sales"
            value={`$${kpis.totalNetSales.toLocaleString()}`}
            icon={TrendingUp}
            trend="+24%"
            trendUp={true}
          />
          <MetricCard
            title="Units Sold"
            value={kpis.totalUnits.toLocaleString()}
            icon={BarChart3}
            trend="+15%"
            trendUp={true}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TopTitlesChart 
            topAddedTitles={topAddedTitles}
            topReadTitles={topReadTitles}
          />
          <SeriesPerformanceChart 
            titles={titles}
            analytics={filteredAnalytics}
          />
        </div>

        {/* Abandonment Analysis */}
        <div className="mb-8">
          <AbandonmentAnalysis 
            analytics={filteredAnalytics}
            titles={titles}
          />
        </div>

        {/* Sales Breakdown */}
        <div className="mb-8">
          <SalesBreakdown 
            salesData={filteredSalesData}
            titles={titles}
          />
        </div>

        {/* Top Titles Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Added Titles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                <BookOpen className="w-5 h-5" />
                Top Added Titles (K+)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        Title
                      </TableHead>
                      <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        Adds
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topAddedTitles.map((item, index) => (
                      <TableRow key={item.title_id}>
                        <TableCell>
                          <div>
                            <div className="font-medium" style={{ color: '#1a1a1a' }}>
                              {item.title}
                            </div>
                            <div className="text-sm" style={{ color: '#666666' }}>
                              {item.author}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 font-medium">
                            {item.adds.toLocaleString()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Top Read Titles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                <Eye className="w-5 h-5" />
                Top Read/Opened Titles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        Title
                      </TableHead>
                      <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                        Opens
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topReadTitles.map((item, index) => (
                      <TableRow key={item.title_id}>
                        <TableCell>
                          <div>
                            <div className="font-medium" style={{ color: '#1a1a1a' }}>
                              {item.title}
                            </div>
                            <div className="text-sm" style={{ color: '#666666' }}>
                              {item.author}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 font-medium">
                            {item.opens.toLocaleString()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}