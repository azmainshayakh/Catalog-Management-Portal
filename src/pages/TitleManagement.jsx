import React, { useState, useEffect } from "react";
import { Title } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search
} from "lucide-react";



import TitleCard from "../components/titles/TitleCard";
import TitleFilters from "../components/titles/TitleFilters";
import TitleForm from "../components/titles/TitleForm";
import BulkActions from "../components/titles/BulkActions";

export default function TitleManagement() {
  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTitle, setEditingTitle] = useState(null);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    genre: "all",
    visibility: "all"
  });

  useEffect(() => {
    loadTitles();
  }, []);

  useEffect(() => {
    filterTitles();
  }, [titles, searchQuery, filters]);

  const loadTitles = async () => {
    setIsLoading(true);
    const data = await Title.list("-created_date");
    setTitles(data);
    setIsLoading(false);
  };

  const filterTitles = () => {
    let filtered = titles;

    if (searchQuery) {
      filtered = filtered.filter(title => 
        title.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        title.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(title => title.status === filters.status);
    }

    if (filters.genre !== "all") {
      filtered = filtered.filter(title => title.genre === filters.genre);
    }

    if (filters.visibility !== "all") {
      filtered = filtered.filter(title => title.catalog_visibility === filters.visibility);
    }

    setFilteredTitles(filtered);
  };

  const handleSaveTitle = async (titleData) => {
    if (editingTitle) {
      await Title.update(editingTitle.id, titleData);
    } else {
      await Title.create(titleData);
    }
    setShowForm(false);
    setEditingTitle(null);
    loadTitles();
  };

  const handleStatusChange = async (titleId, newStatus) => {
    await Title.update(titleId, { status: newStatus });
    loadTitles();
  };

  const handleEdit = (title) => {
    setEditingTitle(title);
    setShowForm(true);
  };

  const toggleTitleSelection = (titleId) => {
    setSelectedTitles(prev => 
      prev.includes(titleId) 
        ? prev.filter(id => id !== titleId)
        : [...prev, titleId]
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Title Management
          </h1>
          <p className="text-slate-600 text-lg">
            Activate, manage, and track your catalog titles
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg hover-lift"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Title
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search titles, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl border-slate-200 focus:border-slate-400"
            />
          </div>
        </div>
        <TitleFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {selectedTitles.length > 0 && (
        <BulkActions 
          selectedCount={selectedTitles.length}
          onClearSelection={() => setSelectedTitles([])}
          onBulkAction={loadTitles}
          selectedTitles={selectedTitles}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTitles.map((title) => (
          <TitleCard
            key={title.id}
            title={title}
            selected={selectedTitles.includes(title.id)}
            onSelect={() => toggleTitleSelection(title.id)}
            onEdit={() => handleEdit(title)}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {showForm && (
        <TitleForm
          title={editingTitle}
          onSave={handleSaveTitle}
          onCancel={() => {
            setShowForm(false);
            setEditingTitle(null);
          }}
        />
      )}
    </div>
  );
}