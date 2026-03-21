"use client";
import { useState, useEffect } from "react";

export function useRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(data => {
        setRole(data.role);
        setLoading(false);
      });
  }, []);

  const isAdmin = role === "admin";
  const isAccountant = role === "accountant" || role === "admin";
  const isViewer = role === "viewer";

  return { role, loading, isAdmin, isAccountant, isViewer };
}
