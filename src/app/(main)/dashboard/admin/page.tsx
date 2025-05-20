"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  FileText,
  FilePlus2,
  UserPlus,
  Clock,
  BarChart3,
  PieChart,
  RefreshCcw,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  Legend,
  Cell,
  TooltipProps,
} from "recharts";

/* ----------------------------- types ----------------------------- */
interface AnalyticsResponse {
  totalUsers: number;
  totalDocuments: number;
  docsPerCategory: Record<string, number>;
  docsPerDepartment: Record<string, number>;
  docsByStatus: Record<string, number>;
  newUsersLast7Days: number;
  newDocsLast7Days: number;
  generatedAt: string;
}

/* ---------------------------- helpers --------------------------- */
const COLORS = [
  "#4f46e5", // indigo-600
  "#0891b2", // cyan-600
  "#ea580c", // orange-600
  "#059669", // emerald-600
  "#a21caf", // purple-700
  "#be123c", // rose-700
  "#ca8a04", // yellow-600
  "#0369a1", // sky-700
];

function toChartData(obj: Record<string, number>) {
  return Object.entries(obj)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Sort by value descending
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// Custom tooltip formatter
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-sm">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Percent formatter for pie charts
const percentFormatter = (value: number, total: number) => {
  const percent = (value / total) * 100;
  return `${percent.toFixed(0)}%`;
};

/* ---------------------------- component ------------------------- */
export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7d");
  const [departmentView, setDepartmentView] = useState("bar"); // bar or pie

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);

    // In a real application, this would be a fetch call
    // fetch("/api/admin/analytics", { credentials: "include" })
    //   .then((r) => r.json())
    //   .then((d) => setData(d))
    //   .finally(() => setLoading(false));

    // Mock data fetch with timeout to simulate loading
    setTimeout(() => {
      setData({
        totalUsers: 19,
        totalDocuments: 7,
        docsPerCategory: {
          Training: 0,
          Administrative: 0,
          Bar: 0,
          "Lord have mercy": 1,
          Fooo: 3,
          Manual: 0,
          Reports: 0,
          General: 2,
          Invoices: 1,
        },
        docsPerDepartment: {
          Maths: 1,
          CV: 0,
          FINANCE: 1,
          STATS: 0,
          MISC: 0,
          ISE: 0,
          SCIENCE: 0,
          IT: 3,
          SALES: 2,
        },
        docsByStatus: {
          PENDING: 6,
          VERIFIED: 1,
        },
        newUsersLast7Days: 15,
        newDocsLast7Days: 6,
        generatedAt: "2025-05-18T00:10:38.204050016",
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <Skeleton className="h-64 col-span-1 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!data) return null;

  /* ---------- transform for charts ---------- */
  const catData = toChartData(data.docsPerCategory).filter(
    (item) => item.value > 0,
  );
  const deptData = toChartData(data.docsPerDepartment).filter(
    (item) => item.value > 0,
  );
  const statusData = toChartData(data.docsByStatus);

  // Calculate totals for percentages
  const totalStatus = statusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* ---- Header with refresh button ---- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
          <p className="text-muted-foreground">
            Overview of system usage and document statistics
          </p>
        </div>
        <Button
          onClick={fetchData}
          className="flex items-center gap-2"
          variant="outline"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* ---- stat cards ---- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-6 w-6 text-indigo-500" />}
          label="Total Users"
          value={data.totalUsers}
          trend={{
            value: data.newUsersLast7Days,
            label: "New this week",
          }}
        />
        <StatCard
          icon={<FileText className="h-6 w-6 text-cyan-500" />}
          label="Total Documents"
          value={data.totalDocuments}
          trend={{
            value: data.newDocsLast7Days,
            label: "New this week",
          }}
        />
        <StatCard
          icon={<UserPlus className="h-6 w-6 text-emerald-500" />}
          label="New Users"
          value={data.newUsersLast7Days}
          badge="7d"
        />
        <StatCard
          icon={<FilePlus2 className="h-6 w-6 text-amber-500" />}
          label="New Documents"
          value={data.newDocsLast7Days}
          badge="7d"
        />
      </div>

      {/* ---- Main charts section ---- */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="status">By Status</TabsTrigger>
        </TabsList>

        {/* Docs per category */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                    Documents by Category
                  </CardTitle>
                  <CardDescription>
                    Distribution of documents across content categories
                  </CardDescription>
                </div>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-36 mt-2 md:mt-0">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              {catData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={catData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" name="Documents" radius={[4, 4, 0, 0]}>
                      {catData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center flex-col gap-2 text-muted-foreground">
                  <FileText className="h-12 w-12 opacity-20" />
                  <p>No documents in any category</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Docs per department */}
        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-cyan-600" />
                    Documents by Department
                  </CardTitle>
                  <CardDescription>
                    Distribution of documents across organizational departments
                  </CardDescription>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button
                    variant={departmentView === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDepartmentView("bar")}
                    className="flex items-center gap-1"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Bar</span>
                  </Button>
                  <Button
                    variant={departmentView === "pie" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDepartmentView("pie")}
                    className="flex items-center gap-1"
                  >
                    <PieChart className="h-4 w-4" />
                    <span className="hidden sm:inline">Pie</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              {deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {departmentView === "bar" ? (
                    <BarChart
                      layout="vertical"
                      data={deptData}
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Documents"
                        radius={[0, 4, 4, 0]}
                      >
                        {deptData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={deptData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={2}
                        labelLine={true}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {deptData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center flex-col gap-2 text-muted-foreground">
                  <Users className="h-12 w-12 opacity-20" />
                  <p>No departments with documents</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Docs by status */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <PieChart className="h-5 w-5 text-emerald-500" />
                Documents by Status
              </CardTitle>
              <CardDescription>
                Current verification status of all documents in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name}: ${value} (${percentFormatter(value, totalStatus)})`
                    }
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} documents`, "Count"]}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ---- footer with data timestamp ---- */}
      <div className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Last updated: {formatDate(data.generatedAt)}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center gap-1"
        >
          View detailed reports
          <ArrowUpRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/* --------------------- enhanced stat card --------------------- */
interface TrendInfo {
  value: number;
  label: string;
}

function StatCard({
  icon,
  label,
  value,
  trend,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  trend?: TrendInfo;
  badge?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="p-2 rounded-md bg-muted/30">{icon}</div>
        {badge && (
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
            {badge}
          </span>
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>

        {trend && (
          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span className="font-medium text-emerald-500">+{trend.value}</span>
            <span>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
