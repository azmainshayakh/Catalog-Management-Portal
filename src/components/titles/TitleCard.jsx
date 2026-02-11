import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  EyeOff,
  Play,
  Pause,
  Archive,
  BookOpen
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  archived: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

const genreColors = {
  fiction: "bg-purple-100 text-purple-800",
  non_fiction: "bg-blue-100 text-blue-800",
  mystery: "bg-indigo-100 text-indigo-800",
  romance: "bg-pink-100 text-pink-800",
  sci_fi: "bg-cyan-100 text-cyan-800",
  biography: "bg-emerald-100 text-emerald-800",
  business: "bg-orange-100 text-orange-800",
  children: "bg-yellow-100 text-yellow-800",
};

export default function TitleCard({ title, selected, onSelect, onEdit, onStatusChange }) {
  return (
    <Card className="glass-effect border-0 shadow-lg hover-lift group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Checkbox
            checked={selected}
            onCheckedChange={onSelect}
            className="mt-1"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(title.id, title.status === 'active' ? 'inactive' : 'active')}>
                {title.status === 'active' ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(title.id, 'archived')}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full h-32 bg-slate-200 rounded-xl flex items-center justify-center mb-4">
          {title.cover_image_url ? (
            <img 
              src={title.cover_image_url} 
              alt={title.title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-slate-400" />
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg truncate">{title.title}</h3>
            <p className="text-slate-600 truncate">{title.author}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={`${statusColors[title.status]} border font-medium`}>
              {title.status}
            </Badge>
            <Badge className={`${genreColors[title.genre] || 'bg-gray-100 text-gray-800'} border-0`}>
              {title.genre?.replace(/_/g, ' ')}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {title.catalog_visibility === 'public' ? (
                <Eye className="w-4 h-4 text-emerald-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-sm text-slate-600 capitalize">
                {title.catalog_visibility}
              </span>
            </div>
            
            {title.price && (
              <span className="font-bold text-slate-900">
                ${title.price}
              </span>
            )}
          </div>

          {(title.total_sales > 0 || title.revenue > 0) && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sales: {title.total_sales || 0}</span>
                <span className="font-semibold text-slate-700">
                  ${(title.revenue || 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}