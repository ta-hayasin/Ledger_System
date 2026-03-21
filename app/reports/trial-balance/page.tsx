"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function TrialBalancePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/trial-balance")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  const totalDebit = data.reduce((sum, r) => sum + r.totalDebit, 0);
  const totalCredit = data.reduce((sum, r) => sum + r.totalCredit, 0);

  function exportToExcel() {
    const rows = data.map(r => ({
      "Ledger Name": r.ledgerName,
      "Debit (PKR)": r.totalDebit > 0 ? r.totalDebit : 0,
      "Credit (PKR)": r.totalCredit > 0 ? r.totalCredit : 0,
    }));
    rows.push({ "Ledger Name": "TOTAL", "Debit (PKR)": totalDebit, "Credit (PKR)": totalCredit });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");
    XLSX.writeFile(wb, "trial_balance.xlsx");
  }

  function printReport() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-area { background: white !important; color: black !important; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px; color: black !important; }
          th { background: #f0f0f0 !important; }
        }
      `}</style>
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center no-print">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Back to Dashboard</a>
      </nav>
      <div className="p-6 max-w-4xl mx-auto print-area">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Trial Balance</h2>
            <p className="text-gray-400 text-sm mt-1">Summary of all debit and credit balances</p>
          </div>
          <div className="flex gap-3 no-print">
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Export Excel
            </button>
            <button
              onClick={printReport}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Print / PDF
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-gray-400 border-b border-gray-700">
                    <th className="text-left px-6 py-3">Ledger Name</th>
                    <th className="text-right px-6 py-3">Debit (PKR)</th>
                    <th className="text-right px-6 py-3">Credit (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="px-6 py-3">{row.ledgerName}</td>
                      <td className="px-6 py-3 text-right text-green-400">
                        {row.totalDebit > 0 ? row.totalDebit.toLocaleString() : "-"}
                      </td>
                      <td className="px-6 py-3 text-right text-red-400">
                        {row.totalCredit > 0 ? row.totalCredit.toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-800 font-bold border-t-2 border-gray-600">
                    <td className="px-6 py-3">Total</td>
                    <td className="px-6 py-3 text-right text-green-400">{totalDebit.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right text-red-400">{totalCredit.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className={`p-4 rounded-xl border ${totalDebit === totalCredit ? "bg-green-900 border-green-700 text-green-300" : "bg-red-900 border-red-700 text-red-300"}`}>
              {totalDebit === totalCredit
                ? "✓ Trial Balance is balanced — Total Debit equals Total Credit"
                : "✗ Trial Balance is NOT balanced — Please check your entries"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
