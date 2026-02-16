import * as React from "react"
import { Users, DollarSign, FileText, Eye, BarChart3, CalendarDays } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"

// Centralized Dashboard Data
const DASHBOARD_DATA = {
    totalFollowers: "94,038",
    followerChange: "+12.4%",
    totalViews: "100,538",
    viewsChange: "+24.7%",
    totalPosts: "1,067",
    postsChange: "+8.2%",
    monthlyGrowth: [
        { name: 'AUG', followers: 4200, views: 7200 },
        { name: 'SEP', followers: 7100, views: 16500 },
        { name: 'OCT', followers: 9800, views: 6800 },
        { name: 'NOV', followers: 8200, views: 14200 },
        { name: 'DEC', followers: 12500, views: 8900 },
        { name: 'JAN', followers: 10800, views: 19500 },
    ]
};

export function Dashboard() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <div className="flex gap-2">
                    {/* Badge removed */}
                </div>
            </div>

            {/* Row 1: KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <KPICard
                    title="Total Followers"
                    value={DASHBOARD_DATA.totalFollowers}
                    change={DASHBOARD_DATA.followerChange}
                    subtext="Follower growth since joining Vistro OS"
                    icon={Users}
                />
                <KPICard
                    title="Total Views"
                    value={DASHBOARD_DATA.totalViews}
                    change={DASHBOARD_DATA.viewsChange}
                    subtext="View growth since joining Vistro OS"
                    icon={Eye}
                />
                <KPICard
                    title="Total Posts"
                    value={DASHBOARD_DATA.totalPosts}
                    change={DASHBOARD_DATA.postsChange}
                    subtext="Total posts across your social networks"
                    icon={FileText}
                />
            </div>

            {/* Row 2: Heatmap & Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Daily Growth Calendar (Heatmap) */}
                <Card className="p-6 flex flex-col h-full bg-card text-card-foreground">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-foreground">Daily Growth Calendar</h3>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {/* Days Header */}
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="flex items-center justify-center text-xs font-medium text-muted-foreground mb-2">{d}</div>
                        ))}
                        {/* Heatmap Grid */}
                        {Array.from({ length: 35 }).map((_, i) => {
                            // Generate random intensity for demo
                            const intensity = Math.floor(Math.random() * 5);
                            const opacityClass = [
                                "bg-slate-500 dark:bg-zinc-800",               // 0
                                "bg-[#06b6d4] dark:bg-[#06b6d4]/30",          // 1 (Cyan)
                                "bg-[#6366f1] dark:bg-[#6366f1]/50",          // 2 (Indigo)
                                "bg-[#7c3aed] dark:bg-[#7c3aed]/70",          // 3 (Violet)
                                "bg-indigo-600 dark:bg-indigo-600",            // 4
                                "bg-indigo-700 dark:bg-indigo-500 shadow-md"  // 5 (max)
                            ][intensity];

                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        "aspect-square rounded-md flex items-center justify-center text-xs font-medium text-white transition-all hover:scale-105 cursor-pointer",
                                        opacityClass
                                    )}
                                >
                                    {i + 1}
                                </div>
                            )
                        })}
                    </div>
                </Card>

                {/* Right Column: Monthly Totals & Recent Activity */}
                <div className="flex flex-col gap-6 h-full">
                    <Card className="p-6 flex-1 flex flex-col min-h-0 bg-card text-card-foreground">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-md text-indigo-600 dark:text-indigo-400">
                                    <BarChart3 className="h-4 w-4" />
                                </div>
                                <h3 className="font-bold text-foreground text-sm">Monthly Totals</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-[#7c3aed]" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Followers</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-[#4f46e5]" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Views</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <MonthlyBarChart />
                        </div>
                    </Card>

                    <Card className="p-6 flex-1 flex flex-col min-h-0 bg-card text-card-foreground">
                        <h3 className="font-bold text-foreground text-sm mb-4">Recent Activity</h3>
                        <div className="space-y-4 flex-1 overflow-y-auto">
                            <ActivityItem
                                icon={<Users className="h-4 w-4" />}
                                title="New Follower Milestone"
                                time="2h ago"
                                badge="1k Club"
                            />
                            <ActivityItem
                                icon={<DollarSign className="h-4 w-4" />}
                                title="Sponsorship Payment"
                                time="5h ago"
                                amount="+$1,200"
                            />
                            <ActivityItem
                                icon={<FileText className="h-4 w-4" />}
                                title="Post Running: AI Trends"
                                time="1d ago"
                                status="Active"
                            />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Row 3: Social Connect Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <SocialCard platform="TikTok" handle="@vistrotech" status="disconnected" icon="/Icons/tt.png" />
                <SocialCard platform="YouTube" handle="Vistro Tech" status="disconnected" icon="/Icons/yt.png" />
                <SocialCard platform="X (Twitter)" handle="@vistro_os" status="disconnected" icon="/Icons/x.png" />
                <SocialCard platform="Instagram" handle="@vistro.tech" status="disconnected" icon="/Icons/ig.png" />
                <SocialCard platform="Facebook" handle="Vistro Inc." status="disconnected" icon="/Icons/fb.png" />
            </div>
        </div>
    )
}

