import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import AdminHeader from "./components/AdminHeader";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import GoalForm from "./pages/GoalForm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ExerciseManagement from "./pages/admin/ExerciseManagement";
import UserManagement from "./pages/admin/UserManagement";
import GoalManagement from "./pages/admin/GoalManagement";
import Analytics from "./pages/admin/Analytics";
import ExerciseForm from "./pages/admin/ExerciseForm";
import Settings from "./pages/admin/Settings";
import UserPage from "./pages/User";
// import GuestRoute from "./pages/GuestRoute";

function App() {
  return (
    <AuthProvider>
      
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminHeader />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route
                        path="/exercises"
                        element={<ExerciseManagement />}
                      />
                      <Route path="/exercises/new" element={<ExerciseForm />} />
                      <Route
                        path="/exercises/:id/edit"
                        element={<ExerciseForm />}
                      />
                      <Route path="/users" element={<UserManagement />} />
                      <Route path="/goals" element={<GoalManagement />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />

                      <Route path="/user" element={<UserPage />} />
                    </Routes>
                  </main>
                </ProtectedRoute>
              }
            />

            {/* Public + Authenticated User Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="flex-grow">

                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route
                        path="/goal-form"
                        element={
                          <ProtectedRoute>
                            <GoalForm />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/exercises" element={<ExerciseLibrary />} />
                      {/* <Route path="/goal-form" element={<GoalForm />} /> */}
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register/>} />
                      {/* <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} /> */}



                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      
    </AuthProvider>
  );
}

export default App;
