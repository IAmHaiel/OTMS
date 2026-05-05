import React, { useState } from 'react';
import {
    LayoutDashboard,
    ClipboardList,
    UserCircle2,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    X,
    Save,
    Eye,
    EyeOff,
    Pencil,
    Lock,
    User,
    Mail,
    Phone,
    MapPin,
    Loader2,
} from 'lucide-react';
import './OpEmployee_Dashboard.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = 'high' | 'medium' | 'low';
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
type NavTab = 'dashboard' | 'my-tasks' | 'profile';

interface Task {
    id: number;
    name: string;
    description: string;
    deadline: string;
    priority: Priority;
    status: TaskStatus;
    progress: number;
    assignedBy: string;
}

interface UserProfile {
    employeeId: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    department: string;
    joinDate: string;
    avatarInitials: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const CURRENT_USER: UserProfile = {
    employeeId: 'EMP-2047',
    fullName: 'Alex Rivera',
    email: 'alex.rivera@opsco.com',
    phone: '+63 917 234 5678',
    address: 'Caloocan, Metro Manila, PH',
    role: 'Field Operations',
    department: 'Operational Team',
    joinDate: '2024-03-15',
    avatarInitials: 'AR',
};

const MY_TASKS: Task[] = [
    { id: 1, name: 'Update delivery route maps', description: 'Review and update all Q2 delivery routes based on new zone assignments for Metro Manila.', deadline: '2026-04-28', priority: 'high', status: 'in-progress', progress: 65, assignedBy: 'Ops Admin' },
    { id: 2, name: 'SLA report for April', description: 'Generate and submit the monthly SLA compliance report to the operations manager.', deadline: '2026-05-01', priority: 'medium', status: 'pending', progress: 0, assignedBy: 'Ops Admin' },
    { id: 3, name: 'Fleet inspection checklist', description: 'Complete vehicle inspection for units V-001 through V-008 and log findings.', deadline: '2026-04-29', priority: 'high', status: 'pending', progress: 0, assignedBy: 'Ops Admin' },
    { id: 4, name: 'Coordinate morning dispatch', description: 'Oversee and log the morning dispatch schedule for the north sector team.', deadline: '2026-04-27', priority: 'medium', status: 'in-progress', progress: 80, assignedBy: 'Ops Admin' },
    { id: 5, name: 'Warehouse zone audit — Sec A', description: 'Conduct physical count and audit for warehouse section A, rows 1–12.', deadline: '2026-04-24', priority: 'low', status: 'completed', progress: 100, assignedBy: 'Ops Admin' },
    { id: 6, name: 'Driver briefing deck', description: 'Prepare orientation briefing materials for three new drivers onboarding next Monday.', deadline: '2026-04-25', priority: 'high', status: 'overdue', progress: 35, assignedBy: 'Ops Admin' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d: string): string => {
    if (!d) return '—';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isEffectivelyOverdue = (t: Task): boolean =>
    t.status !== 'completed' && !!t.deadline && new Date(t.deadline + 'T00:00:00') < new Date();

const effectiveStatus = (t: Task): TaskStatus =>
    isEffectivelyOverdue(t) ? 'overdue' : t.status;

const statusMeta: Record<TaskStatus, { label: string; cls: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending', cls: 'badge-blue', icon: <Clock size={11} /> },
    'in-progress': { label: 'In Progress', cls: 'badge-amber', icon: <Loader2 size={11} /> },
    completed: { label: 'Completed', cls: 'badge-green', icon: <CheckCircle2 size={11} /> },
    overdue: { label: 'Overdue', cls: 'badge-red', icon: <AlertCircle size={11} /> },
};

const priorityMeta: Record<Priority, { cls: string; bar: string }> = {
    high: { cls: 'prio-high', bar: 'bar-red' },
    medium: { cls: 'prio-medium', bar: 'bar-amber' },
    low: { cls: 'prio-low', bar: 'bar-green' },
};

// ─── Progress Update Modal (FR-017) ──────────────────────────────────────────

interface ProgressModalProps {
    task: Task;
    onSave: (id: number, status: TaskStatus, progress: number) => void;
    onClose: () => void;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ task, onSave, onClose }) => {
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [progress, setProgress] = useState(task.progress);

    const handleStatusChange = (s: TaskStatus) => {
        setStatus(s);
        if (s === 'completed') setProgress(100);
        if (s === 'pending') setProgress(0);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-head">
                    <div>
                        <h3>Update Progress</h3>
                        <p className="modal-sub">FR-017 · {task.name}</p>
                    </div>
                    <button className="icon-btn" onClick={onClose}><X size={16} /></button>
                </div>

                {/* Progress Slider */}
                <div className="field">
                    <label>Progress — <strong>{progress}%</strong></label>
                    <div className="slider-wrap">
                        <input
                            type="range" min={0} max={100} step={5}
                            value={progress}
                            disabled={status === 'completed'}
                            onChange={e => setProgress(Number(e.target.value))}
                            className="progress-slider"
                        />
                        <div className="slider-track-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="slider-labels"><span>0%</span><span>50%</span><span>100%</span></div>
                </div>

                {/* Status Select */}
                <div className="field">
                    <label>Status</label>
                    <div className="status-chips">
                        {(['pending', 'in-progress', 'completed'] as TaskStatus[]).map(s => (
                            <button
                                key={s}
                                className={`status-chip${status === s ? ' active' : ''} chip-${s}`}
                                onClick={() => handleStatusChange(s)}
                            >
                                {statusMeta[s].icon}
                                {statusMeta[s].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Visual feedback */}
                <div className="progress-preview">
                    <div className="pp-bar">
                        <div
                            className={`pp-fill ${priorityMeta[task.priority].bar}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="pp-pct">{progress}%</span>
                </div>

                <div className="modal-actions">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => onSave(task.id, status, progress)}>
                        <Save size={13} /> Save Progress
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Task Detail Drawer ───────────────────────────────────────────────────────

interface TaskDetailProps {
    task: Task;
    onUpdate: () => void;
    onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onUpdate, onClose }) => {
    const es = effectiveStatus(task);
    const sm = statusMeta[es];
    const pm = priorityMeta[task.priority];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card detail-card" onClick={e => e.stopPropagation()}>
                <div className="modal-head">
                    <div>
                        <div className="detail-badges">
                            <span className={`badge ${sm.cls}`}>{sm.icon}{sm.label}</span>
                            <span className={`prio-pill ${pm.cls}`}>{task.priority} priority</span>
                        </div>
                        <h3 style={{ marginTop: 8 }}>{task.name}</h3>
                    </div>
                    <button className="icon-btn" onClick={onClose}><X size={16} /></button>
                </div>

                <p className="detail-desc">{task.description}</p>

                <div className="detail-meta-grid">
                    <div className="detail-meta-item">
                        <span className="dmi-label">Deadline</span>
                        <span className={`dmi-value${es === 'overdue' ? ' overdue-text' : ''}`}>{fmtDate(task.deadline)}</span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="dmi-label">Assigned By</span>
                        <span className="dmi-value">{task.assignedBy}</span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="dmi-label">Current Progress</span>
                        <span className="dmi-value">{task.progress}%</span>
                    </div>
                    <div className="detail-meta-item">
                        <span className="dmi-label">Status</span>
                        <span className={`badge ${sm.cls}`}>{sm.label}</span>
                    </div>
                </div>

                <div className="detail-progress">
                    <div className="dp-bar">
                        <div
                            className={`dp-fill ${pm.bar}`}
                            style={{ width: `${task.progress}%` }}
                        />
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn" onClick={onClose}>Close</button>
                    {task.status !== 'completed' && (
                        <button className="btn btn-primary" onClick={onUpdate}>
                            <Pencil size={13} /> Update Progress
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Task Card ────────────────────────────────────────────────────────────────

interface TaskCardProps {
    task: Task;
    onView: (id: number) => void;
    onUpdate: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onView, onUpdate }) => {
    const es = effectiveStatus(task);
    const sm = statusMeta[es];
    const pm = priorityMeta[task.priority];
    const od = es === 'overdue';
    const daysLeft = task.deadline
        ? Math.ceil((new Date(task.deadline + 'T00:00:00').getTime() - Date.now()) / 86400000)
        : null;

    return (
        <div className={`task-card${od ? ' task-card-overdue' : ''}`}>
            <div className="tc-top">
                <span className={`prio-strip ${pm.cls}`} />
                <div className="tc-header">
                    <h4 className="tc-name">{task.name}</h4>
                    <span className={`badge ${sm.cls}`}>{sm.icon}{sm.label}</span>
                </div>
            </div>

            <p className="tc-desc">{task.description}</p>

            <div className="tc-meta">
                <span className={`tc-deadline${od ? ' overdue-text' : daysLeft !== null && daysLeft <= 2 ? ' warning-text' : ''}`}>
                    {od ? '⚠ Overdue' : daysLeft !== null
                        ? daysLeft === 0 ? 'Due today'
                            : daysLeft === 1 ? 'Due tomorrow'
                                : `${daysLeft}d left`
                        : fmtDate(task.deadline)}
                </span>
                <span className="tc-date">{fmtDate(task.deadline)}</span>
            </div>

            <div className="tc-progress-row">
                <div className="tc-bar">
                    <div className={`tc-fill ${pm.bar}`} style={{ width: `${task.progress}%` }} />
                </div>
                <span className="tc-pct">{task.progress}%</span>
            </div>

            <div className="tc-actions">
                <button className="btn btn-sm btn-ghost" onClick={() => onView(task.id)}>
                    <Eye size={13} /> View
                </button>
                {task.status !== 'completed' && (
                    <button className="btn btn-sm btn-primary" onClick={() => onUpdate(task.id)}>
                        <Pencil size={13} /> Update
                    </button>
                )}
                {task.status === 'completed' && (
                    <span className="completed-pill"><CheckCircle2 size={12} /> Done</span>
                )}
            </div>
        </div>
    );
};

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

interface DashboardTabProps {
    tasks: Task[];
    user: UserProfile;
    onView: (id: number) => void;
    onUpdate: (id: number) => void;
    onGoTasks: () => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ tasks, user, onView, onUpdate, onGoTasks }) => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'completed').length;
    const inProg = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(t => effectiveStatus(t) === 'overdue').length;
    const pct = total ? Math.round(done / total * 100) : 0;
    const urgent = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');

    return (
        <div className="tab-content">
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div className="wb-left">
                    <div className="wb-avatar">{user.avatarInitials}</div>
                    <div>
                        <h2 className="wb-name">Good day, {user.fullName.split(' ')[0]} 👋</h2>
                        <p className="wb-sub">{user.role} · {user.department}</p>
                    </div>
                </div>
                <div className="wb-right">
                    <div className="wb-ring-wrap">
                        <svg viewBox="0 0 60 60" className="wb-ring">
                            <circle cx="30" cy="30" r="24" className="ring-bg" />
                            <circle
                                cx="30" cy="30" r="24"
                                className="ring-fill"
                                strokeDasharray={`${2 * Math.PI * 24}`}
                                strokeDashoffset={`${2 * Math.PI * 24 * (1 - pct / 100)}`}
                            />
                        </svg>
                        <div className="wb-ring-text">
                            <span className="wb-pct">{pct}%</span>
                            <span className="wb-pct-sub">done</span>
                        </div>
                    </div>
                    <div className="wb-stats">
                        <div className="wb-stat"><span className="wbs-val">{total}</span><span className="wbs-label">Total</span></div>
                        <div className="wb-stat"><span className="wbs-val green">{done}</span><span className="wbs-label">Done</span></div>
                        <div className="wb-stat"><span className="wbs-val amber">{inProg}</span><span className="wbs-label">Active</span></div>
                        <div className="wb-stat"><span className="wbs-val red">{overdue}</span><span className="wbs-label">Overdue</span></div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                {[
                    { label: 'My Tasks', val: total, icon: <ClipboardList size={18} />, cls: 'bg-primary', sub: 'Assigned to me' },
                    { label: 'In Progress', val: inProg, icon: <Loader2 size={18} />, cls: 'bg-warning', sub: 'Currently active' },
                    { label: 'Completed', val: done, icon: <CheckCircle2 size={18} />, cls: 'bg-success', sub: 'Finished tasks' },
                    { label: 'Overdue', val: overdue, icon: <AlertCircle size={18} />, cls: 'bg-danger', sub: 'Needs attention' },
                ].map(s => (
                    <div key={s.label} className="card stat-card">
                        <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                        <div>
                            <p>{s.label}</p>
                            <h3>{s.val}</h3>
                            <small>{s.sub}</small>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Urgent Tasks */}
                <div className="card">
                    <div className="card-header">
                        <h3>High Priority Tasks</h3>
                        <button className="link-btn" onClick={onGoTasks}>
                            All tasks <ChevronRight size={13} />
                        </button>
                    </div>
                    {urgent.length === 0
                        ? <div className="empty-state"><CheckCircle2 size={22} /><p>No urgent tasks — great work!</p></div>
                        : urgent.map(t => (
                            <div key={t.id} className="dash-task-row" onClick={() => onView(t.id)}>
                                <div className="dtr-left">
                                    <span className={`prio-dot ${priorityMeta[t.priority].cls}`} />
                                    <div>
                                        <div className="dtr-name">{t.name}</div>
                                        <div className="dtr-date">{fmtDate(t.deadline)}</div>
                                    </div>
                                </div>
                                <div className="dtr-right">
                                    <span className={`badge ${statusMeta[effectiveStatus(t)].cls}`}>
                                        {statusMeta[effectiveStatus(t)].label}
                                    </span>
                                    {t.status !== 'completed' && (
                                        <button
                                            className="btn btn-xs btn-primary"
                                            onClick={e => { e.stopPropagation(); onUpdate(t.id); }}
                                        >
                                            Update
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Progress Summary */}
                <div className="card">
                    <div className="card-header"><h3>My Progress</h3></div>
                    <div className="progress-summary">
                        {tasks.map(t => (
                            <div key={t.id} className="ps-item" onClick={() => onView(t.id)}>
                                <div className="ps-info">
                                    <span className="ps-name">{t.name}</span>
                                    <span className="ps-pct">{t.progress}%</span>
                                </div>
                                <div className="ps-bar">
                                    <div
                                        className={`ps-fill ${priorityMeta[t.priority].bar}`}
                                        style={{ width: `${t.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── My Tasks Tab (FR-016) ────────────────────────────────────────────────────

interface MyTasksTabProps {
    tasks: Task[];
    onView: (id: number) => void;
    onUpdate: (id: number) => void;
}

const MyTasksTab: React.FC<MyTasksTabProps> = ({ tasks, onView, onUpdate }) => {
    const [filter, setFilter] = useState<'all' | TaskStatus>('all');

    const filters: { key: 'all' | TaskStatus; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: tasks.length },
        { key: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
        { key: 'in-progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length },
        { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
        { key: 'overdue', label: 'Overdue', count: tasks.filter(t => effectiveStatus(t) === 'overdue').length },
    ];

    const filtered = filter === 'all'
        ? tasks
        : filter === 'overdue'
            ? tasks.filter(t => effectiveStatus(t) === 'overdue')
            : tasks.filter(t => t.status === filter);

    return (
        <div className="tab-content">
            {/* Filter Pills */}
            <div className="filter-pills">
                {filters.map(f => (
                    <button
                        key={f.key}
                        className={`filter-pill${filter === f.key ? ' active' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                        <span className="fp-count">{f.count}</span>
                    </button>
                ))}
            </div>

            {/* Task Grid */}
            {filtered.length === 0
                ? <div className="card"><div className="empty-state"><ClipboardList size={22} /><p>No tasks in this category</p></div></div>
                : <div className="task-grid">
                    {filtered.map(t => (
                        <TaskCard key={t.id} task={t} onView={onView} onUpdate={onUpdate} />
                    ))}
                </div>
            }
        </div>
    );
};

// ─── Profile Tab (FR-018) ─────────────────────────────────────────────────────

interface ProfileTabProps { user: UserProfile; onUpdateUser: (u: UserProfile) => void; }

const ProfileTab: React.FC<ProfileTabProps> = ({ user, onUpdateUser }) => {
    const [editMode, setEditMode] = useState(false);
    const [pwdMode, setPwdMode] = useState(false);
    const [form, setForm] = useState({ fullName: user.fullName, email: user.email, phone: user.phone, address: user.address });
    const [pwd, setPwd] = useState({ current: '', newPwd: '', confirm: '' });
    const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false });
    const [pwdError, setPwdError] = useState('');
    const [saved, setSaved] = useState(false);

    const setF = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }));

    const handleSaveInfo = () => {
        onUpdateUser({ ...user, ...form });
        setEditMode(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleChangePwd = () => {
        setPwdError('');
        if (!pwd.current) return setPwdError('Current password is required.');
        if (pwd.newPwd.length < 8) return setPwdError('New password must be at least 8 characters.');
        if (pwd.newPwd !== pwd.confirm) return setPwdError('Passwords do not match.');
        setPwdMode(false);
        setPwd({ current: '', newPwd: '', confirm: '' });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const toggleShow = (k: keyof typeof showPwd) =>
        setShowPwd(prev => ({ ...prev, [k]: !prev[k] }));

    const infoFields: { key: keyof typeof form; label: string; icon: React.ReactNode; type?: string }[] = [
        { key: 'fullName', label: 'Full Name', icon: <User size={15} /> },
        { key: 'email', label: 'Email Address', icon: <Mail size={15} />, type: 'email' },
        { key: 'phone', label: 'Phone Number', icon: <Phone size={15} />, type: 'tel' },
        { key: 'address', label: 'Address', icon: <MapPin size={15} /> },
    ];

    return (
        <div className="tab-content">
            {saved && (
                <div className="toast-success">
                    <CheckCircle2 size={16} /> Changes saved successfully
                </div>
            )}

            {/* Profile Hero */}
            <div className="profile-hero card">
                <div className="ph-avatar">{user.avatarInitials}</div>
                <div className="ph-info">
                    <h2 className="ph-name">{user.fullName}</h2>
                    <p className="ph-role">{user.role} · {user.department}</p>
                    <div className="ph-badges">
                        <span className="badge badge-blue">{user.employeeId}</span>
                        <span className="badge badge-green">Active</span>
                        <span className="badge badge-amber">Since {fmtDate(user.joinDate)}</span>
                    </div>
                </div>
                <button
                    className={`btn ${editMode ? 'btn-danger' : 'btn-primary'} ph-edit-btn`}
                    onClick={() => { setEditMode(e => !e); setPwdMode(false); }}
                >
                    {editMode ? <><X size={13} /> Cancel</> : <><Pencil size={13} /> Edit Profile</>}
                </button>
            </div>

            <div className="profile-grid">
                {/* Basic Information */}
                <div className="card">
                    <div className="card-header">
                        <h3>Basic Information</h3>
                        {editMode && (
                            <button className="btn btn-primary" onClick={handleSaveInfo}>
                                <Save size={13} /> Save
                            </button>
                        )}
                    </div>
                    <div className="info-fields">
                        {infoFields.map(f => (
                            <div key={f.key} className="info-field">
                                <label>{f.label}</label>
                                {editMode ? (
                                    <div className="if-input-wrap">
                                        <span className="if-icon">{f.icon}</span>
                                        <input
                                            type={f.type ?? 'text'}
                                            value={form[f.key]}
                                            onChange={setF(f.key)}
                                        />
                                    </div>
                                ) : (
                                    <div className="if-value">
                                        <span className="if-icon">{f.icon}</span>
                                        <span>{user[f.key as keyof UserProfile] as string}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Account & Password */}
                <div className="card">
                    <div className="card-header">
                        <h3>Account & Security</h3>
                    </div>
                    <div className="account-info">
                        <div className="info-field">
                            <label>Employee ID</label>
                            <div className="if-value">
                                <span className="if-icon"><User size={15} /></span>
                                <span className="read-only-val">{user.employeeId}</span>
                            </div>
                        </div>
                        <div className="info-field">
                            <label>Department</label>
                            <div className="if-value">
                                <span className="if-icon"><ClipboardList size={15} /></span>
                                <span className="read-only-val">{user.department}</span>
                            </div>
                        </div>
                        <div className="info-field">
                            <label>Join Date</label>
                            <div className="if-value">
                                <span className="if-icon"><Clock size={15} /></span>
                                <span className="read-only-val">{fmtDate(user.joinDate)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pwd-section">
                        <div className="pwd-header">
                            <div className="pwd-title">
                                <Lock size={15} />
                                <span>Change Password</span>
                            </div>
                            <button
                                className={`btn ${pwdMode ? '' : 'btn-primary'} btn-sm`}
                                onClick={() => { setPwdMode(m => !m); setPwdError(''); setEditMode(false); }}
                            >
                                {pwdMode ? 'Cancel' : 'Change'}
                            </button>
                        </div>

                        {pwdMode && (
                            <div className="pwd-form">
                                {(['current', 'newPwd', 'confirm'] as const).map(k => {
                                    const labels = { current: 'Current Password', newPwd: 'New Password', confirm: 'Confirm New Password' };
                                    return (
                                        <div key={k} className="field">
                                            <label>{labels[k]}</label>
                                            <div className="pwd-input-wrap">
                                                <input
                                                    type={showPwd[k] ? 'text' : 'password'}
                                                    value={pwd[k]}
                                                    onChange={e => setPwd(p => ({ ...p, [k]: e.target.value }))}
                                                    placeholder="••••••••"
                                                />
                                                <button className="pwd-toggle" onClick={() => toggleShow(k)}>
                                                    {showPwd[k] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {pwdError && <p className="pwd-error">{pwdError}</p>}
                                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleChangePwd}>
                                    <Lock size={13} /> Update Password
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Root Component ───────────────────────────────────────────────────────────

export default function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
    const [tasks, setTasks] = useState<Task[]>(MY_TASKS);
    const [user, setUser] = useState<UserProfile>(CURRENT_USER);
    const [viewingId, setViewingId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const viewingTask = viewingId != null ? tasks.find(t => t.id === viewingId) ?? null : null;
    const updatingTask = updatingId != null ? tasks.find(t => t.id === updatingId) ?? null : null;

    const handleSaveProgress = (id: number, status: TaskStatus, progress: number) => {
        setTasks(ts => ts.map(t => t.id === id
            ? { ...t, status, progress: status === 'completed' ? 100 : progress }
            : t
        ));
        setUpdatingId(null);
    };

    const navItems = [
        { tab: 'dashboard' as NavTab, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { tab: 'my-tasks' as NavTab, label: 'My Tasks', icon: <ClipboardList size={20} /> },
        { tab: 'profile' as NavTab, label: 'Profile', icon: <UserCircle2 size={20} /> },
    ];

    const pageTitles: Record<NavTab, string> = {
        dashboard: 'My Dashboard',
        'my-tasks': 'My Tasks',
        profile: 'My Profile',
    };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-box" />
                </div>
                <nav className="sidebar-nav">
                    {navItems.map(n => (
                        <div
                            key={n.tab}
                            className={`nav-item${activeTab === n.tab ? ' active' : ''}`}
                            onClick={() => setActiveTab(n.tab)}
                        >
                            {n.icon}
                            <span>{n.label}</span>
                        </div>
                    ))}
                </nav>
                {/* Sidebar footer */}
                <div className="sidebar-footer">
                    <div className="sf-avatar">{user.avatarInitials}</div>
                    <div className="sf-info">
                        <div className="sf-name">{user.fullName}</div>
                        <div className="sf-role">{user.role}</div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="main-viewport">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h2>{pageTitles[activeTab]}</h2>
                        <p>Dashboard — {today}</p>
                    </div>
                    <div className="header-user">
                        <div className="user-block">
                            <div className="avatar-circle">{user.avatarInitials}</div>
                            <div className="user-text">
                                <span className="welcome-text">Welcome back</span>
                                <strong>{user.fullName}</strong>
                            </div>
                        </div>
                        <button
                            className="logout-btn"
                            onClick={() => {
                                localStorage.removeItem('employeeId');
                                localStorage.removeItem('authToken');
                                window.location.href = '/';
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                {activeTab === 'dashboard' && (
                    <DashboardTab
                        tasks={tasks} user={user}
                        onView={setViewingId}
                        onUpdate={setUpdatingId}
                        onGoTasks={() => setActiveTab('my-tasks')}
                    />
                )}
                {activeTab === 'my-tasks' && (
                    <MyTasksTab tasks={tasks} onView={setViewingId} onUpdate={setUpdatingId} />
                )}
                {activeTab === 'profile' && (
                    <ProfileTab user={user} onUpdateUser={setUser} />
                )}
            </main>

            {/* Task Detail Modal */}
            {viewingTask && (
                <TaskDetail
                    task={viewingTask}
                    onUpdate={() => { setUpdatingId(viewingTask.id); setViewingId(null); }}
                    onClose={() => setViewingId(null)}
                />
            )}

            {/* Progress Update Modal */}
            {updatingTask && (
                <ProgressModal
                    task={updatingTask}
                    onSave={handleSaveProgress}
                    onClose={() => setUpdatingId(null)}
                />
            )}
        </div>
    );
} 
