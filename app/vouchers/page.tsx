"use client";
import { useState, useEffect } from "react";
import { useRole } from "@/hooks/useRole";

export default function VouchersPage() {
  const { isAccountant, isAdmin } = useRole();
  const canEdit = isAccountant || isAdmin;
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [voucherTypes, setVoucherTypes] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [form, setForm] = useState({
    voucherTypeId: "",
    voucherDate: new Date().toISOString().split("T")[0],
    description: "",
    debitLedgerId: "",
    creditLedgerId: "",
    amount: "",
  });

  useEffect(() => {
    fetch("/api/company").then(r => r.json()).then(setCompany);
    fetch("/api/ledgers").then(r => r.json()).then(setLedgers);
    fetch("/api/voucher-types").then(r => r.json()).then(setVoucherTypes);
    fetch("/api/vouchers").then(r => r.json()).then(v => { setVouchers(v); setFiltered(v); });
  }, []);

  useEffect(() => {
    let result = [...vouchers];
    if (search) {
      result = result.filter(v =>
        v.description?.toLowerCase().includes(search.toLowerCase()) ||
        v.voucherType?.typeName?.toLowerCase().includes(search.toLowerCase()) ||
        v.entries?.some((e: any) => e.ledger?.ledgerName?.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (filterType) result = result.filter(v => v.voucherType?.typeName === filterType);
    if (filterFrom) result = result.filter(v => new Date(v.voucherDate) >= new Date(filterFrom));
    if (filterTo) result = result.filter(v => new Date(v.voucherDate) <= new Date(filterTo));
    setFiltered(result);
  }, [search, filterType, filterFrom, filterTo, vouchers]);

  function clearFilters() {
    setSearch("");
    setFilterType("");
    setFilterFrom("");
    setFilterTo("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId: company?.id,
        voucherTypeId: parseInt(form.voucherTypeId),
        voucherDate: form.voucherDate,
        description: form.description,
        debitLedgerId: parseInt(form.debitLedgerId),
        creditLedgerId: parseInt(form.creditLedgerId),
        amount: parseFloat(form.amount),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setVouchers([data, ...vouchers]);
      setShowForm(false);
      setForm({
        voucherTypeId: "",
        voucherDate: new Date().toISOString().split("T")[0],
        description: "",
        debitLedgerId: "",
        creditLedgerId: "",
        amount: "",
      });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this voucher?")) return;
    const res = await fetch(`/api/vouchers/${id}`, { method: "DELETE" });
    if (res.ok) setVouchers(vouchers.filter(v => v.id !== id));
    else alert("Cannot delete this voucher.");
  }

  const totalAmount = filtered.reduce((sum, v) => {
    const debitEntry = v.entries?.find((e: any) => e.debit > 0);
    return sum + (debitEntry?.debit || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Back to Dashboard</a>
      </nav>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Voucher Entry</h2>
            <p className="text-gray-400 text-sm mt-1">
              Showing <span className="text-white font-semibold">{filtered.length}</span> of {vouchers.length} vouchers
              — Total: <span className="text-green-400 font-semibold">PKR {totalAmount.toLocaleString()}</span>
            </p>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              + New Voucher
            </button>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Search</label>
              <input
                type="text"
                placeholder="Description, type, ledger..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Voucher Type</label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">All Types</option>
                {voucherTypes.map(t => (
                  <option key={t.id} value={t.typeName}>{t.typeName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">From Date</label>
              <input
                type="date"
                value={filterFrom}
                onChange={e => setFilterFrom(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">To Date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filterTo}
                  onChange={e => setFilterTo(e.target.value)}
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  onClick={clearFilters}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {canEdit && showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">New Voucher</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Voucher Type *</label>
                <select
                  value={form.voucherTypeId}
                  onChange={e => setForm({ ...form, voucherTypeId: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  {voucherTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.typeName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.voucherDate}
                  onChange={e => setForm({ ...form, voucherDate: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Debit Ledger *</label>
                <select
                  value={form.debitLedgerId}
                  onChange={e => setForm({ ...form, debitLedgerId: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Ledger</option>
                  {ledgers.map(l => (
                    <option key={l.id} value={l.id}>{l.ledgerName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Credit Ledger *</label>
                <select
                  value={form.creditLedgerId}
                  onChange={e => setForm({ ...form, creditLedgerId: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Ledger</option>
                  {ledgers.map(l => (
                    <option key={l.id} value={l.id}>{l.ledgerName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount *</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Optional note"
                />
              </div>
              {error && <p className="text-red-400 text-sm col-span-2">{error}</p>}
              <div className="col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Voucher"}
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

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800 bg-gray-800">
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Debit</th>
                <th className="text-left px-4 py-3">Credit</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Description</th>
                {canEdit && <th className="text-left px-4 py-3">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-8">No vouchers found</td>
                </tr>
              ) : (
                filtered.map((v, i) => (
                  <tr key={v.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{new Date(v.voucherDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                        {v.voucherType?.typeName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-green-400">{v.entries?.find((e: any) => e.debit > 0)?.ledger?.ledgerName}</td>
                    <td className="px-4 py-3 text-red-400">{v.entries?.find((e: any) => e.credit > 0)?.ledger?.ledgerName}</td>
                    <td className="px-4 py-3 font-semibold">{v.entries?.find((e: any) => e.debit > 0)?.debit?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-400">{v.description || "-"}</td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-800 rounded hover:bg-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
