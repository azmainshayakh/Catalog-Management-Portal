import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
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
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Download, Settings, Eye } from "lucide-react";
import { format } from "date-fns";

import BulkActionsPanel from "../components/catalog/BulkActionsPanel";
import OptInOutDialog from "../components/catalog/OptInOutDialog";
import MetadataUpdateDialog from "../components/catalog/MetadataUpdateDialog";

export default function CatalogManagement() {
  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOptInOut, setShowOptInOut] = useState(false);
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState({
    account_id: true,
    isbn: true,
    title: true,
    subtitle: true,
    contributors: true,
    publisher: true,
    imprint: true,
    series: true,
    activation_date: true,
    publication_date: true,
    last_modified: true,
    countries_included: true,
    countries_excluded: true,
    status: true,
    language: true,
    category_type: true,
    category_code: true,
    pre_order_status: true, // New column for pre-order status
    kobo_plus: true,        // New column for K+
    prices: true
  });
  const titlesPerPage = 50;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [titlesData, userData] = await Promise.all([
        base44.entities.Title.list("-created_date"),
        base44.auth.me()
      ]);
      setTitles(titlesData);
      setFilteredTitles(titlesData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let results = titles;

    if (statusFilter !== "all") {
      results = results.filter(t => t.status === statusFilter);
    }

    if (regionFilter !== "all") {
      results = results.filter(t => t.region === regionFilter);
    }

    if (languageFilter !== "all") {
      results = results.filter(t => t.language === languageFilter);
    }

    if (searchQuery) {
      results = results.filter(t =>
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.isbn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.publisher?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTitles(results);
    setCurrentPage(1);
  }, [statusFilter, regionFilter, languageFilter, searchQuery, titles]);

  const handleToggle = async (titleId, field, value) => {
    if (!canManageCatalog()) return;

    const originalTitles = [...titles];
    const updatedTitles = titles.map(t =>
      t.id === titleId ? { ...t, [field]: value } : t
    );
    setTitles(updatedTitles);

    try {
      await base44.entities.Title.update(titleId, { [field]: value });
    } catch (error) {
      console.error("Failed to update title:", error);
      setTitles(originalTitles);
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (!canManageCatalog() || selectedTitles.length === 0) return;

    const updates = selectedTitles.map(titleId =>
      base44.entities.Title.update(titleId, {
        status: newStatus,
        activation_date: newStatus === 'active' ? new Date().toISOString().split('T')[0] : undefined,
        last_modified: new Date().toISOString()
      })
    );

    await Promise.all(updates);
    setSelectedTitles([]);
    loadData();
  };

  const handleSelectTitle = (titleId) => {
    setSelectedTitles(prev =>
      prev.includes(titleId)
        ? prev.filter(id => id !== titleId)
        : [...prev, titleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTitles.length === currentTitles.length) {
      setSelectedTitles([]);
    } else {
      setSelectedTitles(currentTitles.map(t => t.id));
    }
  };

  const exportToCsv = () => {
    if (!canExportData()) return;

    const csvData = filteredTitles.map(title => ({
      'Account ID': title.account_id || '',
      'ISBN': title.isbn || '',
      'Title': title.title || '',
      'Subtitle': title.subtitle || '',
      'Contributors': title.contributors?.map(c => `${c.name} (${c.role})`).join('; ') || '',
      'Author': title.author || '',
      'Publisher': title.publisher || '',
      'Imprint': title.imprint || '',
      'Series': title.series_name || '',
      'Series Number': title.series_number || '', // Keep for now as it's in the export, but removed from table
      'Activation Date': title.activation_date || '',
      'Publication Date': title.publication_date || '',
      'Last Modified': title.last_modified || '',
      'Countries Included': title.countries_included?.join('; ') || '',
      'Countries Excluded': title.countries_excluded?.join('; ') || '',
      'Publishing Status': title.status || '',
      'Language': title.language || '',
      'Category Type': title.category_type || '',
      'Category Code': title.category_code || '',
      'Is Preorder': title.is_preorder ? 'Yes' : 'No', // Keep for now as it's in the export
      'Prices': title.prices?.map(p => `${p.currency} ${p.amount} (${p.region})`).join('; ') || '',
      'Pre-Order': title.pre_order_enabled ? 'Yes' : 'No', // New pre-order field
      'Preview': title.preview_enabled ? 'Yes' : 'No',
      'K+': title.kobo_plus_enabled ? 'Yes' : 'No', // New K+ field
      'Annotation Export': title.annotation_export_enabled ? 'Yes' : 'No',
      'AI Recaps': title.ai_recaps_enabled ? 'Yes' : 'No',
      'Sales Count': title.sales_count || 0,
      'Revenue': title.revenue || 0
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `catalog_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canManageCatalog = () => user?.permissions?.manage_catalog || ['owner', 'admin', 'super_user'].includes(user?.role);
  const canExportData = () => user?.permissions?.export_data || ['owner', 'admin', 'super_user'].includes(user?.role);

  const indexOfLastTitle = currentPage * titlesPerPage;
  const indexOfFirstTitle = indexOfLastTitle - titlesPerPage;
  const currentTitles = filteredTitles.slice(indexOfFirstTitle, indexOfLastTitle);
  const totalPages = Math.ceil(filteredTitles.length / titlesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatContributors = (contributors) => {
    if (!contributors || contributors.length === 0) return '';
    return contributors.map(c => `${c.name} (${c.role})`).join(', ');
  };

  const formatPrices = (prices) => {
    if (!prices || prices.length === 0) return '';
    return prices.map(p => `${p.currency} ${p.amount}`).join(', ');
  };

  const formatCountries = (countries) => {
    if (!countries || countries.length === 0) return '';
    return countries.join(', ');
  };

  return (
    <div className="bg-white rounded-lg" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: '600' }}>
            Catalog Management
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              // onClick={() => setShowColumnsDialog(true)} // This function is not defined. Assuming it's for column visibility settings.
              // For now, I'll comment it out or you can add a placeholder dialog/state for it if needed.
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Columns
            </Button>
            <span style={{ fontSize: '12px', color: '#666666' }}>
              Role: {user?.role || 'Loading...'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 h-10 border-gray-300" style={{ fontSize: '14px', borderRadius: '4px' }}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-48 h-10 border-gray-300" style={{ fontSize: '14px', borderRadius: '4px' }}>
                <SelectValue placeholder="Region" />
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

            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-48 h-10 border-gray-300" style={{ fontSize: '14px', borderRadius: '4px' }}>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search by title, author, ISBN, publisher..."
              className="w-80 h-10 border-gray-300"
              style={{ fontSize: '14px', borderRadius: '4px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            {canExportData() && (
              <button
                onClick={exportToCsv}
                className="kobo-button-primary flex items-center gap-2"
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
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
            {canManageCatalog() && (
              <button
                onClick={() => setShowOptInOut(true)}
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
                <Settings className="w-4 h-4" />
                Opt In / Out
              </button>
            )}
          </div>
        </div>

        {selectedTitles.length > 0 && canManageCatalog() && (
          <BulkActionsPanel
            selectedCount={selectedTitles.length}
            onBulkStatusChange={handleBulkStatusChange}
            onClearSelection={() => setSelectedTitles([])}
            onBulkMetadataUpdate={() => setShowMetadataDialog(true)}
          />
        )}

        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white border-gray-200 bg-gray-50">
                <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', width: '40px' }}>
                  {canManageCatalog() && (
                    <Checkbox
                      checked={selectedTitles.length === currentTitles.length && currentTitles.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  )}
                </TableHead>
                {visibleColumns.account_id && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '120px' }}>Account ID</TableHead>}
                {visibleColumns.isbn && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '140px' }}>ISBN</TableHead>}
                {visibleColumns.title && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '200px' }}>Title</TableHead>}
                {visibleColumns.subtitle && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '150px' }}>Subtitle</TableHead>}
                {visibleColumns.contributors && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '200px' }}>Contributors</TableHead>}
                {visibleColumns.publisher && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '150px' }}>Publisher</TableHead>}
                {visibleColumns.imprint && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '120px' }}>Imprint</TableHead>}
                {visibleColumns.series && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '150px' }}>Series</TableHead>}
                {visibleColumns.activation_date && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '130px' }}>Activation Date</TableHead>}
                {visibleColumns.publication_date && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '130px' }}>Publication Date</TableHead>}
                {visibleColumns.last_modified && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '130px' }}>Last Modified</TableHead>}
                {visibleColumns.countries_included && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '150px' }}>Countries Included</TableHead>}
                {visibleColumns.countries_excluded && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '150px' }}>Countries Excluded</TableHead>}
                {visibleColumns.status && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '120px' }}>Publishing Status</TableHead>}
                {visibleColumns.language && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '100px' }}>Language</TableHead>}
                {visibleColumns.category_type && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '120px' }}>Category Type</TableHead>}
                {visibleColumns.category_code && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '120px' }}>Category Code</TableHead>}
                {visibleColumns.pre_order_status && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '120px' }}>Pre-Order</TableHead>}
                {visibleColumns.kobo_plus && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '100px' }}>K+</TableHead>}
                {visibleColumns.prices && <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '150px' }}>Prices</TableHead>}
                <TableHead style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', padding: '12px 16px', minWidth: '100px' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTitles.map((title) => (
                <TableRow key={title.id} className="hover:bg-gray-50 border-gray-200">
                  <TableCell style={{ padding: '12px 16px' }}>
                    {canManageCatalog() && (
                      <Checkbox
                        checked={selectedTitles.includes(title.id)}
                        onCheckedChange={() => handleSelectTitle(title.id)}
                      />
                    )}
                  </TableCell>
                  {visibleColumns.account_id && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                      {title.account_id || '-'}
                    </TableCell>
                  )}
                  {visibleColumns.isbn && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                      {title.isbn || '-'}
                    </TableCell>
                  )}
                  {visibleColumns.title && (
                    <TableCell style={{ fontSize: '14px', color: '#1a1a1a', padding: '12px 16px', maxWidth: '200px' }}>
                      <div className="truncate" title={title.title}>{title.title}</div>
                    </TableCell>
                  )}
                  {visibleColumns.subtitle && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px', maxWidth: '150px' }}>
                      <div className="truncate" title={title.subtitle}>{title.subtitle || '-'}</div>
                    </TableCell>
                  )}
                  {visibleColumns.contributors && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px', maxWidth: '200px' }}>
                      <div className="truncate" title={formatContributors(title.contributors)}>
                        {formatContributors(title.contributors) || title.author || '-'}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.publisher && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px', maxWidth: '150px' }}>
                      <div className="truncate" title={title.publisher}>{title.publisher || '-'}</div>
                    </TableCell>
                  )}
                  {visibleColumns.imprint && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                      {title.imprint || '-'}
                    </TableCell>
                  )}
                  {visibleColumns.series && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px', maxWidth: '150px' }}>
                      <div className="truncate" title={title.series_name}>{title.series_name || '-'}</div>
                    </TableCell>
                  )}
                  {visibleColumns.activation_date && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                      {title.activation_date ? format(new Date(title.activation_date), 'MMM d, yyyy') : '-'}
                    </TableCell>
                  )}
                  {visibleColumns.publication_date && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                      {title.publication_date ? format(new Date(title.publication_date), 'MMM d, yyyy') : '-'}
                    </TableCell>
                  )}
                  {visibleColumns.last_modified && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                      {title.last_modified ? format(new Date(title.last_modified), 'MMM d, yyyy') : '-'}
                    </TableCell>
                  )}
                  {visibleColumns.countries_included && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px', maxWidth: '150px' }}>
                      <div className="truncate" title={formatCountries(title.countries_included)}>
                        {formatCountries(title.countries_included) || '-'}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.countries_excluded && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px', maxWidth: '150px' }}>
                      <div className="truncate" title={formatCountries(title.countries_excluded)}>
                        {formatCountries(title.countries_excluded) || '-'}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell style={{ fontSize: '14px', color: '#1a1a1a', padding: '12px 16px' }}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        title.status === 'active' ? 'bg-green-100 text-green-800' :
                        title.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {title.status}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.language && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                      {title.language || '-'}
                    </TableCell>
                  )}
                  {visibleColumns.category_type && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                      {title.category_type || '-'}
                    </TableCell>
                  )}
                  {visibleColumns.category_code && (
                    <TableCell style={{ fontSize: '14px', color: '#666666', padding: '12px 16px' }}>
                      {title.category_code || '-'}
                    </TableCell>
                  )}
                  {visibleColumns.pre_order_status && (
                    <TableCell style={{ padding: '12px 16px' }}>
                      <Switch
                        checked={title.pre_order_enabled}
                        onCheckedChange={(checked) => handleToggle(title.id, 'pre_order_enabled', checked)}
                        disabled={!canManageCatalog()}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.kobo_plus && (
                    <TableCell style={{ padding: '12px 16px' }}>
                      <Switch
                        checked={title.kobo_plus_enabled}
                        onCheckedChange={(checked) => handleToggle(title.id, 'kobo_plus_enabled', checked)}
                        disabled={!canManageCatalog()}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.prices && (
                    <TableCell style={{ fontSize: '14px', color: '#1a1a1a', padding: '12px 16px', maxWidth: '150px' }}>
                      <div className="truncate" title={formatPrices(title.prices)}>
                        {formatPrices(title.prices) || (title.price ? `${title.currency || 'USD'} ${title.price.toFixed(2)}` : '-')}
                      </div>
                    </TableCell>
                  )}
                  <TableCell style={{ padding: '12px 16px' }}>
                    {canManageCatalog() && (
                      <a
                        href="#"
                        style={{
                          color: '#666666',
                          textDecoration: 'underline',
                          fontSize: '14px'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#1a1a1a'}
                        onMouseOut={(e) => e.target.style.color = '#666666'}
                      >
                        Edit
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: '14px', color: '#666666' }}>
            {`${indexOfFirstTitle + 1}-${Math.min(indexOfLastTitle, filteredTitles.length)} of ${filteredTitles.length}`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ fontSize: '14px', color: '#666666', minWidth: '32px', height: '32px' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span style={{ fontSize: '14px', color: '#1a1a1a', padding: '0 8px' }}>
              {currentPage}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ fontSize: '14px', color: '#666666', minWidth: '32px', height: '32px' }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {showOptInOut && (
        <OptInOutDialog
          titles={selectedTitles.length > 0 ? titles.filter(t => selectedTitles.includes(t.id)) : titles}
          onClose={() => setShowOptInOut(false)}
          onSave={loadData}
        />
      )}

      {showMetadataDialog && (
        <MetadataUpdateDialog
          selectedTitleIds={selectedTitles}
          onClose={() => setShowMetadataDialog(false)}
          onSave={() => {
            loadData();
            setSelectedTitles([]);
          }}
        />
      )}
    </div>
  );
}