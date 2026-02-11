
import React, { useState, useEffect } from 'react';
import { User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, Shield, Users } from "lucide-react";

import UserRoleDialog from "../components/account/UserRoleDialog";
import ContactInfoDialog from "../components/account/ContactInfoDialog";

export default function AccountManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
      
      // If user is owner or super_user, load all users
      if (['owner', 'super_user'].includes(userData.role)) {
        const allUsers = await User.list();
        setUsers(allUsers);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const canManageUsers = () => ['owner', 'super_user'].includes(currentUser?.role);
  const canEditUser = (user) => {
    return canManageUsers() || user.id === currentUser?.id;
  };

  const roleColors = {
    owner: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    viewer: 'bg-gray-100 text-gray-800',
    super_user: 'bg-red-100 text-red-800'
  };

  const roleDescriptions = {
    owner: 'Publisher owner with full access to everything. Can assign roles and manage account settings.',
    admin: 'Almost full access to manage the account but cannot assign roles or change account-wide settings.',
    viewer: 'Read-only level access. Users who need visibility into data but no editing capabilities.',
    super_user: 'Internal Kobo user with overall access to all publisher accounts.'
  };

  return (
    <div className="bg-white rounded-lg" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: '600' }}>
            Account Management
          </h1>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '12px', color: '#666666' }}>
              Role: {currentUser?.role || 'Loading...'}
            </span>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
              Contact Information
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowContactDialog(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label style={{ fontSize: '14px', color: '#666666' }}>Full Name</Label>
              <p style={{ fontSize: '16px', color: '#1a1a1a', marginTop: '4px' }}>
                {currentUser?.full_name || 'Not provided'}
              </p>
            </div>
            <div>
              <Label style={{ fontSize: '14px', color: '#666666' }}>Email</Label>
              <p style={{ fontSize: '16px', color: '#1a1a1a', marginTop: '4px' }}>
                {currentUser?.email || 'Not provided'}
              </p>
            </div>
            <div>
              <Label style={{ fontSize: '14px', color: '#666666' }}>Phone</Label>
              <p style={{ fontSize: '16px', color: '#1a1a1a', marginTop: '4px' }}>
                {currentUser?.contact_info?.phone || 'Not provided'}
              </p>
            </div>
            <div>
              <Label style={{ fontSize: '14px', color: '#666666' }}>Company</Label>
              <p style={{ fontSize: '16px', color: '#1a1a1a', marginTop: '4px' }}>
                {currentUser?.contact_info?.company || 'Not provided'}
              </p>
            </div>
            <div className="md:col-span-2">
              <Label style={{ fontSize: '14px', color: '#666666' }}>Address</Label>
              <p style={{ fontSize: '16px', color: '#1a1a1a', marginTop: '4px' }}>
                {currentUser?.contact_info?.address || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Role Information */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Your Role & Permissions
          </h2>
          <div className="flex items-start gap-4">
            <Badge className={`${roleColors[currentUser?.role]} text-sm font-medium px-3 py-1`}>
              {currentUser?.role?.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="flex-1">
              <p style={{ fontSize: '14px', color: '#666666' }}>
                {roleDescriptions[currentUser?.role]}
              </p>
              <div className="mt-3 space-y-1">
                {currentUser?.permissions?.manage_catalog && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    Catalog Management
                  </div>
                )}
                {currentUser?.permissions?.manage_pricing && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    Pricing Management
                  </div>
                )}
                {currentUser?.permissions?.manage_users && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    User Management
                  </div>
                )}
                {currentUser?.permissions?.export_data && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    Data Export
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        {canManageUsers() && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
                User Management
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Tip:</span> Use Workspace → Users to invite new team members
                </div>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setShowUserDialog(true);
                  }}
                  className="kobo-button-secondary flex items-center gap-2"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #bf0000',
                    color: '#bf0000',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Set Up New User
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-white border-gray-200 bg-gray-50">
                    <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px' }}>
                      User
                    </TableHead>
                    <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px' }}>
                      Role
                    </TableHead>
                    <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px' }}>
                      Account Access
                    </TableHead>
                    <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px' }}>
                      Last Active
                    </TableHead>
                    <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px' }}>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 border-gray-200">
                      <TableCell style={{ fontSize: '14px', color: '#1a1a1a', padding: '12px 16px' }}>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell style={{ padding: '12px 16px' }}>
                        <Badge className={`${roleColors[user.role]} font-medium`}>
                          {user.role?.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {user.account_holder_ids?.length || 1} accounts
                        </div>
                      </TableCell>
                      <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                        {user.updated_date ? new Date(user.updated_date).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell style={{ padding: '12px 16px' }}>
                        <div className="flex items-center gap-2">
                          {canEditUser(user) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setShowUserDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {canManageUsers() && user.id !== currentUser?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                if (confirm('Are you sure you want to remove this user?')) {
                                  await User.delete(user.id);
                                  loadData();
                                }
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {showUserDialog && (
          <UserRoleDialog
            user={editingUser}
            currentUser={currentUser}
            onClose={() => {
              setShowUserDialog(false);
              setEditingUser(null);
            }}
            onSave={loadData}
          />
        )}

        {showContactDialog && (
          <ContactInfoDialog
            user={currentUser}
            onClose={() => setShowContactDialog(false)}
            onSave={(updatedUser) => {
              setCurrentUser(updatedUser);
              setShowContactDialog(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
