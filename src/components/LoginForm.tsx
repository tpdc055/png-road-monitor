"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector, useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const demoCredentials = [
    { role: "Administrator", email: "admin@png.gov.pg", password: "admin123" },
    {
      role: "Project Manager",
      email: "manager@png.gov.pg",
      password: "manager123",
    },
    {
      role: "Site Engineer",
      email: "engineer@png.gov.pg",
      password: "engineer123",
    },
    {
      role: "Financial Officer",
      email: "finance@png.gov.pg",
      password: "finance123",
    },
  ];

  const handleDemoLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
              <svg viewBox="0 0 64 64" className="w-10 h-10 text-white">
                {/* Stylized road/path */}
                <path
                  d="M8 56 L32 8 L56 56 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* PNG traditional geometric pattern */}
                <path
                  d="M20 40 L32 28 L44 40 L32 52 Z"
                  fill="currentColor"
                  opacity="0.6"
                />
                {/* Tropical leaf elements */}
                <path
                  d="M16 20 Q18 16 22 18 Q24 22 20 24 Q16 22 16 20"
                  fill="currentColor"
                  opacity="0.8"
                />
                <path
                  d="M42 20 Q46 16 48 18 Q46 22 42 24 Q40 22 42 20"
                  fill="currentColor"
                  opacity="0.8"
                />
                {/* Central monitoring symbol */}
                <circle cx="32" cy="40" r="3" fill="white" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              PNG Road Construction Monitor
            </CardTitle>
            <CardDescription className="text-gray-600">
              Papua New Guinea Department of Works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Demo Credentials
            </CardTitle>
            <CardDescription>
              Click on any credential below to auto-fill the login form
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoCredentials.map((cred, index) => (
              <div
                key={index}
                onClick={() => handleDemoLogin(cred.email, cred.password)}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{cred.role}</div>
                <div className="text-sm text-gray-600">{cred.email}</div>
                <div className="text-xs text-gray-500">
                  Password: {cred.password}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
