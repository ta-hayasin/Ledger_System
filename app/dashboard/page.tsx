"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({ companies: 0, vouchers: 0, ledgers: 0 });
  const [plData, setPlData] = useState<any>(null);
  const [bsData, setBsData] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(setSession);
    Promise.all([
      fetch("/api/company").then(r => r.json()),
      fetch("/api/vouchers").then(r => r.json()),
      fetch("/api/ledgers").then(r => r.json()),
      fetch("/api/reports/profit-loss").then(r => r.json()),
      fetch("/api/reports/balance-sheet").then(r => r.json()),
    ]).then(([company, vouchers, ledgers, pl, bs]) => {
      setStats({
        companies: company?.id ? 1 : 0,
        vouchers: Array.isArray(vouchers) ? vouchers.length : 0,
        ledgers: Array.isArray(ledgers) ? ledgers.length : 0,
      });
      setPlData(pl);
      setBsData(bs);
    });
  }, []);

  const barData = [
    { name: "Income", amount: plData?.totalIncome || 0, fill: "#22c55e" },
    { name: "Expenses", amount: plData?.totalExpenses || 0, fill: "#ef4444" },
    { name: "Net Profit", amount: plData?.netProfit || 0, fill: "#3b82f6" },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];
  const pieData = bsData?.assets?.filter((a: any) => a.balance > 0).map((a: any) => ({
    name: a.ledgerName,
    value: a.balance,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Welcome, {session?.user?.name}</span>
          <a href="/api/auth/signout" className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg">
            Logout
          </a>
        </div>
      </nav>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Companies</p>
            <p className="text-4xl font-bold text-blue-400 mt-2">{stats.companies}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Vouchers</p>
            <p className="text-4xl font-bold text-green-400 mt-2">{stats.vouchers}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Ledgers</p>
            <p className="text-4xl font-bold text-purple-400 mt-2">{stats.ledgers}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(val: any) => [`PKR ${val.toLocaleString()}`, ""]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Asset Distribution</h3>
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-500">No asset data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                    formatter={(val: any) => [`PKR ${val.toLocaleString()}`, ""]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/company" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-6 transition">
            <h3 className="font-semibold text-lg">Company</h3>
            <p className="text-gray-400 text-sm mt-1">Manage company details</p>
          </a>
          <a href="/ledgers" className="bg-gray-900 border border-gray-800 hover:border-green-500 rounded-xl p-6 transition">
            <h3 className="font-semibold text-lg">Ledgers</h3>
            <p className="text-gray-400 text-sm mt-1">Chart of accounts</p>
          </a>
          <a href="/vouchers" className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-xl p-6 transition">
            <h3 className="font-semibold text-lg">Vouchers</h3>
            <p className="text-gray-400 text-sm mt-1">Record transactions</p>
          </a>
          <a href="/inventory" className="bg-gray-900 border border-gray-800 hover:border-yellow-500 rounded-xl p-6 transition">
            <h3 className="font-semibold text-lg">Inventory</h3>
            <p className="text-gray-400 text-sm mt-1">Manage stock items</p>
          </a>
          <a href="/reports/trial-balance" className="bg-gray-900 border border-gray-800 hover:border-red-500 rounded-xl p-6 transition">
            <h3 className="font-semibold text-lg">Trial Balance</h3>
            <p className="text-gray-400 text-sm mt-1">Debit vs credit summary</p>
          </a>
          <a href="/reports/profit-loss" className="bg-gray-900 border border-gray-800 hover:border-orange-500 rounded-xl p-6 transition">
            <h3 className="font-semibold text-lg">Profit & Loss</h3>
            <p className="text-gray-400 text-sm mt-1">Income vs expenses</p>
          </a>
          <a href="/reports/balance-sheet" className="bg-gray-900 border border-gray-800 hover:border-teal-500 rounded-xl p-6 transition">
            <h3 className="font-semibold text-lg">Balance Sheet</h3>
            <p className="text-gray-400 text-sm mt-1">Assets vs liabilities</p>
          </a>
          <a href="/users" className="bg-gray-900 border border-gray-800 hover:border-red-500 rounded-xl p-6 transition"><h3 className="font-semibold text-lg">Users</h3><p className="text-gray-400 text-sm mt-1">Manage system users</p></a>
          <a href="/reports/ledger-statement" className="bg-gray-900 border border-gray-800 hover:border-pink-500 rounded-xl p-6 transition">
            <h3 className="font-semibold text-lg">Ledger Statement</h3>
            <p className="text-gray-400 text-sm mt-1">Individual ledger report</p>
          </a>
        </div>
      </div>
    </div>
  );
}
