
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Catalog Management",
    url: createPageUrl("CatalogManagement"),
  },
  {
    title: "Pricing & Promotions", 
    url: createPageUrl("PricingPromotions"),
  },
  {
    title: "Account Management",
    url: createPageUrl("AccountManagement"),
  },
  {
    title: "Reporting Dashboard",
    url: createPageUrl("ReportingDashboard"),
  },
];

const KoboLogo = () => (
  <div className="text-2xl font-sans cursor-pointer" style={{ color: '#bf0000' }}>
    <span className="font-bold">Rakuten</span> kobo
  </div>
);

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        .kobo-button-primary {
          background-color: #bf0000;
          border: 1px solid #bf0000;
          color: white;
          font-weight: 500;
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .kobo-button-primary:hover {
          background-color: #a00000;
          border-color: #a00000;
        }
        
        .kobo-button-secondary {
          background-color: white;
          border: 1px solid #bf0000;
          color: #bf0000;
          font-weight: 500;
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .kobo-button-secondary:hover {
          background-color: #fef2f2;
          border-color: #bf0000;
          color: #bf0000;
        }
        
        .kobo-text-primary {
          color: #1a1a1a;
        }
        
        .kobo-text-secondary {
          color: #666666;
        }
        
        .kobo-border {
          border-color: #e5e5e5;
        }
        
        .kobo-nav-item {
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          text-decoration: none;
          padding: 12px 16px;
          display: block;
          border-radius: 0;
          transition: color 0.2s ease;
        }
        
        .kobo-nav-item:hover {
          color: #bf0000;
        }
        
        .kobo-nav-item.active {
          color: #bf0000;
          font-weight: 500;
        }
        
        .kobo-header-text {
          font-size: 16px;
          color: #666666;
          font-weight: 400;
        }
        
        .kobo-account-button {
          font-size: 14px;
          color: #333333;
          font-weight: 400;
        }
        
        .kobo-logo-link {
          text-decoration: none;
          display: block;
          transition: opacity 0.2s ease;
        }
        
        .kobo-logo-link:hover {
          opacity: 0.8;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-white font-sans">
        <Sidebar className="w-64 bg-white kobo-border" style={{ borderRight: '1px solid #e5e5e5' }}>
          <div className="p-6 h-20 flex items-center kobo-border" style={{ borderBottom: '1px solid #e5e5e5' }}>
            <Link to={createPageUrl("Dashboard")} className="kobo-logo-link">
              <KoboLogo />
            </Link>
          </div>
          <SidebarContent className="p-0">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link 
                    to={item.url} 
                    className={`kobo-nav-item relative ${
                      location.pathname === item.url ? 'active' : ''
                    }`}
                  >
                    {location.pathname === item.url && (
                      <span 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: '#bf0000' }}
                      ></span>
                    )}
                    <span className="ml-2">{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header 
            className="bg-white px-8 h-20 flex items-center justify-between kobo-border" 
            style={{ borderBottom: '1px solid #e5e5e5' }}
          >
            <div className="kobo-header-text">
              Publisher Portal
            </div>
            <div>
              <Button variant="ghost" className="kobo-account-button flex items-center gap-2">
                <User className="w-5 h-5" />
                Publisher Account
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8" style={{ backgroundColor: '#f9f9f9' }}>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
