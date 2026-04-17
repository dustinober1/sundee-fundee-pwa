"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE_COLORS = ["#0d1a40", "#d4a520", "#f27319", "#5a6582", "#2f8f4e", "#c0392b"];

function fmtWeek(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function AnalyticsCharts({
  weeks,
  balance,
  pain,
}: {
  weeks: { weekStart: string; workoutCount: number; totalVolumeLbs: number }[];
  balance: { name: string; value: number }[];
  pain: { date: string; intensity: number }[];
}) {
  return (
    <div className="mt-8 space-y-8">
      {weeks.length > 0 ? (
        <section>
          <h2 className="font-display text-lg font-semibold">Weekly volume (lb)</h2>
          <div className="mt-3 h-64 rounded-2xl border border-border bg-surface p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeks.map((w) => ({ ...w, label: fmtWeek(w.weekStart) }))}>
                <CartesianGrid stroke="#0d1a4022" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#5a6582" fontSize={12} />
                <YAxis stroke="#5a6582" fontSize={12} />
                <Tooltip />
                <Bar dataKey="totalVolumeLbs" fill="#d4a520" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {weeks.length > 0 ? (
        <section>
          <h2 className="font-display text-lg font-semibold">Workouts per week</h2>
          <div className="mt-3 h-48 rounded-2xl border border-border bg-surface p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeks.map((w) => ({ ...w, label: fmtWeek(w.weekStart) }))}>
                <CartesianGrid stroke="#0d1a4022" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#5a6582" fontSize={12} />
                <YAxis stroke="#5a6582" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="workoutCount"
                  stroke="#0d1a40"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {balance.length > 0 ? (
        <section>
          <h2 className="font-display text-lg font-semibold">Muscle balance</h2>
          <div className="mt-3 h-72 rounded-2xl border border-border bg-surface p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={balance}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {balance.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {pain.length > 0 ? (
        <section>
          <h2 className="font-display text-lg font-semibold">Pain intensity</h2>
          <div className="mt-3 h-48 rounded-2xl border border-border bg-surface p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pain.map((p) => ({ ...p, label: fmtWeek(p.date) }))}>
                <CartesianGrid stroke="#0d1a4022" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#5a6582" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="#5a6582" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#c0392b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}
    </div>
  );
}
