"use client";

import { useState, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  FileText,
  SortAsc,
  SortDesc,
  RefreshCw
} from "lucide-react";
import Papa from 'papaparse';

interface GPSDataEntry {
  id: string;
  latitude: number;
  longitude: number;
  chainage: number;
  workType: string;
  status: string;
  comments?: string;
  entryDate: string;
  accuracy?: number;
  userId: string;
  userName?: string;
  projectId: string;
  projectName?: string;
}

interface FilterOptions {
  workType: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  accuracyMax: string;
  chainageMin: string;
  chainageMax: string;
}

interface DataViewerProps {
  data: GPSDataEntry[];
  onEdit?: (entry: GPSDataEntry) => void;
  onDelete?: (entryId: string) => void;
  onView?: (entry: GPSDataEntry) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

type SortField = 'entryDate' | 'chainage' | 'workType' | 'status' | 'accuracy';
type SortDirection = 'asc' | 'desc';

export default function DataViewer({
  data,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  isLoading = false
}: DataViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('entryDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState<FilterOptions>({
    workType: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    accuracyMax: '',
    chainageMin: '',
    chainageMax: ''
  });

  // Get unique values for filter dropdowns
  const uniqueWorkTypes = useMemo(() =>
    [...new Set(data.map(item => item.workType).filter(Boolean))], [data]
  );

  const uniqueStatuses = useMemo(() =>
    [...new Set(data.map(item => item.status).filter(Boolean))], [data]
  );

  // Filter and sort data
  const filteredData = useMemo(() => {
    const filtered = data.filter(entry => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        entry.workType?.toLowerCase().includes(searchLower) ||
        entry.status?.toLowerCase().includes(searchLower) ||
        entry.comments?.toLowerCase().includes(searchLower) ||
        entry.userName?.toLowerCase().includes(searchLower) ||
        entry.projectName?.toLowerCase().includes(searchLower);

      // Work type filter
      const matchesWorkType = !filters.workType || entry.workType === filters.workType;

      // Status filter
      const matchesStatus = !filters.status || entry.status === filters.status;

      // Date range filter
      const entryDate = new Date(entry.entryDate);
      const matchesDateFrom = !filters.dateFrom || entryDate >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || entryDate <= new Date(filters.dateTo);

      // Accuracy filter
      const matchesAccuracy = !filters.accuracyMax ||
        !entry.accuracy || entry.accuracy <= Number.parseFloat(filters.accuracyMax);

      // Chainage range filter
      const matchesChainageMin = !filters.chainageMin ||
        entry.chainage >= Number.parseFloat(filters.chainageMin);
      const matchesChainageMax = !filters.chainageMax ||
        entry.chainage <= Number.parseFloat(filters.chainageMax);

      return matchesSearch && matchesWorkType && matchesStatus &&
             matchesDateFrom && matchesDateTo && matchesAccuracy &&
             matchesChainageMin && matchesChainageMax;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'entryDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntries(paginatedData.map(entry => entry.id));
    } else {
      setSelectedEntries([]);
    }
  };

  const handleSelectEntry = (entryId: string, checked: boolean) => {
    if (checked) {
      setSelectedEntries(prev => [...prev, entryId]);
    } else {
      setSelectedEntries(prev => prev.filter(id => id !== entryId));
    }
  };

  const exportToCSV = (entries: GPSDataEntry[] = filteredData) => {
    const csvData = entries.map(entry => ({
      'Entry Date': new Date(entry.entryDate).toLocaleString(),
      'Latitude': entry.latitude,
      'Longitude': entry.longitude,
      'Chainage (km)': entry.chainage,
      'Work Type': entry.workType,
      'Status': entry.status,
      'Accuracy (m)': entry.accuracy || 'N/A',
      'Comments': entry.comments || '',
      'User': entry.userName || '',
      'Project': entry.projectName || ''
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gps_data_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportSelected = () => {
    const selectedData = filteredData.filter(entry => selectedEntries.includes(entry.id));
    exportToCSV(selectedData);
  };

  const clearFilters = () => {
    setFilters({
      workType: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      accuracyMax: '',
      chainageMin: '',
      chainageMax: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default';
      case 'IN_PROGRESS': return 'secondary';
      case 'INSPECTION_REQUIRED': return 'destructive';
      case 'APPROVED': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              GPS Data Viewer
            </CardTitle>
            <CardDescription>
              Advanced search, filter, and export GPS data entries
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onRefresh && (
              <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
            <Button variant="outline" onClick={() => exportToCSV()}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search GPS entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="workType">Work Type</Label>
                    <Select value={filters.workType} onValueChange={(value) =>
                      setFilters(prev => ({ ...prev, workType: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        {uniqueWorkTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={filters.status} onValueChange={(value) =>
                      setFilters(prev => ({ ...prev, status: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        {uniqueStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateFrom">Date From</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateTo">Date To</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="accuracyMax">Max Accuracy (m)</Label>
                    <Input
                      id="accuracyMax"
                      type="number"
                      placeholder="e.g., 10"
                      value={filters.accuracyMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, accuracyMax: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="chainageMin">Min Chainage (km)</Label>
                    <Input
                      id="chainageMin"
                      type="number"
                      step="0.001"
                      placeholder="e.g., 0.000"
                      value={filters.chainageMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, chainageMin: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="chainageMax">Max Chainage (km)</Label>
                    <Input
                      id="chainageMax"
                      type="number"
                      step="0.001"
                      placeholder="e.g., 10.000"
                      value={filters.chainageMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, chainageMax: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {paginatedData.length} of {filteredData.length} entries
            {filteredData.length !== data.length && ` (filtered from ${data.length} total)`}
          </div>

          {selectedEntries.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedEntries.length} selected</span>
              <Button size="sm" variant="outline" onClick={exportSelected}>
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedEntries.length === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('entryDate')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortField === 'entryDate' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('chainage')}
                >
                  <div className="flex items-center gap-1">
                    Chainage
                    {sortField === 'chainage' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('workType')}
                >
                  <div className="flex items-center gap-1">
                    Work Type
                    {sortField === 'workType' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('accuracy')}
                >
                  <div className="flex items-center gap-1">
                    Accuracy
                    {sortField === 'accuracy' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedEntries.includes(entry.id)}
                      onCheckedChange={(checked) => handleSelectEntry(entry.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(entry.entryDate).toLocaleDateString()}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {new Date(entry.entryDate).toLocaleTimeString()}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {entry.latitude.toFixed(6)}
                    <br />
                    {entry.longitude.toFixed(6)}
                  </TableCell>
                  <TableCell>{entry.chainage.toFixed(3)} km</TableCell>
                  <TableCell>{entry.workType}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(entry.status)}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {entry.accuracy ? `±${entry.accuracy.toFixed(1)}m` : 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {entry.comments}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {onView && (
                        <Button size="sm" variant="ghost" onClick={() => onView(entry)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button size="sm" variant="ghost" onClick={() => onEdit(entry)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(entry.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="pageSize">Rows per page:</Label>
              <Select value={pageSize.toString()} onValueChange={(value) => {
                setPageSize(Number.parseInt(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredData.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No GPS data found</h3>
            <p className="text-gray-600">
              {searchTerm || Object.values(filters).some(f => f) ?
                'Try adjusting your search criteria or filters.' :
                'Start by adding some GPS data entries.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
