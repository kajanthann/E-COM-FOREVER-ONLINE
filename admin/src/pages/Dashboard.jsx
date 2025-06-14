import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/admin/summary');
        if (res.data.success) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{summary.totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{summary.totalProducts}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">${summary.totalRevenue}</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary.monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
