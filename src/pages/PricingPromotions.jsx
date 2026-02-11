import React, { useState, useEffect } from 'react';
import { Title, PriceRule, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Tag, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import PricingDialog from "../components/pricing/PricingDialog";

export default function PricingPromotions() {
  const [titles, setTitles] = useState([]);
  const [allPriceRules, setAllPriceRules] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedTitleIds, setSelectedTitleIds] = useState([]);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [regionFilter, setRegionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("titles"); // 'titles' or 'rules'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [titlesData, priceRulesData, userData] = await Promise.all([
        Title.list("-created_date"),
        PriceRule.list("-created_date"),
        User.me()
      ]);
      setTitles(titlesData);
      setAllPriceRules(priceRulesData);
      setFilteredTitles(titlesData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    let results = titles;
    if (regionFilter !== "all") {
      results = results.filter(t => t.region === regionFilter);
    }
    if (searchQuery) {
      results = results.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTitles(results);
    setCurrentPage(1);
  }, [titles, regionFilter, searchQuery]);

  const canManagePricing = () => user?.permissions?.manage_pricing || ['owner', 'admin', 'super_user'].includes(user?.role);

  const handleSelectTitle = (titleId) => {
    setSelectedTitleIds(prev => 
      prev.includes(titleId) 
        ? prev.filter(id => id !== titleId)
        : [...prev, titleId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedTitleIds.length === currentItems.length) {
      setSelectedTitleIds([]);
    } else {
      setSelectedTitleIds(currentItems.map(t => t.id));
    }
  };

  const paginatedItems = view === 'titles' ? filteredTitles : allPriceRules.filter(r => regionFilter === 'all' || r.region === regionFilter);
  const totalPages = Math.ceil(paginatedItems.length / itemsPerPage);
  const currentItems = paginatedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderTitleView = () => (
    <>
      {selectedTitleIds.length > 0 && canManagePricing() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">{selectedTitleIds.length} titles selected</span>
          <button
            onClick={() => {
              setEditingRule(null);
              setShowPricingDialog(true);
            }}
            className="kobo-button-primary flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            Set Price / Promotion
          </button>
        </div>
      )}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white border-gray-200 bg-gray-50">
              <TableHead style={{width: '40px'}}>
                <Checkbox
                  checked={selectedTitleIds.length > 0 && selectedTitleIds.length === currentItems.length}
                  onCheckedChange={handleSelectAll}
                  disabled={!canManagePricing()}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Active Promotions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((title) => (
              <TableRow key={title.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTitleIds.includes(title.id)}
                    onCheckedChange={() => handleSelectTitle(title.id)}
                    disabled={!canManagePricing()}
                  />
                </TableCell>
                <TableCell className="font-medium kobo-text-primary">{title.title}</TableCell>
                <TableCell className="kobo-text-secondary">{title.author}</TableCell>
                <TableCell className="kobo-text-secondary">{title.price ? `${title.currency} ${title.price.toFixed(2)}` : '-'}</TableCell>
                <TableCell className="kobo-text-secondary capitalize">{title.region}</TableCell>
                <TableCell className="kobo-text-secondary">
                  {allPriceRules.filter(r => r.title_id === title.id && r.is_promotional).length}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      setEditingRule(null);
                      setSelectedTitleIds([title.id]);
                      setShowPricingDialog(true);
                    }}
                    className="kobo-button-secondary py-1 px-3 text-xs"
                    disabled={!canManagePricing()}
                  >
                    Set Price
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );

  const renderRulesView = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
            <TableRow className="hover:bg-white border-gray-200 bg-gray-50">
              <TableHead>Title</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((rule) => {
            const title = titles.find(t => t.id === rule.title_id);
            return (
              <TableRow key={rule.id}>
                <TableCell className="font-medium kobo-text-primary max-w-xs truncate" title={title?.title}>{title?.title || 'Unknown Title'}</TableCell>
                <TableCell className="kobo-text-secondary capitalize">{rule.region}</TableCell>
                <TableCell className="kobo-text-primary font-semibold">{`${rule.currency} ${rule.price.toFixed(2)}`}</TableCell>
                <TableCell className="kobo-text-secondary text-xs">
                  {new Date(rule.start_date).toLocaleDateString()} - {rule.end_date ? new Date(rule.end_date).toLocaleDateString() : 'Ongoing'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rule.is_promotional ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rule.is_promotional ? 'Promotional' : 'Regular'}
                  </span>
                </TableCell>
                <TableCell>
                  {canManagePricing() && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingRule(rule); setShowPricingDialog(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={async () => { await PriceRule.delete(rule.id); loadData(); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
  
  return (
    <div className="bg-white rounded-lg" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold kobo-text-primary">Pricing & Promotions</h1>
          {canManagePricing() && (
             <button
                onClick={() => {
                  setEditingRule(null);
                  setSelectedTitleIds([]);
                  setShowPricingDialog(true);
                }}
                className="kobo-button-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Price Rule
              </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                className={`px-4 py-2 text-sm rounded-l-md ${view === 'titles' ? 'bg-gray-200 font-semibold' : 'bg-white'}`}
                onClick={() => setView('titles')}
              >
                View by Title
              </button>
              <button 
                className={`px-4 py-2 text-sm rounded-r-md ${view === 'rules' ? 'bg-gray-200 font-semibold' : 'bg-white'}`}
                onClick={() => setView('rules')}
              >
                View All Rules
              </button>
            </div>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-48 h-10 border-gray-300">
                <SelectValue placeholder="Filter by Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
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
            {view === 'titles' && (
              <Input 
                placeholder="Search titles..." 
                className="w-64 h-10 border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
          </div>
        </div>

        {view === 'titles' ? renderTitleView() : renderRulesView()}

        <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: '14px', color: '#666666' }}>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {showPricingDialog && (
        <PricingDialog
          allTitles={titles}
          selectedTitleIds={selectedTitleIds}
          editingRule={editingRule}
          onClose={() => {
            setShowPricingDialog(false);
            setEditingRule(null);
            setSelectedTitleIds([]);
          }}
          onSave={() => {
            loadData();
            setShowPricingDialog(false);
            setEditingRule(null);
            setSelectedTitleIds([]);
          }}
        />
      )}
    </div>
  );
}