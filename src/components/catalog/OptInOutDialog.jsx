import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Title } from "@/entities/all";

export default function OptInOutDialog({ titles, onClose, onSave }) {
  const [bulkSettings, setBulkSettings] = useState({
    kobo_plus_enabled: false,
    annotation_export_enabled: false,
    ai_recaps_enabled: false,
    pre_order_enabled: false,
    preview_enabled: false
  });

  const handleBulkApply = async () => {
    const updates = titles.map(title => 
      Title.update(title.id, bulkSettings)
    );
    
    await Promise.all(updates);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
            Bulk Opt-In/Out Settings
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <p style={{ fontSize: '14px', color: '#666666' }}>
            Apply these settings to {titles.length} selected title{titles.length !== 1 ? 's' : ''}
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="kobo-plus" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                Kobo Plus
              </Label>
              <Switch
                id="kobo-plus"
                checked={bulkSettings.kobo_plus_enabled}
                onCheckedChange={(checked) => 
                  setBulkSettings(prev => ({ ...prev, kobo_plus_enabled: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="annotation" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                Annotation Export
              </Label>
              <Switch
                id="annotation"
                checked={bulkSettings.annotation_export_enabled}
                onCheckedChange={(checked) => 
                  setBulkSettings(prev => ({ ...prev, annotation_export_enabled: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-recaps" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                AI Recaps
              </Label>
              <Switch
                id="ai-recaps"
                checked={bulkSettings.ai_recaps_enabled}
                onCheckedChange={(checked) => 
                  setBulkSettings(prev => ({ ...prev, ai_recaps_enabled: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="pre-order" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                Pre-Order
              </Label>
              <Switch
                id="pre-order"
                checked={bulkSettings.pre_order_enabled}
                onCheckedChange={(checked) => 
                  setBulkSettings(prev => ({ ...prev, pre_order_enabled: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="preview" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                Preview
              </Label>
              <Switch
                id="preview"
                checked={bulkSettings.preview_enabled}
                onCheckedChange={(checked) => 
                  setBulkSettings(prev => ({ ...prev, preview_enabled: checked }))
                }
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <button
            onClick={handleBulkApply}
            className="kobo-button-primary"
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
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}