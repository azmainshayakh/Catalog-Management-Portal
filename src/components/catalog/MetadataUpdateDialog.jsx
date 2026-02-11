import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Title } from "@/entities/all";

export default function MetadataUpdateDialog({ selectedTitleIds, onClose, onSave }) {
  const [formData, setFormData] = useState({
    subtitle: '',
    series_name: '',
    author: '',
    description: '',
    keywords: '', // Storing as comma-separated string
    accessibility_features: '', // Storing as comma-separated string
  });
  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const updatePayload = {};
    if (formData.subtitle) updatePayload.subtitle = formData.subtitle;
    if (formData.series_name) updatePayload.series_name = formData.series_name;
    if (formData.author) updatePayload.author = formData.author;
    if (formData.description) updatePayload.description = formData.description;
    if (formData.keywords) updatePayload.keywords = formData.keywords.split(',').map(k => k.trim());
    if (formData.accessibility_features) updatePayload.accessibility_features = formData.accessibility_features.split(',').map(f => f.trim());

    if (Object.keys(updatePayload).length > 0) {
      const updatePromises = selectedTitleIds.map(id => Title.update(id, updatePayload));
      await Promise.all(updatePromises);
    }
    
    setIsUpdating(false);
    onSave();
    onClose();
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold kobo-text-primary">
            Bulk Update Metadata for {selectedTitleIds.length} Titles
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm kobo-text-secondary">Only fill in the fields you want to update. Blank fields will be ignored.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" value={formData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="series_name">Series Name</Label>
              <Input id="series_name" value={formData.series_name} onChange={(e) => handleChange('series_name', e.target.value)} className="mt-1" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" value={formData.author} onChange={(e) => handleChange('author', e.target.value)} className="mt-1" />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="mt-1" rows={3} />
          </div>
          
          <div>
            <Label htmlFor="keywords">Keywords / Tags (comma-separated)</Label>
            <Input id="keywords" value={formData.keywords} onChange={(e) => handleChange('keywords', e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="accessibility_features">Accessibility Features (comma-separated)</Label>
            <Input id="accessibility_features" value={formData.accessibility_features} onChange={(e) => handleChange('accessibility_features', e.target.value)} className="mt-1" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <button type="submit" className="kobo-button-primary" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Apply Updates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}