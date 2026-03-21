"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function LedgerStatementPage() {
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [selectedLedger, setSelectedLedger] = useState("");
  const [statement, setStatement] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/ledgers").then(r => r.json()).then(setLedgers);
  }, []);

  async function fetchStatement() {
    if (!selectedLedger) return;
    setLoading(true);
    const res = await fetch(`/api/reports/ledger-statement?ledgerId=${selectedLedger}`);
    const data = await res.json();
    setStatement(data);
    setLoading(false);
  }

  function exportToExcel() {
    if (!statement) return;

    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ["Ledger Statement"],
      ["Ledger Name", statement.ledgerName],
      ["Opening Balance", statement.openingBalance, statement.balanceType],
      ["Total Debit", statement.totalDebit],
      ["Total Credit", statement.totalCredit],
      [],
    ];

    // Transactions
    const headers = ["#", "Date", "Voucher Type", "Description", "Debit", "Credit", "Balance"];
    const rows = statement.transactions.map((t: any, i: number) => [
      i + 1,
      new Date(t.date).toLocaleDateString(),
      t.voucherType,
      t.description || "-",
      t.debit > 0 ? t.debit : 0,
      t.credit > 0 ? t.credit : 0,
      t.balance,
    ]);

    const wsData = [...summaryData, headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths
    ws["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Ledger Statement");
    XLSX.writeFile(wb, `${statement.ledgerName}_statement.xlsx`);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Back to Dashboard</a>
      </nav>
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Ledger Statement</h2>
        <p className="text-gray-400 text-sm mb-6">View all transactions for a specific ledger</p>

        <div className="flex gap-4 mb-6">
          <select
            value={selectedLedger}
            onChange={e => setSelectedLedger(e.target.value)}
            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a Ledger</option>
            {ledgers.map(l => (
              <option key={l.id} value={l.id}>{l.ledgerName} ({l.group?.groupName})</option>
            ))}
          </select>
          <button
            onClick={fetchStatement}
            disabled={!selectedLedger || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Loading..." : "View Statement"}
          </button>
          {statement && (
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              Export Excel
            </button>
          )}
        </div>

        {statement && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Opening Balance</p>
                <p className="text-xl font-bold text-blue-400 mt-1">
                  PKR {statement.openingBalance?.toLocaleString()}
                  <span className="text-sm text-gray-400 ml-1">{statement.balanceType}</span>
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Total Debit</p>
                <p className="text-xl font-bold text-green-400 mt-1">PKR {statement.totalDebit?.toLocaleString()}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Total Credit</p>
                <p className="text-xl font-bold text-red-400 mt-1">PKR {statement.totalCredit?.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-gray-400 border-b border-gray-700">
                    <th className="text-left px-4 py-3">#</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Voucher Type</th>
                    <th className="text-left px-4 py-3">Description</th>
                    <th className="text-right px-4 py-3">Debit</th>
                    <th className="text-right px-4 py-3">Credit</th>
                    <th className="text-right px-4 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.transactions?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-8">No transactions found</td>
                    </tr>
                  ) : (
                    statement.transactions?.map((t: any, i: number) => (
                      <tr key={i} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="px-4 py-3">{i + 1}</td>
                        <td className="px-4 py-3">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">{t.voucherType}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{t.description || "-"}</td>
                        <td className="px-4 py-3 text-right text-green-400">{t.debit > 0 ? t.debit.toLocaleString() : "-"}</td>
                        <td className="px-4 py-3 text-right text-red-400">{t.credit > 0 ? t.credit.toLocaleString() : "-"}</td>
                        <td className="px-4 py-3 text-right font-semibold">{t.balance?.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
