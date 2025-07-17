import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SystemSettingsProvider } from "@/contexts/SystemSettingsContext";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: "PNG Road Construction Monitor",
  description:
    "Papua New Guinea road construction monitoring and management system",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        <ErrorBoundary>
          <LanguageProvider>
            <AuthProvider>
              <SystemSettingsProvider>
                <ClientBody>{children}</ClientBody>
              </SystemSettingsProvider>
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
