import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ActivitiesList from "@/pages/ActivitiesList";
import ActivityDetail from "@/pages/ActivityDetail";
import Profile from "@/pages/Profile";
import CreateActivity from "@/pages/CreateActivity";
import MyHistory from "@/pages/MyHistory";
import { ProtectedRoute } from "@/components/common";
import { AuthProvider } from "@/context/AuthContext";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />

          {/* Auth */}
          <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
          <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
          {/* Activities */}
          <Route path="/activities" element={<AppLayout><ProtectedRoute element={<ActivitiesList />} /></AppLayout>} />
          <Route path="/activities/:id" element={<AppLayout><ProtectedRoute element={<ActivityDetail />} /></AppLayout>} />
          <Route path="/activities/new" element={<AppLayout><ProtectedRoute roles={["COORDINADOR","ADMIN"]} element={<CreateActivity />} /></AppLayout>} />
          {/* Profile */}
          <Route path="/profile" element={<AppLayout><ProtectedRoute element={<Profile />} /></AppLayout>} />
          <Route path="/history" element={<AppLayout><ProtectedRoute element={<MyHistory />} /></AppLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
