"use client";
import { useState, useEffect } from "react";

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Back to Dashboard</a>
      </nav>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Trial Balance</h2>
        <p className="text-gray-400 text-sm mb-6">Summary of all debit and credit balances</p>

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
