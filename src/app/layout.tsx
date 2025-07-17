import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import { AuthProvider } from "@/contexts/AuthContext";
import { SystemSettingsProvider } from "@/contexts/SystemSettingsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "PNG Road Construction Monitor",
  description: "Papua New Guinea road construction monitoring and management system",
  icons: {
    icon: '/favicon.svg',
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
