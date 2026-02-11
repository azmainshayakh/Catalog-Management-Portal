import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Eye, CreditCard } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Add New Title",
      description: "Upload and activate a new title",
      icon: Plus,
      href: createPageUrl("TitleManagement"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Manage Visibility",
      description: "Control catalog visibility",
      icon: Eye,
      href: createPageUrl("CatalogVisibility"),
      color: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
      title: "Subscription Setup",
      description: "Configure subscription plans",
      icon: CreditCard,
      href: createPageUrl("Subscriptions"),
      color: "bg-amber-500 hover:bg-amber-600"
    }
  ];

  return (
    <Card className="glass-effect border-0 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-bold text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.title} to={action.href}>
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto hover:bg-slate-50 rounded-xl transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${action.color}`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">{action.title}</p>
                <p className="text-sm text-slate-500">{action.description}</p>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}