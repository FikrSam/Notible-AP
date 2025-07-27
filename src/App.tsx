// @/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Notebook from "@/pages/Notebook";
import { LoginForm } from "@/components/login-form";
import { SignUpForm } from "@/components/signup-form";
import { PrivateRoute } from "@/components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/notebook"
          element={
            <PrivateRoute>
              <Notebook />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}