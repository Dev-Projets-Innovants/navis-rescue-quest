import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Connect from "./pages/Connect";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Unlock from "./pages/Unlock";
import Validation from "./pages/Validation";
import Victory from "./pages/Victory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/unlock" element={<Unlock />} />
          <Route path="/validation" element={<Validation />} />
          <Route path="/victory" element={<Victory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
