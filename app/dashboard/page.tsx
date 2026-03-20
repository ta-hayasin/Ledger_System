import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [companies, vouchers, ledgers] = await Promise.all([
    prisma.company.count(),
    prisma.voucher.count(),
    prisma.ledger.count(),
  ]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Welcome, {session.user?.name}</span>
          <a href="/api/auth/signout" className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg">
            Logout
          </a>
        </div>
      </nav>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Companies</p>
            <p className="text-4xl font-bold text-blue-400 mt-2">{companies}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Vouchers</p>
            <p className="text-4xl font-bold text-green-400 mt-2">{vouchers}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Ledgers</p>
            <p className="text-4xl font-bold text-purple-400 mt-2">{ledgers}</p>
          </div>
        </div>

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
          <a href="/reports/ledger-statement" className="bg-gray-900 border border-gray-800 hover:border-pink-500 rounded-xl p-6 transition">
            <h3 className="font-semibold text-lg">Ledger Statement</h3>
            <p className="text-gray-400 text-sm mt-1">Individual ledger report</p>
          </a>
        </div>
      </div>
    </div>
  );
}
