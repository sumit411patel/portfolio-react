import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  TrendingUp,
  Users,
  MessageSquare,
  ShieldCheck,
  KeyRound,
  Check,
  X,
  Upload,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { API_URL } from '../config/api';

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'projects' | 'inquiries'

  // Auth State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Project Modal State (Add/Edit)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    githubLink: '',
    liveLink: '',
    toolsInput: '',
    imageUrl: '',
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState('');

  // Verify existing token on load
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, []);

  useEffect(() => {
    if (token) {
      if (activeTab === 'dashboard') fetchDashboardData();
      if (activeTab === 'projects') fetchProjects();
      if (activeTab === 'inquiries') fetchInquiries();
    }
  }, [token, activeTab]);

  const verifyToken = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        handleLogout();
      }
    } catch (e) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setOtpSent(false);
    setDevOtp(null);
  };

  // ---------------- AUTH HANDLERS ----------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    setAuthLoading(true);
    setAuthError('');
    setDevOtp(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        if (data.devOtp) {
          setDevOtp(data.devOtp);
          setOtp(data.devOtp); // Auto-fill for friction-free dev testing
        }
      } else {
        setAuthError(data.error || 'Failed to send OTP code.');
      }
    } catch (err) {
      setAuthError('Connection error. Ensure backend server is running.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;

    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
      } else {
        setAuthError(data.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setAuthError('Error verifying OTP.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ---------------- DATA FETCHERS ----------------
  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`${API_URL}/api/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchProjects = async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchInquiries = async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  // ---------------- PROJECT CRUD HANDLERS ----------------
  const openAddProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      name: '',
      description: '',
      githubLink: '',
      liveLink: '',
      toolsInput: '',
      imageUrl: '',
      imageFile: null
    });
    setImagePreview('');
    setProjectError('');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      name: proj.name || '',
      description: proj.description || '',
      githubLink: proj.githubLink || '',
      liveLink: proj.liveLink || '',
      toolsInput: Array.isArray(proj.tools) ? proj.tools.join(', ') : '',
      imageUrl: proj.image || '',
      imageFile: null
    });
    const imgUrl = proj.image
      ? proj.image.startsWith('http')
        ? proj.image
        : `${API_URL}${proj.image}`
      : '';
    setImagePreview(imgUrl);
    setProjectError('');
    setIsProjectModalOpen(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectForm({ ...projectForm, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.description) {
      setProjectError('Project name and description are required.');
      return;
    }

    if (!editingProject && !projectForm.imageFile && !projectForm.imageUrl) {
      setProjectError('Project image is required.');
      return;
    }

    setSavingProject(true);
    setProjectError('');

    try {
      const formData = new FormData();
      formData.append('name', projectForm.name);
      formData.append('description', projectForm.description);
      formData.append('githubLink', projectForm.githubLink);
      formData.append('liveLink', projectForm.liveLink);

      // Parse comma-separated tools into JSON array string
      const toolsArr = projectForm.toolsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append('tools', JSON.stringify(toolsArr));

      if (projectForm.imageFile) {
        formData.append('imageFile', projectForm.imageFile);
      } else if (projectForm.imageUrl) {
        formData.append('imageUrl', projectForm.imageUrl);
      }

      const url = editingProject
        ? `${API_URL}/api/projects/${editingProject.id}`
        : `${API_URL}/api/projects`;

      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsProjectModalOpen(false);
        fetchProjects();
      } else {
        setProjectError(data.error || 'Failed to save project.');
      }
    } catch (err) {
      setProjectError('Error saving project.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- INQUIRY HANDLERS ----------------
  const handleToggleInquiryStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const res = await fetch(`${API_URL}/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry message?')) return;
    try {
      const res = await fetch(`${API_URL}/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==================== UNAUTHENTICATED LOGIN VIEW ====================
  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 selection:bg-accent selection:text-white">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">Admin Portal</h1>
              <p className="text-xs text-zinc-400">Sumit Patel Portfolio Control Center</p>
            </div>
          </div>

          {authError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-4 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {devOtp && (
            <div className="mb-6 bg-accent/10 border border-accent/30 text-accent text-xs p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold">🔑 Dev Mode OTP Code:</p>
                <p className="text-lg font-mono tracking-widest mt-0.5">{devOtp}</p>
              </div>
              <span className="text-[10px] bg-accent text-white px-2 py-1 rounded">Auto-filled</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your registered email..."
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-accent text-white font-display font-bold text-sm py-3.5 rounded-xl hover:bg-accent-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                {authLoading ? 'Sending OTP...' : 'Send OTP Code →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-xs text-zinc-400 mb-2">
                OTP sent to <span className="text-white font-medium">{email}</span>.{' '}
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-accent underline ml-1"
                >
                  Change Email
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Enter 6-Digit OTP Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 text-white text-center font-mono tracking-widest text-lg rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-accent text-white font-display font-bold text-sm py-3.5 rounded-xl hover:bg-accent-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                {authLoading ? 'Verifying...' : 'Verify OTP & Sign In →'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==================== AUTHENTICATED ADMIN DASHBOARD VIEW ====================
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-sm">
              SP
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-white leading-tight">Admin Dashboard</h1>
              <p className="text-xs text-zinc-400">Sumit Patel Portfolio Control</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-2.5 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Analytics
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`inline-flex items-center gap-2.5 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all ${
              activeTab === 'projects'
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            Projects ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`inline-flex items-center gap-2.5 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all ${
              activeTab === 'inquiries'
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            Inquiries ({inquiries.filter((i) => i.status === 'unread').length} unread)
          </button>
        </div>

        {/* ================= TAB 1: DASHBOARD ANALYTICS ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Visitors</p>
                  <h3 className="font-display font-extrabold text-3xl text-white mt-1">
                    {dashboardData?.totalVisitors || 0}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Inquiries</p>
                  <h3 className="font-display font-extrabold text-3xl text-white mt-1">
                    {dashboardData?.totalInquiries || 0}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Unread Inquiries</p>
                  <h3 className="font-display font-extrabold text-3xl text-accent mt-1">
                    {dashboardData?.unreadInquiries || 0}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Active Projects</p>
                  <h3 className="font-display font-extrabold text-3xl text-white mt-1">
                    {dashboardData?.totalProjects || 0}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Analytics Charts & Activity */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Visitor Trends Chart */}
              <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Daily Visitor Traffic</h3>
                    <p className="text-xs text-zinc-400">Visitor hits logged across pages</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>

                {dashboardData?.visitorTrends && dashboardData.visitorTrends.length > 0 ? (
                  <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-4 border-b border-zinc-800">
                    {dashboardData.visitorTrends.map((v, idx) => {
                      const maxHits = Math.max(...dashboardData.visitorTrends.map((t) => t.count), 1);
                      const heightPercent = Math.max(15, Math.round((v.count / maxHits) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-xs font-mono text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                            {v.count}
                          </span>
                          <div
                            className="w-full bg-accent/80 group-hover:bg-accent rounded-t-lg transition-all"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[10px] text-zinc-500 truncate w-full text-center">
                            {v.date.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-zinc-500 text-sm">
                    No visitor traffic data recorded yet.
                  </div>
                )}
              </div>

              {/* Recent Inquiries List */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-4">Recent Messages</h3>
                  <div className="space-y-3">
                    {dashboardData?.recentInquiries && dashboardData.recentInquiries.length > 0 ? (
                      dashboardData.recentInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="bg-zinc-800/60 p-3.5 rounded-xl border border-zinc-700/50 flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">{inq.name}</span>
                            <span className="text-[10px] text-zinc-400">{inq.createdAt?.slice(0, 10)}</span>
                          </div>
                          <p className="text-xs text-zinc-300 line-clamp-1">{inq.subject || inq.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-500">No contact messages received yet.</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="mt-4 text-xs font-semibold text-accent hover:underline text-center w-full"
                >
                  View All Inquiries →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROJECTS MANAGEMENT ================= */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Projects Manager</h2>
                <p className="text-xs text-zinc-400">Add, edit, or delete portfolio projects</p>
              </div>

              <button
                onClick={openAddProjectModal}
                className="inline-flex items-center gap-2 bg-accent text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
              >
                <Plus className="w-4 h-4" />
                Add New Project
              </button>
            </div>

            {/* Projects Table / List */}
            {loadingData ? (
              <div className="text-center py-12 text-zinc-500">Loading projects...</div>
            ) : projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => {
                  const toolsArr = Array.isArray(proj.tools) ? proj.tools : [];
                  const imgUrl = proj.image
                    ? proj.image.startsWith('http')
                      ? proj.image
                      : `${API_URL}${proj.image}`
                    : '';

                  return (
                    <div
                      key={proj.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-full h-44 bg-zinc-800 overflow-hidden relative">
                          <img src={imgUrl} alt={proj.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="p-5">
                          {toolsArr.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {toolsArr.map((t, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-0.5 rounded-full"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          <h3 className="font-display font-bold text-lg text-white mb-2">{proj.name}</h3>
                          <p className="text-xs text-zinc-400 line-clamp-3 mb-4">{proj.description}</p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-zinc-800/80 mt-2 flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditProjectModal(proj)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>

                        <div className="flex gap-2 text-zinc-400">
                          {proj.githubLink && (
                            <a href={proj.githubLink} target="_blank" rel="noreferrer" title="GitHub">
                              <svg className="w-4 h-4 fill-current hover:text-white" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                            </a>
                          )}
                          {proj.liveLink && (
                            <a href={proj.liveLink} target="_blank" rel="noreferrer" title="Live Site">
                              <ExternalLink className="w-4 h-4 hover:text-accent" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-sm">
                No projects created yet. Click "Add New Project" above to create one.
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: INQUIRIES SECTION ================= */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display font-bold text-2xl text-white">Inquiries & Contact Messages</h2>
              <p className="text-xs text-zinc-400">
                User messages submitted through your portfolio contact form
              </p>
            </div>

            {loadingData ? (
              <div className="text-center py-12 text-zinc-500">Loading messages...</div>
            ) : inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`bg-zinc-900 border rounded-2xl p-6 transition-all ${
                      inq.status === 'unread' ? 'border-accent/50 bg-zinc-900/90' : 'border-zinc-800 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-zinc-800">
                      <div>
                        <span className="font-bold text-base text-white mr-3">{inq.name}</span>
                        <a href={`mailto:${inq.email}`} className="text-xs text-accent hover:underline">
                          {inq.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : ''}
                        </span>

                        <button
                          onClick={() => handleToggleInquiryStatus(inq.id, inq.status)}
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            inq.status === 'unread'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {inq.status === 'unread' ? 'Mark Read' : 'Read'}
                        </button>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-zinc-200 mb-1">{inq.subject}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{inq.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-sm">
                No inquiries received yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= ADD / EDIT PROJECT MODAL ================= */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
              <h3 className="font-display font-bold text-xl text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {projectError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
                {projectError}
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-5">
              {/* Image Upload / Preview */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Project Banner Image <span className="text-accent">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {imagePreview ? (
                    <div className="w-40 h-28 rounded-xl overflow-hidden bg-zinc-800 relative shrink-0 border border-zinc-700">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : null}

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-light cursor-pointer"
                    />
                    <p className="text-[11px] text-zinc-500">OR enter image URL below:</p>
                    <input
                      type="text"
                      placeholder="https://example.com/image.png"
                      value={projectForm.imageUrl}
                      onChange={(e) => {
                        setProjectForm({ ...projectForm, imageUrl: e.target.value });
                        if (e.target.value) setImagePreview(e.target.value);
                      }}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Project Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Town Taskers - Service Marketplace"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Tools and Technologies */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Tools &amp; Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SaaS, Figma, Tailwind, Django, React.js"
                  value={projectForm.toolsInput}
                  onChange={(e) => setProjectForm({ ...projectForm, toolsInput: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Description <span className="text-accent">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed project summary..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {/* Links */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    GitHub Code Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/sumit411patel/repo"
                    value={projectForm.githubLink}
                    onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Live Demo Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://myproject.com"
                    value={projectForm.liveLink}
                    onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="text-xs font-semibold px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="text-xs font-bold px-6 py-2.5 rounded-xl bg-accent text-white hover:bg-accent-light disabled:opacity-50"
                >
                  {savingProject ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
