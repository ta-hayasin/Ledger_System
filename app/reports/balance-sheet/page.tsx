"use client";
import { useState, useEffect } from "react";

export default function BalanceSheetPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/balance-sheet")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Back to Dashboard</a>
      </nav>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Balance Sheet</h2>
        <p className="text-gray-400 text-sm mb-6">Assets vs Liabilities</p>
        {loading ? <p className="text-gray-400">Loading...</p> : (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-blue-900 px-6 py-3 border-b border-gray-700">
                <h3 className="font-semibold text-blue-300">Assets</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {data?.assets?.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="px-6 py-3">{r.ledgerName}</td>
                      <td className="px-6 py-3 text-right text-blue-400">{r.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-800 font-bold">
                    <td className="px-6 py-3">Total Assets</td>
                    <td className="px-6 py-3 text-right text-blue-400">{data?.totalAssets?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-purple-900 px-6 py-3 border-b border-gray-700">
                <h3 className="font-semibold text-purple-300">Liabilities & Capital</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {data?.liabilities?.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="px-6 py-3">{r.ledgerName}</td>
                      <td className="px-6 py-3 text-right text-purple-400">{r.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-800 font-bold">
                    <td className="px-6 py-3">Total Liabilities</td>
                    <td className="px-6 py-3 text-right text-purple-400">{data?.totalLiabilities?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`col-span-2 p-6 rounded-xl border ${data?.totalAssets === data?.totalLiabilities ? "bg-green-900 border-green-700 text-green-300" : "bg-yellow-900 border-yellow-700 text-yellow-300"}`}>
              {data?.totalAssets === data?.totalLiabilities
                ? "✓ Balance Sheet is balanced!"
                : `Note: Difference of PKR ${Math.abs(data?.totalAssets - data?.totalLiabilities).toLocaleString()} — includes opening balances`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
