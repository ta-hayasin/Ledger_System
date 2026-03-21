"use client";
import { useState, useEffect } from "react";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [stockGroups, setStockGroups] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    itemName: "",
    groupId: "",
    unitId: "",
    price: "0",
    quantity: "0",
  });

  useEffect(() => {
    fetch("/api/inventory").then(r => r.json()).then(setItems);
    fetch("/api/units").then(r => r.json()).then(setUnits);
    fetch("/api/stock-groups").then(r => r.json()).then(setStockGroups);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemName: form.itemName,
        groupId: parseInt(form.groupId),
        unitId: parseInt(form.unitId),
        price: parseFloat(form.price),
        quantity: parseFloat(form.quantity),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setItems([...items, data]);
      setShowForm(false);
      setForm({ itemName: "", groupId: "", unitId: "", price: "0", quantity: "0" });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter(i => i.id !== id));
    else alert("Cannot delete this item.");
  }

  const totalValue = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">Ledger System</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Back to Dashboard</a>
      </nav>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Inventory</h2>
            <p className="text-gray-400 text-sm mt-1">Total Stock Value: <span className="text-green-400 font-semibold">PKR {totalValue.toLocaleString()}</span></p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add Item
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">New Stock Item</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={form.itemName}
                  onChange={e => setForm({ ...form, itemName: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Laptop"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Stock Group *</label>
                <select
                  value={form.groupId}
                  onChange={e => setForm({ ...form, groupId: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Group</option>
                  {stockGroups.map(g => (
                    <option key={g.id} value={g.id}>{g.groupName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Unit *</label>
                <select
                  value={form.unitId}
                  onChange={e => setForm({ ...form, unitId: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Unit</option>
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.unitName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price (PKR)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  min="0"
                />
              </div>
              {error && <p className="text-red-400 text-sm col-span-2">{error}</p>}
              <div className="col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Item"}
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
                <th className="text-left px-4 py-3">Item Name</th>
                <th className="text-left px-4 py-3">Group</th>
                <th className="text-left px-4 py-3">Unit</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Quantity</th>
                <th className="text-right px-4 py-3">Total Value</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-8">No stock items yet</td>
                </tr>
              ) : (
                items.map((item, i) => (
                  <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.itemName}</td>
                    <td className="px-4 py-3 text-gray-400">{item.group?.groupName}</td>
                    <td className="px-4 py-3 text-gray-400">{item.unit?.unitName}</td>
                    <td className="px-4 py-3 text-right">{item.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-green-400">{(item.price * item.quantity).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-800 rounded hover:bg-red-900"
                      >
                        Delete
                      </button>
                    </td>
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
