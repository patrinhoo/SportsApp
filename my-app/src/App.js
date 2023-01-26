import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./store/AuthContext";

import Navbar from "./components/UI/navbar/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import WorkoutPage from "./pages/WorkoutPage";
import MySportsManResultsPage from "./pages/MySportsManResultsPage";
import JoinClubPage from "./pages/JoinClubPage";
import MessagesPage from "./pages/MessagesPage";
import ConversationsPage from "./pages/ConversationsPage";
import MySportsManReportPage from "./pages/MySportsMenReportPage";

function App() {
  return (
    <React.Fragment>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route element={<Login />} path="/login" />
            <Route element={<Register />} path="/register" />
            <Route element={<MainPage />} path="/" />
            <Route element={<ProfilePage />} path="/profile" />
            <Route element={<WorkoutPage />} path="/workout/:id" />
            <Route
              element={<MySportsManResultsPage />}
              path="/mysportsman/:id"
            />
            <Route element={<JoinClubPage />} path="/join_club" />
            <Route element={<MessagesPage />} path="/messages/:id" />
            <Route element={<ConversationsPage />} path="/messages" />
            <Route element={<MySportsManReportPage />} path="/report" />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
