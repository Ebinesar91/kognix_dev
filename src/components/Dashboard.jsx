import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import KognixLogo from './KognixLogo'
import {
    LayoutDashboard, Users, UserRound, GraduationCap,
    Wallet, Calendar, Bell, MessageSquare, Search,
    ChevronRight, MoreHorizontal, Facebook, Twitter,
    Linkedin, Globe, Mail, LogOut, Settings as SettingsIcon
} from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'

const earningsData = [
    { name: 'Jan', collections: 4000, fees: 2400 },
    { name: 'Feb', collections: 3000, fees: 1398 },
    { name: 'Mar', collections: 2000, fees: 9800 },
    { name: 'Apr', collections: 2780, fees: 3908 },
    { name: 'May', collections: 1890, fees: 4800 },
    { name: 'Jun', collections: 2390, fees: 3800 },
    { name: 'Jul', collections: 3490, fees: 4300 },
]

const expenseData = [
    { name: 'Jan 2024', val: 150000, color: '#2dd4bf' },
    { name: 'Feb 2024', val: 100000, color: '#3b82f6' },
    { name: 'Mar 2024', val: 80000, color: '#f59e0b' },
]

const studentDonutData = [
    { name: 'Female', value: 400, color: '#3b82f6' },
    { name: 'Male', value: 300, color: '#f97316' },
]

