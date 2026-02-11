import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { PriceRule } from "@/entities/all";

const currencies = {
  global: 'USD', us: 'USD', ca: 'CAD', uk: 'GBP', au: 'AUD', fr: 'EUR', de: 'EUR', jp: 'JPY'
};

export default function PricingDialog({ allTitles, selectedTitleIds, editingRule, onClose, onSave }) {
  const [formData, setFormData] = useState(editingRule || {
    title_id: selectedTitleIds.length === 1 ? selectedTitleIds[0] : '',
    region: 'global',
    price: '',
    currency: 'USD',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_promotional: false
  });
  
  const isBulkMode = selectedTitleIds.length > 1;
  const [applyToSelected, setApplyToSelected] = useState(isBulkMode);

  useEffect(() => {
    if (editingRule) {
      setApplyToSelected(false);
    }
  }, [editingRule]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const ruleData = {
      ...formData,
      price: parseFloat(formData.price),
      currency: currencies[formData.region] || formData.currency,
      end_date: formData.end_date || null
    };

    if (applyToSelected && selectedTitleIds.length > 0) {
      const promises = selectedTitleIds.map(titleId => 
        PriceRule.create({ ...ruleData, title_id: titleId })
      );
      await Promise.all(promises);
    } else {
      if (editingRule) {
        await PriceRule.update(editingRule.id, ruleData);
      } else {
        await PriceRule.create(ruleData);
      }
    }
    
    onSave();
  };

  const handleRegionChange = (region) => {
    setFormData(prev => ({
      ...prev,
      region,
      currency: currencies[region] || 'USD'
    }));
  };

  const dialogTitle = editingRule 
    ? 'Edit Price Rule' 
    : isBulkMode 
    ? `Set Price for ${selectedTitleIds.length} Titles`
    : 'Create Price Rule';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold kobo-text-primary">{dialogTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isBulkMode && !editingRule && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Checkbox id="apply-selected" checked={applyToSelected} onCheckedChange={setApplyToSelected} />
              <Label htmlFor="apply-selected">Apply to all {selectedTitleIds.length} selected titles</Label>
            </div>
          )}

          {!applyToSelected && (
            <div>
              <Label htmlFor="title">Title *</Label>
              <Select value={formData.title_id} onValueChange={(value) => setFormData(p => ({ ...p, title_id: value }))} required>
                <SelectTrigger className="w-full h-10 border-gray-300 mt-1">
                  <SelectValue placeholder="Select a title" />
                </SelectTrigger>
                <SelectContent>
                  {allTitles.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="region">Region *</Label>
            <Select value={formData.region} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-full h-10 border-gray-300 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input id="price" type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} className="h-10 mt-1" required />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={formData.currency} className="h-10 mt-1 bg-gray-100" readOnly />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date *</Label>
              <Input id="start-date" type="date" value={formData.start_date} onChange={(e) => setFormData(p => ({ ...p, start_date: e.target.value }))} className="h-10 mt-1" required />
            </div>
            <div>
              <Label htmlFor="end-date">End Date (Optional)</Label>
              <Input id="end-date" type="date" value={formData.end_date} onChange={(e) => setFormData(p => ({ ...p, end_date: e.target.value }))} className="h-10 mt-1" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="promotional" checked={formData.is_promotional} onCheckedChange={(c) => setFormData(p => ({ ...p, is_promotional: c }))} />
            <Label htmlFor="promotional">This is a promotional price</Label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <button type="submit" className="kobo-button-primary">
              {editingRule ? 'Update Rule' : 'Save Rule(s)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}