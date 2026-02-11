import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

export default function SalesBreakdown({ salesData, titles }) {
  // Aggregate sales by platform
  const platformSales = salesData.reduce((acc, sale) => {
    const platform = sale.platform;
    if (acc[platform]) {
      acc[platform].net_sales += sale.net_sales;
      acc[platform].units += sale.units_sold;
      acc[platform].transactions += 1;
    } else {
      acc[platform] = {
        platform: platform,
        net_sales: sale.net_sales,
        units: sale.units_sold,
        transactions: 1,
        avg_price: sale.price_per_unit
      };
    }
    return acc;
  }, {});

  const platformData = Object.values(platformSales)
    .sort((a, b) => b.net_sales - a.net_sales);

  // Aggregate sales by geo
  const geoSales = salesData.reduce((acc, sale) => {
    const geo = sale.geo;
    if (acc[geo]) {
      acc[geo].net_sales += sale.net_sales;
      acc[geo].units += sale.units_sold;
    } else {
      acc[geo] = {
        geo: geo,
        net_sales: sale.net_sales,
        units: sale.units_sold
      };
    }
    return acc;
  }, {});

  const geoData = Object.values(geoSales)
    .sort((a, b) => b.net_sales - a.net_sales);

  const platformColors = {
    kobo: 'bg-red-100 text-red-800',
    rakuten: 'bg-purple-100 text-purple-800',
    walmart: 'bg-blue-100 text-blue-800',
    fnac: 'bg-green-100 text-green-800',
    tolino: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Platform Sales */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}>
            <DollarSign className="w-5 h-5" />
            Sales by Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    Platform
                  </TableHead>
                  <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    Net Sales
                  </TableHead>
                  <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    Units
                  </TableHead>
                  <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    Avg Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platformData.map((item) => (
                  <TableRow key={item.platform}>
                    <TableCell>
                      <Badge className={`${platformColors[item.platform] || 'bg-gray-100 text-gray-800'} font-medium capitalize`}>
                        {item.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold" style={{ color: '#1a1a1a' }}>
                      ${item.net_sales.toLocaleString()}
                    </TableCell>
                    <TableCell style={{ color: '#666666' }}>
                      {item.units.toLocaleString()}
                    </TableCell>
                    <TableCell style={{ color: '#666666' }}>
                      ${item.avg_price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Sales */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}>
            <DollarSign className="w-5 h-5" />
            Sales by Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    Region
                  </TableHead>
                  <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    Net Sales
                  </TableHead>
                  <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    Units
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {geoData.map((item) => (
                  <TableRow key={item.geo}>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 font-medium uppercase">
                        {item.geo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold" style={{ color: '#1a1a1a' }}>
                      ${item.net_sales.toLocaleString()}
                    </TableCell>
                    <TableCell style={{ color: '#666666' }}>
                      {item.units.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}