export default function Dashboard({ user, showToast }) {
    const [profile, setProfile] = useState(null)
    const [activeTab, setActiveTab] = useState('dashboard')

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return
            const { data } = await supabase.from('profiles').eq('id', user.id).single()
            if (data) setProfile(data)
        }
        fetchProfile()
    }, [user])

    const handleSignOut = () => supabase.auth.signOut()

    const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="nav-icon" /> },
        { id: 'students', label: 'Students', icon: <GraduationCap className="nav-icon" /> },
        { id: 'teachers', label: 'Teachers', icon: <Users className="nav-icon" /> },
        { id: 'parents', label: 'Parents', icon: <UserRound className="nav-icon" /> },
        { id: 'finance', label: 'Finance', icon: <Wallet className="nav-icon" /> },
        { id: 'event', label: 'Event', icon: <Calendar className="nav-icon" /> },
        { id: 'notice', label: 'Notice Board', icon: <MessageSquare className="nav-icon" /> },
        { id: 'message', label: 'Message', icon: <Mail className="nav-icon" /> },
    ]

    const stats = [
        { label: 'Students', value: '150,000', icon: <GraduationCap size={28} color="#059669" />, bg: '#ecfdf5' },
        { label: 'Teachers', value: '2,250', icon: <Users size={28} color="#2563eb" />, bg: '#eff6ff' },
        { label: 'Parents', value: '5,690', icon: <UserRound size={28} color="#d97706" />, bg: '#fffbeb' },
        { label: 'Earnings', value: '$193,000', icon: <Wallet size={28} color="#dc2626" />, bg: '#fef2f2' },
    ]

    return (
        <div className="dashboard-root">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <KognixLogo size={36} />
                </div>
                <nav className="sidebar-nav">
                    {sidebarLinks.map(link => (
                        <div
                            key={link.id}
                            className={`nav-item ${activeTab === link.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(link.id)}
                        >
                            {link.icon}
                            {link.label}
                        </div>
                    ))}
                    <div className="nav-item" onClick={handleSignOut} style={{ marginTop: '20px', color: '#ef4444' }}>
                        <LogOut className="nav-icon" />
                        Sign Out
                    </div>
                </nav>
            </aside>

            {/* Main View */}
            <main className="main-view">
                {/* Navbar */}
                <header className="navbar">
                    <div className="nav-search">
                        <Search size={18} color="#888" />
                        <input type="text" placeholder="Search here..." />
                    </div>

                    <div className="nav-actions">
                        <button className="action-btn" onClick={() => showToast('No new messages', 'info')}>
                            <Mail size={20} />
                            <span className="badge">5</span>
                        </button>
                        <button className="action-btn" onClick={() => showToast('New system update available', 'success')}>
                            <Bell size={20} />
                            <span className="badge">8</span>
                        </button>
                        <div className="nav-profile">
                            <div className="profile-info">
                                <div className="profile-name">{profile?.full_name || 'Admin User'}</div>
                                <div className="profile-role">Admin</div>
                            </div>
                            <div className="avatar">
                                <UserRound size={22} color="#1e3a6e" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <section className="dashboard-content">
                    <div className="content-header">
                        <h1>Admin Dashboard</h1>
                        <div className="breadcrumbs">
                            Home <ChevronRight size={14} /> <span className="active">Admin</span>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        {stats.map((s, idx) => (
                            <div key={idx} className="stat-card">
                                <div className="stat-icon-wrap" style={{ background: s.bg }}>
                                    {s.icon}
                                </div>
                                <div className="stat-val-wrap">
                                    <h3>{s.label}</h3>
                                    <p>{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="dash-layout-grid">
                        <div className="dash-box">
                            <div className="box-head">
                                <h2>Earnings</h2>
                                <div className="v-dots"><MoreHorizontal size={20} /></div>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={earningsData}>
                                        <defs>
                                            <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="collections" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorColl)" />
                                        <Area type="monotone" dataKey="fees" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorFees)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="dash-box">
                            <div className="box-head">
                                <h2>Finance</h2>
                                <div className="v-dots"><MoreHorizontal size={20} /></div>
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 700, margin: '10px 0' }}>$ 2,590</div>
                            <div style={{ display: 'flex', gap: '4px', height: '6px', borderRadius: '3px', overflow: 'hidden', margin: '20px 0' }}>
                                <div style={{ flex: '0.6', background: '#10b981' }}></div>
                                <div style={{ flex: '0.2', background: '#3b82f6' }}></div>
                                <div style={{ flex: '0.1', background: '#f59e0b' }}></div>
                                <div style={{ flex: '0.1', background: '#ef4444' }}></div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Total Students</span>
                                    <b>150,000</b>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Total Teachers</span>
                                    <b>2,250</b>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /> Total Transport</span>
                                    <b>560</b>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="bottom-grid">
                        {/* Expenses */}
                        <div className="bottom-box">
                            <div className="box-head">
                                <h2>Expenses</h2>
                                <div className="v-dots"><MoreHorizontal size={20} /></div>
                            </div>
                            <div className="chart-container" style={{ height: '350px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={expenseData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                        <Bar dataKey="val" radius={[6, 6, 0, 0]} barSize={40}>
                                            {expenseData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Students Doughnut */}
                        <div className="bottom-box">
                            <div className="box-head">
                                <h2>Students</h2>
                                <div className="v-dots"><MoreHorizontal size={20} /></div>
                            </div>
                            <div className="chart-container" style={{ height: '350px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={studentDonutData}
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {studentDonutData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Notice Board */}
                        <div className="bottom-box">
                            <div className="box-head">
                                <h2>Notice Board</h2>
                                <div className="v-dots"><MoreHorizontal size={20} /></div>
                            </div>
                            <div className="notice-list">
                                {[
                                    { date: '16 June, 2019', msg: 'Great School Management text of printing.', col: '#2dd4bf' },
                                    { date: '16 June, 2019', msg: 'Great School Management printing.', col: '#f59e0b' },
                                    { date: '16 June, 2019', msg: 'Great School Management mene esom.', col: '#ec4899' },
                                ].map((n, i) => (
                                    <div key={i} style={{ padding: '16px 0', borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none' }}>
                                        <span style={{ fontSize: '11px', color: '#fff', background: n.col, padding: '3px 10px', borderRadius: '20px' }}>{n.date}</span>
                                        <p style={{ margin: '10px 0 4px', fontSize: '13.5px', fontWeight: 600, color: '#333' }}>{n.msg}</p>
                                        <small style={{ color: '#bbb' }}>Jennyfar Lopez / 5 min ago</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Social Stats */}
                    <div className="social-grid">
                        <a href="#" className="social-pill pill-fb">
                            <Facebook fill="white" /> 30,000 Likes
                        </a>
                        <a href="#" className="social-pill pill-tw">
                            <Twitter fill="white" /> 1,11,000 Followers
                        </a>
                        <a href="#" className="social-pill pill-gp">
                            <Globe /> 19,000 Google Plus
                        </a>
                        <a href="#" className="social-pill pill-li">
                            <Linkedin fill="white" /> 45,000 Followers
                        </a>
                    </div>

                </section>
            </main>
        </div>
    )
}