interface KPICardProps {
    title: string
    value: string
    change: string
    subtext: string
    icon: any
}

function KPICard({ title, value, change, subtext, icon: Icon }: KPICardProps) {
    return (
        <Card className="p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 bg-card text-card-foreground border-border">
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:opacity-20">
                <Icon className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="relative z-10">
                <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">{title}</p>
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-extrabold pb-1 text-foreground">
                        {value}
                    </h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                        {change}
                    </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">{subtext}</p>
            </div>
        </Card>
    )
}

function MonthlyBarChart() {
    const [hoveredBar, setHoveredBar] = React.useState<{ index: number, key: string } | null>(null);

    const data = React.useMemo(() => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const now = new Date();

        // This still uses rolling logic for names, but pulls static growth values for demo consistency
        return DASHBOARD_DATA.monthlyGrowth.map((item, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            return {
                ...item,
                name: months[d.getMonth()]
            };
        });
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={4}>
                <defs>
                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={1} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="colorFollowersHover" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6d28d9" stopOpacity={1} />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="colorViewsHover" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3730a3" stopOpacity={1} />
                        <stop offset="100%" stopColor="#0891b2" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                    contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        backgroundColor: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        padding: '8px 12px'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600, color: 'hsl(var(--foreground))', padding: '2px 0' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 700, color: 'hsl(var(--muted-foreground))', marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Bar
                    dataKey="followers"
                    radius={[12, 12, 0, 0]}
                    barSize={50}
                    onMouseEnter={(_, index) => setHoveredBar({ index, key: 'followers' })}
                    onMouseLeave={() => setHoveredBar(null)}
                >
                    {data.map((_, index) => (
                        <Cell
                            key={`cell-followers-${index}`}
                            fill={hoveredBar?.index === index && hoveredBar?.key === 'followers' ? 'url(#colorFollowersHover)' : 'url(#colorFollowers)'}
                            className="transition-all duration-300"
                        />
                    ))}
                </Bar>
                <Bar
                    dataKey="views"
                    radius={[12, 12, 0, 0]}
                    barSize={50}
                    onMouseEnter={(_, index) => setHoveredBar({ index, key: 'views' })}
                    onMouseLeave={() => setHoveredBar(null)}
                >
                    {data.map((_, index) => (
                        <Cell
                            key={`cell-views-${index}`}
                            fill={hoveredBar?.index === index && hoveredBar?.key === 'views' ? 'url(#colorViewsHover)' : 'url(#colorViews)'}
                            className="transition-all duration-300"
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

interface ActivityItemProps {
    icon: React.ReactNode
    title: string
    time: string
    amount?: string
    badge?: string
    status?: string
}

function ActivityItem({ icon, title, time, amount, badge, status }: ActivityItemProps) {
    return (
        <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-foreground leading-none">{title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{time}</p>
                </div>
            </div>
            <div>
                {amount && <span className="text-sm font-bold text-green-600 dark:text-green-400">{amount}</span>}
                {badge && <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs rounded-full">{badge}</span>}
                {status && <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded-full">{status}</span>}
            </div>
        </div>
    )
}

interface SocialCardProps {
    platform: string
    handle: string
    status: "connected" | "issue" | "disconnected"
    icon: string
}

function SocialCard({ platform, handle, status, icon }: SocialCardProps) {
    return (
        <Card className="aspect-square p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all cursor-pointer group border-border hover:border-indigo-500/50 dark:hover:border-indigo-400/50 bg-card text-card-foreground">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg overflow-hidden group-hover:scale-110 transition-transform">
                <img src={icon} alt={platform} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
                <p className="text-sm font-bold text-foreground">{platform}</p>
                <p className="text-xs text-muted-foreground">{handle}</p>
            </div>
            <div className="mt-1">
                {status === 'connected' && <div className="h-2 w-2 rounded-full bg-green-500 ring-2 ring-green-100 dark:ring-green-900/20 animate-pulse" />}
                {status === 'issue' && <div className="h-2 w-2 rounded-full bg-orange-500 ring-2 ring-orange-100 dark:ring-orange-900/20 animate-pulse" />}
                {status === 'disconnected' && <div className="h-2 w-2 rounded-full bg-muted-foreground/30 shadow-[0_0_8px_rgba(0,0,0,0.1)]" />}
            </div>
        </Card>
    )
}
