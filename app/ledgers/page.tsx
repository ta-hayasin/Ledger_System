"use client";
import { useState, useEffect } from "react";
import { useRole } from "@/hooks/useRole";

export default function LedgersPage() {
  const { isAdmin } = useRole();
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    ledgerName: "",
    groupId: "",
    openingBalance: "0",
    balanceType: "Debit",
  });

  useEffect(() => {
    fetch("/api/company").then(r => r.json()).then(setCompany);
    fetch("/api/account-groups").then(r => r.json()).then(setGroups);
    fetch("/api/ledgers").then(r => r.json()).then(setLedgers);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/ledgers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        groupId: parseInt(form.groupId),
        openingBalance: parseFloat(form.openingBalance),
        companyId: company?.id,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setLedgers([...ledgers, data]);
      setShowForm(false);
      setForm({ ledgerName: "", groupId: "", openingBalance: "0", balanceType: "Debit" });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this ledger?")) return;
    const res = await fetch(`/api/ledgers/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    else setLedgers(ledgers.filter(l => l.id !== id));
  }

  const assetLedgers = ledgers.filter(l => l.group?.groupType === "Asset");
  const liabilityLedgers = ledgers.filter(l => l.group?.groupType === "Liability");
  const incomeLedgers = ledgers.filter(l => l.group?.groupType === "Income");
  const expenseLedgers = ledgers.filter(l => l.group?.groupType === "Expense");

  const LedgerTable = ({ data }: { data: any[] }) => (
    data.length === 0 ? (
      <p className="text-gray-500 text-sm">No ledgers yet</p>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-800">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Group</th>
            <th className="text-right py-2">Opening Bal.</th>
            {isAdmin && <th className="text-right py-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(l => (
            <tr key={l.id} className="border-b border-gray-800 hover:bg-gray-800">
              <td className="py-2">{l.ledgerName}</td>
              <td className="py-2 text-gray-400">{l.group?.groupName}</td>
              <td className="py-2 text-right">{l.openingBalance} {l.balanceType}</td>
              {isAdmin && (
                <td className="py-2 text-right">
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-800 rounded hover:bg-red-900"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Back to Dashboard</a>
      </nav>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Chart of Accounts</h2>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              + Add Ledger
            </button>
          )}
        </div>

        {isAdmin && showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">New Ledger</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ledger Name *</label>
                <input
                  type="text"
                  value={form.ledgerName}
                  onChange={e => setForm({ ...form, ledgerName: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Cash in Hand"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Account Group *</label>
                <select
                  value={form.groupId}
                  onChange={e => setForm({ ...form, groupId: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Group</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.groupName} ({g.groupType})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Opening Balance</label>
                <input
                  type="number"
                  value={form.openingBalance}
                  onChange={e => setForm({ ...form, openingBalance: e.target.value })}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Balance Type</label>
                <select
                  value={form.balanceType}
                  onChange={e => setForm({ ...form, balanceType: e.target.value })}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="Debit">Debit</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
              {error && <p className="text-red-400 text-sm col-span-2">{error}</p>}
              <div className="col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Ledger"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Assets", data: assetLedgers, color: "blue" },
            { title: "Liabilities", data: liabilityLedgers, color: "red" },
            { title: "Income", data: incomeLedgers, color: "green" },
            { title: "Expenses", data: expenseLedgers, color: "yellow" },
          ].map(({ title, data, color }) => (
            <div key={title} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className={`font-semibold text-${color}-400 mb-3`}>{title}</h3>
              <LedgerTable data={data} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
