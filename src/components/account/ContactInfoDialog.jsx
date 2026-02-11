import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { User } from "@/entities/all";

export default function ContactInfoDialog({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    contact_info: {
      phone: user?.contact_info?.phone || '',
      company: user?.contact_info?.company || '',
      address: user?.contact_info?.address || ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedUser = await User.updateMyUserData(formData);
      onSave(updatedUser);
    } catch (error) {
      console.error('Error updating contact info:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
            Update Contact Information
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="full_name" style={{ fontSize: '14px', color: '#1a1a1a' }}>
              Full Name
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="h-10 border-gray-300 mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" style={{ fontSize: '14px', color: '#1a1a1a' }}>
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.contact_info.phone}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact_info: { ...prev.contact_info, phone: e.target.value }
              }))}
              className="h-10 border-gray-300 mt-1"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="company" style={{ fontSize: '14px', color: '#1a1a1a' }}>
              Company
            </Label>
            <Input
              id="company"
              value={formData.contact_info.company}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact_info: { ...prev.contact_info, company: e.target.value }
              }))}
              className="h-10 border-gray-300 mt-1"
              placeholder="Publisher Name Inc."
            />
          </div>

          <div>
            <Label htmlFor="address" style={{ fontSize: '14px', color: '#1a1a1a' }}>
              Address
            </Label>
            <Textarea
              id="address"
              value={formData.contact_info.address}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact_info: { ...prev.contact_info, address: e.target.value }
              }))}
              className="border-gray-300 mt-1"
              rows={3}
              placeholder="123 Publisher St, City, State, Country"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <button
              type="submit"
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
              Update Contact Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}