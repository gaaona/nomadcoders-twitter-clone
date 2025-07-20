import React from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";
import Home from "../routes/home";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  }

  return children; // children 반환 안 하면 layout이 렌더링되지 않음
  // return <Home />; // Uncomment this line if you want to render Home directly
}
