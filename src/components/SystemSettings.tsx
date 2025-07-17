"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// // import { Switch } from "@/components/ui/switch"; // Using button toggle workaround // Using button toggle workaround
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertTriangle,
  Bell,
  Database,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Globe,
  Key,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Trash2,
  Unlock,
  Upload,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role:
    | "ADMIN"
    | "PROJECT_MANAGER"
    | "SITE_ENGINEER"
    | "FINANCIAL_OFFICER"
    | "VIEWER";
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
  category: string;
  description: string;
  isEditable: boolean;
}

interface SecuritySetting {
  id: string;
  setting: string;
  value: boolean | string | number;
  description: string;
  level: "low" | "medium" | "high" | "critical";
}

interface BackupInfo {
  id: string;
  name: string;
  date: string;
  size: string;
  type: "automatic" | "manual";
  status: "completed" | "in_progress" | "failed";
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>(
    [],
  );
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = () => {
    // Mock system data
    const mockUsers: SystemUser[] = [
      {
        id: "U001",
        name: "Demo Administrator",
        email: "admin@doworks.gov.pg",
        role: "ADMIN",
        isActive: true,
        lastLogin: "2025-01-09T08:30:00Z",
        createdAt: "2024-01-01T00:00:00Z",
        permissions: ["ALL"],
      },
      {
        id: "U002",
        name: "John Kerenga",
        email: "j.kerenga@doworks.gov.pg",
        role: "PROJECT_MANAGER",
        isActive: true,
        lastLogin: "2025-01-08T16:45:00Z",
        createdAt: "2024-03-15T00:00:00Z",
        permissions: ["PROJECT_MANAGE", "FINANCIAL_VIEW", "REPORTS_GENERATE"],
      },
      {
        id: "U003",
        name: "Sarah Mendi",
        email: "s.mendi@doworks.gov.pg",
        role: "SITE_ENGINEER",
        isActive: true,
        lastLogin: "2025-01-09T07:15:00Z",
        createdAt: "2024-06-01T00:00:00Z",
        permissions: ["GPS_ENTRY", "QUALITY_INSPECT", "PROGRESS_UPDATE"],
      },
      {
        id: "U004",
        name: "Peter Waigani",
        email: "p.waigani@doworks.gov.pg",
        role: "FINANCIAL_OFFICER",
        isActive: false,
        lastLogin: "2024-12-20T14:30:00Z",
        createdAt: "2024-08-01T00:00:00Z",
        permissions: ["FINANCIAL_MANAGE", "BUDGET_APPROVE", "REPORTS_VIEW"],
      },
    ];

    const mockSettings: SystemSetting[] = [
      {
        id: "S001",
        key: "SYSTEM_NAME",
        value: "PNG Road Construction Monitor",
        type: "string",
        category: "General",
        description: "Name of the system displayed in headers",
        isEditable: true,
      },
      {
        id: "S002",
        key: "ORGANIZATION_NAME",
        value: "Papua New Guinea Department of Works",
        type: "string",
        category: "General",
        description: "Organization name displayed in system",
        isEditable: true,
      },
      {
        id: "S003",
        key: "DEFAULT_CURRENCY",
        value: "PGK",
        type: "string",
        category: "Financial",
        description: "Default currency for financial calculations",
        isEditable: true,
      },
      {
        id: "S004",
        key: "BACKUP_RETENTION_DAYS",
        value: "30",
        type: "number",
        category: "System",
        description: "Number of days to retain automatic backups",
        isEditable: true,
      },
      {
        id: "S005",
        key: "ENABLE_EMAIL_NOTIFICATIONS",
        value: "true",
        type: "boolean",
        category: "Notifications",
        description: "Enable system email notifications",
        isEditable: true,
      },
      {
        id: "S006",
        key: "MAP_DEFAULT_CENTER",
        value: JSON.stringify({ lat: -6.314993, lng: 143.95555 }),
        type: "json",
        category: "Maps",
        description: "Default center coordinates for maps (PNG center)",
        isEditable: true,
      },
    ];

    const mockSecuritySettings: SecuritySetting[] = [
      {
        id: "SEC001",
        setting: "Password Minimum Length",
        value: 8,
        description: "Minimum required password length",
        level: "medium",
      },
      {
        id: "SEC002",
        setting: "Session Timeout (minutes)",
        value: 60,
        description: "Automatic logout after inactivity",
        level: "medium",
      },
      {
        id: "SEC003",
        setting: "Require Two-Factor Authentication",
        value: false,
        description: "Mandatory 2FA for all users",
        level: "high",
      },
      {
        id: "SEC004",
        setting: "Failed Login Attempts Limit",
        value: 5,
        description: "Account lockout after failed attempts",
        level: "high",
      },
      {
        id: "SEC005",
        setting: "Enable API Access Logging",
        value: true,
        description: "Log all API access attempts",
        level: "critical",
      },
    ];

    const mockBackups: BackupInfo[] = [
      {
        id: "B001",
        name: "Daily Backup - 2025-01-09",
        date: "2025-01-09T02:00:00Z",
        size: "156.7 MB",
        type: "automatic",
        status: "completed",
      },
      {
        id: "B002",
        name: "Daily Backup - 2025-01-08",
        date: "2025-01-08T02:00:00Z",
        size: "154.2 MB",
        type: "automatic",
        status: "completed",
      },
      {
        id: "B003",
        name: "Manual Backup - Pre-Update",
        date: "2025-01-07T16:30:00Z",
        size: "153.8 MB",
        type: "manual",
        status: "completed",
      },
    ];

    setUsers(mockUsers);
    setSettings(mockSettings);
    setSecuritySettings(mockSecuritySettings);
    setBackups(mockBackups);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "PROJECT_MANAGER":
        return "bg-blue-100 text-blue-800";
      case "SITE_ENGINEER":
        return "bg-green-100 text-green-800";
      case "FINANCIAL_OFFICER":
        return "bg-yellow-100 text-yellow-800";
      case "VIEWER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSettingChange = (settingId: string, newValue: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === settingId ? { ...setting, value: newValue } : setting,
      ),
    );
    setUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    setTimeout(() => {
      setUnsavedChanges(false);
      // Show success message
    }, 1000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Basic system configuration and display settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings
            .filter((s) => s.category === "General")
            .map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex-1 mr-4">
                  <Label className="text-sm font-medium">
                    {setting.key.replace(/_/g, " ")}
                  </Label>
                  <p className="text-xs text-gray-600">{setting.description}</p>
                </div>
                <div className="w-64">
                  {setting.type === "boolean" ? (
                    <Button
                      variant={setting.value === "true" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        handleSettingChange(
                          setting.id,
                          setting.value === "true" ? "false" : "true",
                        )
                      }
                      disabled={!setting.isEditable}
                      className="w-16"
                    >
                      {setting.value === "true" ? "ON" : "OFF"}
                    </Button>
                  ) : (
                    <Input
                      value={setting.value}
                      onChange={(e) =>
                        handleSettingChange(setting.id, e.target.value)
                      }
                      disabled={!setting.isEditable}
                      className="text-sm"
                    />
                  )}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Settings</CardTitle>
          <CardDescription>
            Currency and financial calculation preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings
            .filter((s) => s.category === "Financial")
            .map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex-1 mr-4">
                  <Label className="text-sm font-medium">
                    {setting.key.replace(/_/g, " ")}
                  </Label>
                  <p className="text-xs text-gray-600">{setting.description}</p>
                </div>
                <div className="w-64">
                  <Select
                    value={setting.value}
                    onValueChange={(value) =>
                      handleSettingChange(setting.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PGK">
                        Papua New Guinea Kina (PGK)
                      </SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="AUD">
                        Australian Dollar (AUD)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Map Settings</CardTitle>
          <CardDescription>
            Default map configurations and display options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings
            .filter((s) => s.category === "Maps")
            .map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex-1 mr-4">
                  <Label className="text-sm font-medium">
                    {setting.key.replace(/_/g, " ")}
                  </Label>
                  <p className="text-xs text-gray-600">{setting.description}</p>
                </div>
                <div className="w-64">
                  <Input
                    value={setting.value}
                    onChange={(e) =>
                      handleSettingChange(setting.id, e.target.value)
                    }
                    disabled={!setting.isEditable}
                    className="text-sm font-mono"
                  />
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {unsavedChanges && (
        <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            You have unsaved changes.
          </span>
          <Button onClick={handleSaveSettings} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-gray-600">
            Manage system users, roles, and permissions
          </p>
        </div>
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new system user account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input type="email" placeholder="user@doworks.gov.pg" />
              </div>
              <div>
                <Label>Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                    <SelectItem value="PROJECT_MANAGER">
                      Project Manager
                    </SelectItem>
                    <SelectItem value="SITE_ENGINEER">Site Engineer</SelectItem>
                    <SelectItem value="FINANCIAL_OFFICER">
                      Financial Officer
                    </SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Temporary Password</Label>
                <Input type="password" placeholder="Temporary password" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Create User</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUserDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        {user.isActive ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Configuration</CardTitle>
          <CardDescription>
            Configure system security policies and access controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securitySettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">
                    {setting.setting}
                  </Label>
                  <Badge
                    className={getSecurityLevelColor(setting.level)}
                    variant="secondary"
                  >
                    {setting.level}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {setting.description}
                </p>
              </div>
              <div className="w-48">
                {typeof setting.value === "boolean" ? (
                  <Button
                    variant={setting.value ? "default" : "outline"}
                    size="sm"
                    className="w-16"
                  >
                    {setting.value ? "ON" : "OFF"}
                  </Button>
                ) : (
                  <Input value={setting.value.toString()} className="text-sm" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>Recent security and access events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium">Successful login</div>
                  <div className="text-xs text-gray-600">
                    admin@doworks.gov.pg • 2025-01-09 08:30
                  </div>
                </div>
              </div>
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium">Settings updated</div>
                  <div className="text-xs text-gray-600">
                    System configuration changed • 2025-01-08 14:22
                  </div>
                </div>
              </div>
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium">
                    Failed login attempt
                  </div>
                  <div className="text-xs text-gray-600">
                    unknown@example.com • 2025-01-08 09:15
                  </div>
                </div>
              </div>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backup Configuration</CardTitle>
          <CardDescription>
            Manage system backups and data retention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium">
                Automatic Backup Schedule
              </Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily at 2:00 AM</SelectItem>
                  <SelectItem value="weekly">Weekly on Sunday</SelectItem>
                  <SelectItem value="monthly">Monthly on 1st</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">
                Retention Period (days)
              </Label>
              <Input
                type="number"
                value="30"
                className="mt-2"
                min="1"
                max="365"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Create Manual Backup
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Restore from Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>
            Recent system backups and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Database className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">{backup.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(backup.date).toLocaleString()} • {backup.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(backup.status)}>
                    {backup.status.replace("_", " ")}
                  </Badge>
                  <Badge variant="secondary">{backup.type}</Badge>
                  {backup.status === "completed" && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "users", label: "Users", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "backup", label: "Backup", icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">
            Configure system preferences, users, and security settings
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {renderGeneralSettings()}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {renderUserManagement()}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {renderSecuritySettings()}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Notification Settings
              </h3>
              <p className="text-gray-600 mb-4">
                Configure email notifications, alerts, and messaging preferences
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">System Health</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Server Status</span>
                        <Badge className="bg-green-100 text-green-800">
                          Online
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-100 text-green-800">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Last Backup</span>
                        <span className="text-sm text-gray-600">
                          2 hours ago
                        </span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">User Activity</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Users</span>
                        <span className="text-sm font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Today's Logins</span>
                        <span className="text-sm font-medium">67</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">System Uptime</span>
                        <span className="text-sm text-green-600">99.8%</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          {renderBackupSettings()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
