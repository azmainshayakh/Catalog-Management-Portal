import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Play, Pause, Edit } from "lucide-react";

export default function BulkActionsPanel({ selectedCount, onBulkStatusChange, onClearSelection, onBulkMetadataUpdate }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-600 text-white px-3 py-1">
            {selectedCount} titles selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear selection
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={onBulkMetadataUpdate} className="kobo-button-secondary flex items-center gap-2 text-sm">
            <Edit className="w-4 h-4" />
            Update Metadata
          </button>
          <button onClick={() => onBulkStatusChange('active')} className="kobo-button-secondary flex items-center gap-2 text-sm text-green-700 border-green-300 hover:bg-green-50">
            <Play className="w-4 h-4" />
            Activate
          </button>
          <button onClick={() => onBulkStatusChange('inactive')} className="kobo-button-secondary flex items-center gap-2 text-sm text-red-700 border-red-300 hover:bg-red-50">
            <Pause className="w-4 h-4" />
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}