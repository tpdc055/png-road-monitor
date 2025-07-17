"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
