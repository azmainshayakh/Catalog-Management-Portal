import React, { useState } from 'react';
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
import { X, Mail } from "lucide-react";
import { User } from "@/entities/all";

export default function UserRoleDialog({ user, currentUser, onClose, onSave }) {
  const [formData, setFormData] = useState(user || {
    full_name: '',
    email: '',
    role: 'viewer',
    account_holder_ids: ['pub_001'], // Default account
    permissions: {
      manage_catalog: false,
      manage_pricing: false,
      manage_users: false,
      view_reports: true,
      export_data: false
    }
  });
  const [inviteMode, setInviteMode] = useState(!user); // New user = invite mode

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (user) {
        // Update existing user
        if (user.id === currentUser.id) {
          await User.updateMyUserData(formData);
        } else {
          await User.update(user.id, formData);
        }
        onSave();
        onClose();
      } else {
        // For new users, show invitation instructions
        alert(`To add ${formData.email} as a ${formData.role}:\n\n1. Go to Workspace → Users in the sidebar\n2. Click "Invite User"\n3. Enter their email: ${formData.email}\n4. Once they accept, edit their role and permissions here`);
        onClose();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleRoleChange = (newRole) => {
    let defaultPermissions = {
      manage_catalog: false,
      manage_pricing: false,
      manage_users: false,
      view_reports: true,
      export_data: false
    };

    switch (newRole) {
      case 'owner':
        defaultPermissions = {
          manage_catalog: true,
          manage_pricing: true,
          manage_users: true,
          view_reports: true,
          export_data: true
        };
        break;
      case 'admin':
        defaultPermissions = {
          manage_catalog: true,
          manage_pricing: true,
          manage_users: false,
          view_reports: true,
          export_data: true
        };
        break;
      case 'super_user':
        defaultPermissions = {
          manage_catalog: true,
          manage_pricing: true,
          manage_users: true,
          view_reports: true,
          export_data: true
        };
        break;
    }

    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: defaultPermissions
    }));
  };

  const isReadOnly = currentUser?.role !== 'owner' && currentUser?.role !== 'super_user';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
            {user ? 'Edit User' : 'Invite New User'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!user && (
          <div className="p-6 bg-blue-50 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">How to invite users</h3>
                <p className="text-sm text-blue-700 mt-1">
                  After setting up the role below, you'll get instructions on how to invite this user through the workspace.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="full_name" style={{ fontSize: '14px', color: '#1a1a1a' }}>
              Full Name *
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="h-10 border-gray-300 mt-1"
              required
              disabled={isReadOnly && user}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="email" style={{ fontSize: '14px', color: '#1a1a1a' }}>
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="h-10 border-gray-300 mt-1"
              required
              disabled={isReadOnly && user}
              placeholder="john.doe@company.com"
            />
          </div>

          <div>
            <Label htmlFor="role" style={{ fontSize: '14px', color: '#1a1a1a' }}>
              Role *
            </Label>
            <Select value={formData.role} onValueChange={handleRoleChange} disabled={isReadOnly && user}>
              <SelectTrigger className="w-full h-10 border-gray-300 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                <SelectItem value="admin">Admin - Full access except user management</SelectItem>
                <SelectItem value="owner">Owner - Full access including user management</SelectItem>
                {currentUser?.role === 'super_user' && (
                  <SelectItem value="super_user">Super User - Internal Kobo access</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label style={{ fontSize: '14px', color: '#1a1a1a' }}>Account Access</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="account_pub_001"
                  checked={formData.account_holder_ids?.includes('pub_001')}
                  onCheckedChange={(checked) => {
                    const currentIds = formData.account_holder_ids || [];
                    if (checked) {
                      setFormData(prev => ({ 
                        ...prev, 
                        account_holder_ids: [...currentIds, 'pub_001']
                      }));
                    } else {
                      setFormData(prev => ({ 
                        ...prev, 
                        account_holder_ids: currentIds.filter(id => id !== 'pub_001')
                      }));
                    }
                  }}
                  disabled={isReadOnly && user}
                />
                <Label htmlFor="account_pub_001" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                  Premier Publishing House (pub_001)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="account_pub_002"
                  checked={formData.account_holder_ids?.includes('pub_002')}
                  onCheckedChange={(checked) => {
                    const currentIds = formData.account_holder_ids || [];
                    if (checked) {
                      setFormData(prev => ({ 
                        ...prev, 
                        account_holder_ids: [...currentIds, 'pub_002']
                      }));
                    } else {
                      setFormData(prev => ({ 
                        ...prev, 
                        account_holder_ids: currentIds.filter(id => id !== 'pub_002')
                      }));
                    }
                  }}
                  disabled={isReadOnly && user}
                />
                <Label htmlFor="account_pub_002" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                  Digital Books Inc (pub_002)
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label style={{ fontSize: '14px', color: '#1a1a1a' }}>Permissions</Label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manage_catalog"
                  checked={formData.permissions.manage_catalog}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      permissions: { ...prev.permissions, manage_catalog: checked }
                    }))
                  }
                  disabled={(isReadOnly && user) || ['owner', 'super_user'].includes(formData.role)}
                />
                <Label htmlFor="manage_catalog" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                  Manage Catalog
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manage_pricing"
                  checked={formData.permissions.manage_pricing}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      permissions: { ...prev.permissions, manage_pricing: checked }
                    }))
                  }
                  disabled={(isReadOnly && user) || ['owner', 'super_user'].includes(formData.role)}
                />
                <Label htmlFor="manage_pricing" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                  Manage Pricing
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manage_users"
                  checked={formData.permissions.manage_users}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      permissions: { ...prev.permissions, manage_users: checked }
                    }))
                  }
                  disabled={(isReadOnly && user) || formData.role !== 'owner'}
                />
                <Label htmlFor="manage_users" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                  Manage Users
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export_data"
                  checked={formData.permissions.export_data}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      permissions: { ...prev.permissions, export_data: checked }
                    }))
                  }
                  disabled={(isReadOnly && user) || formData.role === 'viewer'}
                />
                <Label htmlFor="export_data" style={{ fontSize: '14px', color: '#1a1a1a' }}>
                  Export Data
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="view_reports"
                  checked={formData.permissions.view_reports}
                  disabled
                />
                <Label htmlFor="view_reports" style={{ fontSize: '14px', color: '#666666' }}>
                  View Reports (Always enabled)
                </Label>
              </div>
            </div>
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
              disabled={isReadOnly && user}
            >
              {user ? 'Update User' : 'Get Invitation Instructions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}