import { useAppData } from "@/app/context/AppDataContext";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const barData = MONTHS.map((m, i) => ({
  month: m,
  revenue: [1200, 980, 1500, 1100, 1800, 1400][i],
}));

const lineData = MONTHS.map((m, i) => ({
  month: m,
  orders: [8, 6, 10, 9, 14, 11][i],
}));

const PIE_COLORS = ["#ca498c", "#df9ebf", "#ff5faa", "#fa9cca", "#ffabab"];

export default function AdminDashboard() {
  const { orders, inventory } = useAppData();

  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
  const totalOrders = orders.length;
  const lowStock = inventory.filter((i) => i.stock < 20).length;

  const categoryData = ["Bouquets", "Themed", "Dolls", "Crafts"].map((cat) => ({
    name: cat,
    value: orders.filter((o) => o.category === cat || o.category === cat.replace("s", "")).length || 1,
  }));

  return (
    <div className="text-white">
      <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight mb-1">
        Dashboard
      </h1>
      <p className="font-['Roboto',sans-serif] text-[18px] text-white/70 mb-8">
        Welcome back. Here's what's happening today.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `₱${totalRevenue.toLocaleString()}`, color: "#ca498c" },
          { label: "Total Orders", value: totalOrders, color: "#df9ebf" },
          { label: "Low Stock Items", value: lowStock, color: "#ff5faa" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-[#140e11] border border-[rgba(255,255,255,0.15)] rounded-[15px] p-6"
          >
            <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 mb-2">{label}</p>
            <p
              className="font-['Crimson_Text',serif] text-[42px] leading-none"
              style={{ color }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Bar chart */}
        <div className="bg-[#140e11] border border-[rgba(255,255,255,0.15)] rounded-[15px] p-6">
          <h3 className="font-['Roboto',sans-serif] font-medium text-[16px] text-white/80 mb-4">
            Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#2d1f24", border: "none", borderRadius: 8, color: "white", fontSize: 12 }}
                formatter={(v: number) => [`₱${v}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#ca498c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="bg-[#140e11] border border-[rgba(255,255,255,0.15)] rounded-[15px] p-6">
          <h3 className="font-['Roboto',sans-serif] font-medium text-[16px] text-white/80 mb-4">
            Orders Over Time
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#2d1f24", border: "none", borderRadius: 8, color: "white", fontSize: 12 }}
              />
              <Line type="monotone" dataKey="orders" stroke="#df9ebf" strokeWidth={2} dot={{ fill: "#df9ebf", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart */}
      <div className="bg-[#140e11] border border-[rgba(255,255,255,0.15)] rounded-[15px] p-6 max-w-[380px]">
        <h3 className="font-['Roboto',sans-serif] font-medium text-[16px] text-white/80 mb-4">
          Orders by Category
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={65}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, i) => (
                <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#2d1f24", border: "none", borderRadius: 8, color: "white", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}