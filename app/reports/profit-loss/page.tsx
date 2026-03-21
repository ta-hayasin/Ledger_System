"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function ProfitLossPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/profit-loss")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  function exportToExcel() {
    if (!data) return;
    const wb = XLSX.utils.book_new();
    const incomeRows = data.income.map((r: any) => ({ Type: "Income", Ledger: r.ledgerName, "Amount (PKR)": r.amount }));
    const expenseRows = data.expenses.map((r: any) => ({ Type: "Expense", Ledger: r.ledgerName, "Amount (PKR)": r.amount }));
    const summary = [
      { Type: "", Ledger: "Total Income", "Amount (PKR)": data.totalIncome },
      { Type: "", Ledger: "Total Expenses", "Amount (PKR)": data.totalExpenses },
      { Type: "", Ledger: data.netProfit >= 0 ? "Net Profit" : "Net Loss", "Amount (PKR)": Math.abs(data.netProfit) },
    ];
    const ws = XLSX.utils.json_to_sheet([...incomeRows, ...expenseRows, ...summary]);
    ws["!cols"] = [{ wch: 12 }, { wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, "Profit & Loss");
    XLSX.writeFile(wb, "profit_loss.xlsx");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px; color: black !important; }
          th { background: #f0f0f0 !important; }
        }
      `}</style>
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center no-print">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Back to Dashboard</a>
      </nav>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Profit & Loss Account</h2>
            <p className="text-gray-400 text-sm mt-1">Income vs Expenses summary</p>
          </div>
          <div className="flex gap-3 no-print">
            <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">Export Excel</button>
            <button onClick={() => window.print()} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Print / PDF</button>
          </div>
        </div>
        {loading ? <p className="text-gray-400">Loading...</p> : (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-green-900 px-6 py-3 border-b border-gray-700">
                <h3 className="font-semibold text-green-300">Income</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {data?.income?.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="px-6 py-3">{r.ledgerName}</td>
                      <td className="px-6 py-3 text-right text-green-400">{r.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-800 font-bold">
                    <td className="px-6 py-3">Total Income</td>
                    <td className="px-6 py-3 text-right text-green-400">{data?.totalIncome?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-red-900 px-6 py-3 border-b border-gray-700">
                <h3 className="font-semibold text-red-300">Expenses</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {data?.expenses?.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="px-6 py-3">{r.ledgerName}</td>
                      <td className="px-6 py-3 text-right text-red-400">{r.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-800 font-bold">
                    <td className="px-6 py-3">Total Expenses</td>
                    <td className="px-6 py-3 text-right text-red-400">{data?.totalExpenses?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`col-span-2 p-6 rounded-xl border ${data?.netProfit >= 0 ? "bg-green-900 border-green-700" : "bg-red-900 border-red-700"}`}>
              <p className="text-lg font-bold">
                {data?.netProfit >= 0 ? "Net Profit" : "Net Loss"}: PKR {Math.abs(data?.netProfit).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
