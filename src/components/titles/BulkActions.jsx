import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Play, 
  Pause, 
  Eye, 
  EyeOff, 
  Archive 
} from "lucide-react";
import { Title } from "@/entities/all";

export default function BulkActions({ selectedCount, onClearSelection, onBulkAction, selectedTitles }) {
  const handleBulkStatusChange = async (status) => {
    for (const titleId of selectedTitles) {
      await Title.update(titleId, { status });
    }
    onClearSelection();
    onBulkAction();
  };

  const handleBulkVisibilityChange = async (visibility) => {
    for (const titleId of selectedTitles) {
      await Title.update(titleId, { catalog_visibility: visibility });
    }
    onClearSelection();
    onBulkAction();
  };

  return (
    <Card className="glass-effect border-0 shadow-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className="bg-slate-900 text-white px-3 py-1">
            {selectedCount} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('active')}
            className="rounded-lg"
          >
            <Play className="w-4 h-4 mr-1" />
            Activate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('inactive')}
            className="rounded-lg"
          >
            <Pause className="w-4 h-4 mr-1" />
            Deactivate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkVisibilityChange('public')}
            className="rounded-lg"
          >
            <Eye className="w-4 h-4 mr-1" />
            Make Public
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkVisibilityChange('private')}
            className="rounded-lg"
          >
            <EyeOff className="w-4 h-4 mr-1" />
            Make Private
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('archived')}
            className="rounded-lg text-amber-600 hover:text-amber-700"
          >
            <Archive className="w-4 h-4 mr-1" />
            Archive
          </Button>
        </div>
      </div>
    </Card>
  );
}