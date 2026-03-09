import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import KognixLogo from './KognixLogo';
import {
    FaBars, FaSearch, FaBell, FaEnvelope, FaUserCircle,
    FaHome, FaUserGraduate, FaChalkboardTeacher, FaUserFriends,
    FaMoneyBillWave, FaCalendarAlt, FaClipboardList, FaCommentDots,
    FaEllipsisH, FaFacebookF, FaTwitter, FaGooglePlusG, FaLinkedinIn
} from 'react-icons/fa';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// --- DATA ---
const earningsData = [
    { name: 'Jan', collections: 4000, fees: 2400 },
    { name: 'Feb', collections: 3000, fees: 1398 },
    { name: 'Mar', collections: 2000, fees: 9800 },
    { name: 'Apr', collections: 2780, fees: 3908 },
    { name: 'May', collections: 1890, fees: 4800 },
    { name: 'Jun', collections: 2390, fees: 3800 },
    { name: 'Jul', collections: 3490, fees: 4300 },
];

const expenseData = [
    { name: 'Jan 2024', val: 15000, color: '#10b981' },
    { name: 'Feb 2024', val: 10000, color: '#3b82f6' },
    { name: 'Mar 2024', val: 8000, color: '#f59e0b' },
];

const studentDonutData = [
    { name: 'Female', value: 400, color: '#3b82f6' },
    { name: 'Male', value: 300, color: '#f97316' },
];

// --- COMPONENTS ---

const StatsCard = ({ title, value, icon, color, bg }) => (
    <div className="stats-card">
        <div className="stat-info">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
        <div className="stat-icon" style={{ backgroundColor: bg, color: color }}>
            {icon}
        </div>
    </div>
);

const EarningsChart = () => (
    <div className="chart-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2>Earnings</h2>
            <FaEllipsisH style={{ color: '#ccc', cursor: 'pointer' }} />
        </div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }} />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total Collections</span>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>$75,500</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Fees Collection</span>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>$35,500</span>
            </div>
        </div>
        <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="collections" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="fees" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const FinanceList = () => (
    <div className="chart-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h2>Finance</h2>
            <FaEllipsisH style={{ color: '#ccc', cursor: 'pointer' }} />
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '20px' }}>$ 2,590</div>
        <div style={{ height: '6px', width: '100%', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden', display: 'flex', marginBottom: '20px' }}>
            <div style={{ width: '60%', background: '#10b981' }} />
            <div style={{ width: '20%', background: '#3b82f6' }} />
            <div style={{ width: '10%', background: '#f59e0b' }} />
            <div style={{ width: '10%', background: '#ef4444' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
                { label: 'Total Students', val: '150,000', col: '#10b981' },
                { label: 'Total Teachers', val: '2,250', col: '#ef4444' },
                { label: 'Total Transport', val: '560', col: '#f59e0b' },
            ].map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.col }} />
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>{f.label}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{f.val}</span>
                </div>
            ))}
        </div>
    </div>
);

// --- MAIN DASHBOARD ---

