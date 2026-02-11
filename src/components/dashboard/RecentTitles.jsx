import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  archived: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

export default function RecentTitles({ titles, isLoading }) {
  return (
    <Card className="glass-effect border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-xl font-bold text-slate-900">Recent Titles</CardTitle>
        <Link to={createPageUrl("TitleManagement")}>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl">
                <Skeleton className="w-12 h-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {titles.map((title) => (
              <div key={title.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                <div className="w-12 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{title.title}</h3>
                  <p className="text-sm text-slate-500 truncate">{title.author}</p>
                  <p className="text-xs text-slate-400">{title.genre?.replace(/_/g, ' ')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${statusColors[title.status]} border font-medium`}>
                    {title.status}
                  </Badge>
                  {title.revenue && (
                    <span className="text-sm font-semibold text-slate-700">
                      ${title.revenue.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}