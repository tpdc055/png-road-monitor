"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import jsPDF from "jspdf";
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  Settings,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import * as XLSX from "xlsx";

interface Project {
  id: string;
  name: string;
  location: string;
  province: string;
  contractor: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  totalDistance?: number;
  completedDistance?: number;
}

interface GPSEntry {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  projectId: string;
  timestamp: string;
  taskName?: string;
  workType?: string;
}

interface FinancialEntry {
  id: string;
  projectId: string;
  category: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  vendor: string;
}

interface DataExportProps {
  projects?: Project[];
  gpsEntries?: GPSEntry[];
  financialEntries?: FinancialEntry[];
  selectedProject?: Project | null;
}

interface ExportOptions {
  includeProjects: boolean;
  includeGPS: boolean;
  includeFinancial: boolean;
  includeAnalytics: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  format: "pdf" | "excel" | "both";
}

export default function DataExportComponent({
  projects = [],
  gpsEntries = [],
  financialEntries = [],
  selectedProject,
}: DataExportProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeProjects: true,
    includeGPS: true,
    includeFinancial: true,
    includeAnalytics: true,
    dateRange: {
      start: "2024-01-01",
      end: new Date().toISOString().split("T")[0],
    },
    format: "pdf",
  });

  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PG", {
      style: "currency",
      currency: "PGK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generatePDFReport = async () => {
    const pdf = new jsPDF();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.text("PNG Road Construction Monitor Report", 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;

    if (selectedProject) {
      pdf.text(`Project: ${selectedProject.name}`, 20, yPosition);
      yPosition += 10;
    }

    yPosition += 10;

    // Projects Summary
    if (exportOptions.includeProjects) {
      pdf.setFontSize(16);
      pdf.text("Project Summary", 20, yPosition);
      yPosition += 10;

      const projectsToExport = selectedProject ? [selectedProject] : projects;

      projectsToExport.forEach((project, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.text(`${index + 1}. ${project.name}`, 20, yPosition);
        yPosition += 7;

        pdf.setFontSize(10);
        pdf.text(`Location: ${project.location}`, 25, yPosition);
        yPosition += 5;
        pdf.text(`Status: ${project.status}`, 25, yPosition);
        yPosition += 5;
        pdf.text(`Progress: ${project.progress}%`, 25, yPosition);
        yPosition += 5;
        pdf.text(`Budget: ${formatCurrency(project.budget)}`, 25, yPosition);
        yPosition += 5;
        pdf.text(`Spent: ${formatCurrency(project.spent)}`, 25, yPosition);
        yPosition += 5;
        pdf.text(`Contractor: ${project.contractor}`, 25, yPosition);
        yPosition += 10;
      });
    }

    // GPS Data
    if (exportOptions.includeGPS && gpsEntries.length > 0) {
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.text("GPS Tracking Data", 20, yPosition);
      yPosition += 10;

      const filteredGPS = selectedProject
        ? gpsEntries.filter((entry) => entry.projectId === selectedProject.id)
        : gpsEntries;

      filteredGPS.slice(0, 10).forEach((entry, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(10);
        pdf.text(
          `${index + 1}. ${entry.description || "GPS Point"}`,
          20,
          yPosition,
        );
        yPosition += 5;
        pdf.text(
          `Coordinates: ${entry.latitude.toFixed(6)}, ${entry.longitude.toFixed(6)}`,
          25,
          yPosition,
        );
        yPosition += 5;
        pdf.text(
          `Date: ${new Date(entry.timestamp).toLocaleDateString()}`,
          25,
          yPosition,
        );
        yPosition += 5;
        if (entry.taskName) {
          pdf.text(`Task: ${entry.taskName}`, 25, yPosition);
          yPosition += 5;
        }
        yPosition += 3;
      });
    }

    // Financial Data
    if (exportOptions.includeFinancial && financialEntries.length > 0) {
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.text("Financial Summary", 20, yPosition);
      yPosition += 10;

      const filteredFinancial = selectedProject
        ? financialEntries.filter(
            (entry) => entry.projectId === selectedProject.id,
          )
        : financialEntries;

      const totalExpenses = filteredFinancial.reduce(
        (sum, entry) => sum + entry.amount,
        0,
      );

      pdf.setFontSize(12);
      pdf.text(
        `Total Expenses: ${formatCurrency(totalExpenses)}`,
        20,
        yPosition,
      );
      yPosition += 10;

      filteredFinancial.slice(0, 15).forEach((entry, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(10);
        pdf.text(`${index + 1}. ${entry.description}`, 20, yPosition);
        yPosition += 5;
        pdf.text(`Amount: ${formatCurrency(entry.amount)}`, 25, yPosition);
        yPosition += 5;
        pdf.text(`Category: ${entry.category}`, 25, yPosition);
        yPosition += 5;
        pdf.text(`Date: ${entry.date}`, 25, yPosition);
        yPosition += 8;
      });
    }

    // Analytics
    if (exportOptions.includeAnalytics) {
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.text("Analytics Summary", 20, yPosition);
      yPosition += 10;

      const projectsToAnalyze = selectedProject ? [selectedProject] : projects;
      const totalBudget = projectsToAnalyze.reduce(
        (sum, p) => sum + p.budget,
        0,
      );
      const totalSpent = projectsToAnalyze.reduce((sum, p) => sum + p.spent, 0);
      const avgProgress =
        projectsToAnalyze.reduce((sum, p) => sum + p.progress, 0) /
        projectsToAnalyze.length;
      const activeProjects = projectsToAnalyze.filter(
        (p) => p.status === "ACTIVE",
      ).length;

      pdf.setFontSize(12);
      pdf.text(`Total Projects: ${projectsToAnalyze.length}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Active Projects: ${activeProjects}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Total Budget: ${formatCurrency(totalBudget)}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Total Spent: ${formatCurrency(totalSpent)}`, 20, yPosition);
      yPosition += 7;
      pdf.text(
        `Budget Utilization: ${((totalSpent / totalBudget) * 100).toFixed(1)}%`,
        20,
        yPosition,
      );
      yPosition += 7;
      pdf.text(`Average Progress: ${avgProgress.toFixed(1)}%`, 20, yPosition);
    }

    // Save PDF
    const fileName = selectedProject
      ? `${selectedProject.name.replace(/[^a-z0-9]/gi, "_")}_report.pdf`
      : `PNG_Road_Construction_Report_${new Date().toISOString().split("T")[0]}.pdf`;

    pdf.save(fileName);
  };

  const generateExcelReport = () => {
    const workbook = XLSX.utils.book_new();

    // Projects Sheet
    if (exportOptions.includeProjects) {
      const projectsToExport = selectedProject ? [selectedProject] : projects;
      const projectsData = projectsToExport.map((project) => ({
        "Project ID": project.id,
        "Project Name": project.name,
        Location: project.location,
        Province: project.province,
        Status: project.status,
        "Progress (%)": project.progress,
        "Budget (PGK)": project.budget,
        "Spent (PGK)": project.spent,
        "Budget Utilization (%)": (
          (project.spent / project.budget) *
          100
        ).toFixed(1),
        Contractor: project.contractor,
        "Start Date": project.startDate,
        "End Date": project.endDate,
        "Total Distance (km)": project.totalDistance || "N/A",
        "Completed Distance (km)": project.completedDistance || "N/A",
      }));

      const projectsSheet = XLSX.utils.json_to_sheet(projectsData);
      XLSX.utils.book_append_sheet(workbook, projectsSheet, "Projects");
    }

    // GPS Data Sheet
    if (exportOptions.includeGPS && gpsEntries.length > 0) {
      const filteredGPS = selectedProject
        ? gpsEntries.filter((entry) => entry.projectId === selectedProject.id)
        : gpsEntries;

      const gpsData = filteredGPS.map((entry) => ({
        "Entry ID": entry.id,
        "Project ID": entry.projectId,
        Latitude: entry.latitude,
        Longitude: entry.longitude,
        Description: entry.description,
        "Task Name": entry.taskName || "N/A",
        "Work Type": entry.workType || "N/A",
        Timestamp: new Date(entry.timestamp).toLocaleString(),
        Date: new Date(entry.timestamp).toLocaleDateString(),
      }));

      const gpsSheet = XLSX.utils.json_to_sheet(gpsData);
      XLSX.utils.book_append_sheet(workbook, gpsSheet, "GPS_Data");
    }

    // Financial Data Sheet
    if (exportOptions.includeFinancial && financialEntries.length > 0) {
      const filteredFinancial = selectedProject
        ? financialEntries.filter(
            (entry) => entry.projectId === selectedProject.id,
          )
        : financialEntries;

      const financialData = filteredFinancial.map((entry) => ({
        "Entry ID": entry.id,
        "Project ID": entry.projectId,
        Category: entry.category,
        Type: entry.type,
        "Amount (PGK)": entry.amount,
        Description: entry.description,
        Date: entry.date,
        Vendor: entry.vendor,
      }));

      const financialSheet = XLSX.utils.json_to_sheet(financialData);
      XLSX.utils.book_append_sheet(workbook, financialSheet, "Financial_Data");
    }

    // Analytics Sheet
    if (exportOptions.includeAnalytics) {
      const projectsToAnalyze = selectedProject ? [selectedProject] : projects;
      const analyticsData = [
        { Metric: "Total Projects", Value: projectsToAnalyze.length },
        {
          Metric: "Active Projects",
          Value: projectsToAnalyze.filter((p) => p.status === "ACTIVE").length,
        },
        {
          Metric: "Planning Projects",
          Value: projectsToAnalyze.filter((p) => p.status === "PLANNING")
            .length,
        },
        {
          Metric: "On Hold Projects",
          Value: projectsToAnalyze.filter((p) => p.status === "ON_HOLD").length,
        },
        {
          Metric: "Total Budget (PGK)",
          Value: projectsToAnalyze.reduce((sum, p) => sum + p.budget, 0),
        },
        {
          Metric: "Total Spent (PGK)",
          Value: projectsToAnalyze.reduce((sum, p) => sum + p.spent, 0),
        },
        {
          Metric: "Average Progress (%)",
          Value: (
            projectsToAnalyze.reduce((sum, p) => sum + p.progress, 0) /
            projectsToAnalyze.length
          ).toFixed(1),
        },
        { Metric: "Total GPS Entries", Value: gpsEntries.length },
        { Metric: "Total Financial Entries", Value: financialEntries.length },
      ];

      const analyticsSheet = XLSX.utils.json_to_sheet(analyticsData);
      XLSX.utils.book_append_sheet(workbook, analyticsSheet, "Analytics");
    }

    // Save Excel file
    const fileName = selectedProject
      ? `${selectedProject.name.replace(/[^a-z0-9]/gi, "_")}_data.xlsx`
      : `PNG_Road_Construction_Data_${new Date().toISOString().split("T")[0]}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (exportOptions.format === "pdf") {
        await generatePDFReport();
      } else if (exportOptions.format === "excel") {
        generateExcelReport();
      } else if (exportOptions.format === "both") {
        await generatePDFReport();
        generateExcelReport();
      }
    } catch (error) {
      console.error("Export failed:", error);
    }

    setIsExporting(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Export & Reports
        </CardTitle>
        <p className="text-sm text-gray-600">
          Generate comprehensive reports and export project data in PDF or Excel
          format
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Options */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Export Options
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="projects"
                  checked={exportOptions.includeProjects}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeProjects: checked as boolean,
                    }))
                  }
                />
                <label
                  htmlFor="projects"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <MapPin className="h-4 w-4" />
                  Project Information
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gps"
                  checked={exportOptions.includeGPS}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeGPS: checked as boolean,
                    }))
                  }
                />
                <label
                  htmlFor="gps"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <MapPin className="h-4 w-4" />
                  GPS Tracking Data
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financial"
                  checked={exportOptions.includeFinancial}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeFinancial: checked as boolean,
                    }))
                  }
                />
                <label
                  htmlFor="financial"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <DollarSign className="h-4 w-4" />
                  Financial Data
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analytics"
                  checked={exportOptions.includeAnalytics}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeAnalytics: checked as boolean,
                    }))
                  }
                />
                <label
                  htmlFor="analytics"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <TrendingUp className="h-4 w-4" />
                  Analytics Summary
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={exportOptions.dateRange.start}
                onChange={(e) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={exportOptions.dateRange.end}
                onChange={(e) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Export Format */}
        <div className="space-y-2">
          <h3 className="font-semibold">Export Format</h3>
          <div className="flex gap-4">
            <Button
              variant={exportOptions.format === "pdf" ? "default" : "outline"}
              onClick={() =>
                setExportOptions((prev) => ({ ...prev, format: "pdf" }))
              }
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              PDF Report
            </Button>
            <Button
              variant={exportOptions.format === "excel" ? "default" : "outline"}
              onClick={() =>
                setExportOptions((prev) => ({ ...prev, format: "excel" }))
              }
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel Data
            </Button>
            <Button
              variant={exportOptions.format === "both" ? "default" : "outline"}
              onClick={() =>
                setExportOptions((prev) => ({ ...prev, format: "both" }))
              }
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Both Formats
            </Button>
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Export Summary</h3>
          <div className="text-sm space-y-1">
            {selectedProject ? (
              <p>
                📍 Project: <strong>{selectedProject.name}</strong>
              </p>
            ) : (
              <p>
                📍 All Projects: <strong>{projects.length} projects</strong>
              </p>
            )}
            <p>
              📅 Date Range:{" "}
              <strong>
                {exportOptions.dateRange.start} to {exportOptions.dateRange.end}
              </strong>
            </p>
            <p>
              📄 Format:{" "}
              <strong>
                {exportOptions.format === "both"
                  ? "PDF & Excel"
                  : exportOptions.format.toUpperCase()}
              </strong>
            </p>
            <div className="flex gap-2 mt-2">
              {exportOptions.includeProjects && (
                <Badge variant="secondary">Projects</Badge>
              )}
              {exportOptions.includeGPS && (
                <Badge variant="secondary">GPS Data</Badge>
              )}
              {exportOptions.includeFinancial && (
                <Badge variant="secondary">Financial</Badge>
              )}
              {exportOptions.includeAnalytics && (
                <Badge variant="secondary">Analytics</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={
            isExporting ||
            (!exportOptions.includeProjects &&
              !exportOptions.includeGPS &&
              !exportOptions.includeFinancial &&
              !exportOptions.includeAnalytics)
          }
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Export...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Generate Export
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
