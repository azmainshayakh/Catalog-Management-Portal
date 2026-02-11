import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function TitleFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
        <SelectTrigger className="w-40 h-12 rounded-xl border-slate-200">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.genre} onValueChange={(value) => handleFilterChange('genre', value)}>
        <SelectTrigger className="w-40 h-12 rounded-xl border-slate-200">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          <SelectItem value="fiction">Fiction</SelectItem>
          <SelectItem value="non_fiction">Non Fiction</SelectItem>
          <SelectItem value="mystery">Mystery</SelectItem>
          <SelectItem value="romance">Romance</SelectItem>
          <SelectItem value="sci_fi">Sci-Fi</SelectItem>
          <SelectItem value="biography">Biography</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.visibility} onValueChange={(value) => handleFilterChange('visibility', value)}>
        <SelectTrigger className="w-40 h-12 rounded-xl border-slate-200">
          <SelectValue placeholder="Visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Visibility</SelectItem>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="restricted">Restricted</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}