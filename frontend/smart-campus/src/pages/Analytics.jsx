import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

const Analytics = () => {
  const [topResources, setTopResources] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [bookingsOverTime, setBookingsOverTime] = useState([]);
  const [resourceUtilization, setResourceUtilization] = useState([]);

  useEffect(() => {
    fetchTopResources();
    fetchPeakHours();
    fetchBookingsOverTime();
    fetchResourceUtilizationData();
  }, []);

  // fetch resource utilization using helper service (attaches auth header)
  const fetchResourceUtilizationData = async () => {
    try {
      // import dynamic call to avoid circular issues
      const module = await import('../resourceMgmt/api/analyticsService');
      const data = await module.fetchResourceUtilization(30);
      const list = Array.isArray(data) ? data : [];
      setResourceUtilization(list);
    } catch (e) {
      console.error('Failed to load resource utilization', e);
    }
  };

  const unwrap = (res) => {
    if (!res) return null;
    // If backend returns ApiResponse wrapper { success, message, data, ... }
    if (res.data && typeof res.data === 'object' && ('success' in res.data || 'data' in res.data)) {
      return res.data.data ?? null;
    }
    // Otherwise assume payload is at top-level
    return res.data ?? null;
  };

  const fetchTopResources = async () => {
    try {
      const res = await axios.get('/api/admin/analytics/top-resources?limit=10');
      const payload = unwrap(res);
      const list = Array.isArray(payload) ? payload : [];
      setTopResources(list.map(r => ({ name: r.resourceName, value: r.count })));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPeakHours = async () => {
    try {
      const res = await axios.get('/api/admin/analytics/peak-hours');
      const payload = unwrap(res);
      const map = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : payload || {};
      const data = Object.keys(map).map(k => ({ hour: k, count: map[k] }));
      setPeakHours(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookingsOverTime = async () => {
    try {
      const res = await axios.get('/api/admin/analytics/bookings-over-time?days=30');
      const payload = unwrap(res);
      const list = Array.isArray(payload) ? payload : [];
      const data = list.map(d => ({ date: d.date, count: d.count }));
      setBookingsOverTime(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-4 bg-white shadow">
          <h3 className="font-semibold mb-2">Top Resources (by bookings)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topResources} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg p-4 bg-white shadow">
          <h3 className="font-semibold mb-2">Peak Booking Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHours} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-1 lg:col-span-2 rounded-lg p-4 bg-white shadow">
          <h3 className="font-semibold mb-2">Bookings Over Time (last 30 days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingsOverTime} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resource utilization table */}
        <div className="col-span-1 lg:col-span-2 rounded-lg p-4 bg-white shadow">
          <h3 className="font-semibold mb-2">Resource Utilization (last 30 days)</h3>
          {resourceUtilization.length === 0 ? (
            <p className="text-slate-500">No utilization data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-slate-600">
                    <th className="px-3 py-2">Resource</th>
                    <th className="px-3 py-2">Booked Hours</th>
                    <th className="px-3 py-2">Utilization %</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceUtilization.map((r) => (
                    <tr key={r.resourceId} className="border-t">
                      <td className="px-3 py-2">{r.resourceName}</td>
                      <td className="px-3 py-2">{Number(r.bookedHours || 0).toFixed(1)}</td>
                      <td className="px-3 py-2">{Number(r.utilizationPercent || 0).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
