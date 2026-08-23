import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index.tsx";
import ScrollToTop from "./components/ScrollToTop";
import { TenantProvider } from "@/admin/TenantContext";
import AdminGuard from "@/components/admin/AdminGuard";

// Code-split sub-pages and the chatbot to reduce the initial JS bundle.
// These are not needed on the landing page ("/") for first paint.
const Impressum = lazy(() => import("./pages/Impressum.tsx"));
const Datenschutz = lazy(() => import("./pages/Datenschutz.tsx"));
const AGB = lazy(() => import("./pages/AGB.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));
const Empfehlen = lazy(() => import("./pages/Empfehlen.tsx"));
const WohnmobilBrandenburg = lazy(() => import("./pages/WohnmobilBrandenburg.tsx"));
const Reisetipps = lazy(() => import("./pages/Reisetipps.tsx"));
const Reisetipp = lazy(() => import("./pages/Reisetipp.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminChatbotStats = lazy(() => import("./pages/AdminChatbotStats.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminRentals = lazy(() => import("./pages/admin/AdminRentals.tsx"));
const AdminRentalWizard = lazy(() => import("./pages/admin/AdminRentalWizard.tsx"));
const AdminCalendar = lazy(() => import("./pages/admin/AdminCalendar.tsx"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers.tsx"));
const AdminVehicles = lazy(() => import("./pages/admin/AdminVehicles.tsx"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory.tsx"));
const FloatingChatbot = lazy(() => import("./components/FloatingChatbot"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/agb" element={<AGB />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/empfehlen" element={<Empfehlen />} />
              <Route path="/refer" element={<Empfehlen />} />
              <Route path="/wohnmobil-brandenburg" element={<WohnmobilBrandenburg />} />
              <Route path="/reisetipps" element={<Reisetipps />} />
              <Route path="/reisetipps/:slug" element={<Reisetipp />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/chatbot-stats" element={<AdminChatbotStats />} />
              <Route
                path="/admin/*"
                element={
                  <TenantProvider>
                    <AdminGuard>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="mietvertraege" element={<AdminRentals />} />
                        <Route path="mietvertrag/neu" element={<AdminRentalWizard />} />
                        <Route path="kalender" element={<AdminCalendar />} />
                        <Route path="kunden" element={<AdminCustomers />} />
                        <Route path="fahrzeuge" element={<AdminVehicles />} />
                        <Route path="inventar" element={<AdminInventory />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AdminGuard>
                  </TenantProvider>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingChatbot />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