export default function Dashboard({ user, showToast }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.user_metadata?.full_name || user.email.split('@')[0],
                role: 'Admin'
            });
        }
    }, [user]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const navItems = [
        { name: 'Dashboard', icon: <FaHome /> },
        { name: 'Students', icon: <FaUserGraduate /> },
        { name: 'Teachers', icon: <FaChalkboardTeacher /> },
        { name: 'Parents', icon: <FaUserFriends /> },
        { name: 'Entitle', icon: <FaMoneyBillWave /> },
        { name: 'Finance', icon: <FaMoneyBillWave /> },
        { name: 'Event', icon: <FaCalendarAlt /> },
        { name: 'Notice Board', icon: <FaClipboardList /> },
        { name: 'Message', icon: <FaCommentDots /> },
    ];

    const statsData = [
        { title: 'Students', value: '150000', icon: <FaUserGraduate />, color: '#10b981', bg: '#d1fae5' },
        { title: 'Teachers', value: '2250', icon: <FaChalkboardTeacher />, color: '#3b82f6', bg: '#dbeafe' },
        { title: 'Parents', value: '5690', icon: <FaUserFriends />, color: '#f59e0b', bg: '#fef3c7' },
        { title: 'Earnings', value: '$193000', icon: <FaMoneyBillWave />, color: '#ef4444', bg: '#fee2e2' },
    ];

    return (
        <div className="dashboard-root">
            {/* SIDEBAR */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <KognixLogo size={100} />
                </div>
                <nav className="sidebar-nav">
                    {navItems.map((item, i) => (
                        <div key={i} className={`nav-item ${i === 0 ? 'active' : ''}`}>
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.name}</span>
                        </div>
                    ))}
                    <div className="nav-item" onClick={() => supabase.auth.signOut()} style={{ marginTop: '20px', color: '#ef4444' }}>
                        <FaBars className="nav-icon" />
                        <span>Sign Out</span>
                    </div>
                </nav>
            </aside>

            {/* MAIN VIEW */}
            <main className="main-view">
                {/* NAVBAR */}
                <header className="navbar">
                    <div className="nav-left">
                        <FaBars className="mobile-toggle" onClick={toggleSidebar} />
                        <div className="nav-search">
                            <FaSearch style={{ color: '#9ca3af' }} />
                            <input type="text" placeholder="Search here..." />
                        </div>
                    </div>

                    <div className="nav-right">
                        <div className="action-btn" onClick={() => showToast('New messages received', 'info')}>
                            <FaEnvelope />
                            <span className="badge-dot">5+</span>
                        </div>
                        <div className="action-btn" onClick={() => showToast('New notifications from admin', 'success')}>
                            <FaBell />
                            <span className="badge-dot">8+</span>
                        </div>
                        <div className="nav-profile">
                            <div className="profile-info">
                                <h4 className="profile-name">{profile?.name || 'Nabila A.'}</h4>
                                <span className="profile-role">{profile?.role || 'Admin'}</span>
                            </div>
                            <FaUserCircle className="profile-avatar" />
                        </div>
                    </div>
                </header>

                {/* DASHBOARD CONTENT */}
                <section className="dashboard-content">
                    <div className="content-header">
                        <h1>Admin Dashboard</h1>
                        <p style={{ color: '#6b7280', fontSize: '13px' }}>
                            Home <span style={{ color: '#f59e0b', fontWeight: 600 }}> &gt; Admin</span>
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid-container">
                        {statsData.map((s, i) => (
                            <StatsCard key={i} {...s} />
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="main-grid">
                        <div className="left-col">
                            {/* Earnings Chart */}
                            <EarningsChart />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {/* Expenses Chart (Bar) */}
                                <div className="chart-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <h2>Expenses</h2>
                                        <FaEllipsisH style={{ color: '#ccc', cursor: 'pointer' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                                        {expenseData.map((e, idx) => (
                                            <div key={idx} style={{ fontSize: '12px' }}>
                                                <div style={{ color: '#6b7280' }}>{e.name}</div>
                                                <div style={{ fontWeight: 700 }}>$ {e.val.toLocaleString()}</div>
                                                <div style={{ height: 3, width: '100%', background: e.color, marginTop: 4 }} />
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ height: '200px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={expenseData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                <XAxis dataKey="name" hide />
                                                <YAxis hide />
                                                <Tooltip />
                                                <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={40}>
                                                    {expenseData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Students Pie Chart */}
                                <div className="chart-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <h2>Students</h2>
                                        <FaEllipsisH style={{ color: '#ccc', cursor: 'pointer' }} />
                                    </div>
                                    <div style={{ height: '220px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={studentDonutData}
                                                    innerRadius={60}
                                                    outerRadius={80}
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
                            </div>

                            {/* Event Calendar Widget (Placeholder) */}
                            <div className="chart-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <h2>Event Calendar</h2>
                                    <FaEllipsisH style={{ color: '#ccc', cursor: 'pointer' }} />
                                </div>
                                <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed #e5e7eb', borderRadius: '12px', color: '#9ca3af' }}>
                                    <FaCalendarAlt size={40} style={{ marginBottom: '10px' }} />
                                    <p>February 2026 Calendar</p>
                                </div>
                            </div>
                        </div>

                        <div className="right-col">
                            {/* Finance List */}
                            <FinanceList />

                            {/* Notice Board */}
                            <div className="chart-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <h2>Notice Board</h2>
                                    <FaEllipsisH style={{ color: '#ccc', cursor: 'pointer' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {[
                                        { date: '16 June, 2019', msg: 'Great School Management text of printing.', col: '#10b981' },
                                        { date: '16 June, 2019', msg: 'Great School Management printing.', col: '#f59e0b' },
                                        { date: '16 June, 2019', msg: 'Great School Management mene esom.', col: '#ef4444' },
                                    ].map((n, i) => (
                                        <div key={i} style={{ paddingBottom: '15px', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                                            <span style={{ fontSize: '10px', color: '#fff', background: n.col, padding: '2px 8px', borderRadius: '10px' }}>{n.date}</span>
                                            <p style={{ margin: '8px 0 3px', fontSize: '13px', fontWeight: 600 }}>{n.msg}</p>
                                            <small style={{ color: '#9ca3af' }}>Jennyfar Lopez / 5 min ago</small>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ background: '#3b5998', color: '#fff', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                    <FaFacebookF size={20} />
                                    <div style={{ fontWeight: 700, margin: '5px 0' }}>30,000</div>
                                    <small style={{ opacity: 0.8 }}>Likes</small>
                                </div>
                                <div style={{ background: '#1da1f2', color: '#fff', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                    <FaTwitter size={20} />
                                    <div style={{ fontWeight: 700, margin: '5px 0' }}>1,11,100</div>
                                    <small style={{ opacity: 0.8 }}>Followers</small>
                                </div>
                                <div style={{ background: '#ea4335', color: '#fff', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                    <FaGooglePlusG size={20} />
                                    <div style={{ fontWeight: 700, margin: '5px 0' }}>19,000</div>
                                    <small style={{ opacity: 0.8 }}>Plus</small>
                                </div>
                                <div style={{ background: '#0077b5', color: '#fff', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                    <FaLinkedinIn size={20} />
                                    <div style={{ fontWeight: 700, margin: '5px 0' }}>45,000</div>
                                    <small style={{ opacity: 0.8 }}>Followers</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
