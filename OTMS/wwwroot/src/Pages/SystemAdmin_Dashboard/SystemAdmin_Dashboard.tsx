import { useEffect, useState } from 'react';
import {
    Users,
    ClipboardList,
    CheckCircle2,
    AlertCircle,
    Package,
    LayoutDashboard,
    Truck,
    BarChart3,
    UserCircle2,
    X,
    Save,
    Loader2,
} from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './SystemAdmin_Dashboard.css';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmployeeRegisterDTO {
    employeeNumber: string;
    employeeName: string;
    contactNumber: string;
    role: string;
    password: string;
}

interface FieldError {
    employeeNumber?: string;
    employeeName?: string;
    contactNumber?: string;
    role?: string;
}

// FormState has no password fields — password is system-generated on submit
type FormState = Omit<EmployeeRegisterDTO, 'password'>;

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES = [
    'System Admin',
    'Operations Manager',
    'Field Operations',
    'Warehouse Staff',
    'Delivery Driver',
    'Dispatcher',
];

const DAILY_DELIVERIES = [
    { day: 'Mon', weekday: 30, peak: 10 },
    { day: 'Tue', weekday: 25, peak: 15 },
    { day: 'Wed', weekday: 40, peak: 20 },
    { day: 'Thu', weekday: 35, peak: 12 },
    { day: 'Fri', weekday: 50, peak: 25 },
    { day: 'Sat', weekday: 20, peak: 8 },
    { day: 'Sun', weekday: 15, peak: 5 },
];

const EMPTY_FORM: FormState = {
    employeeNumber: '',
    employeeName: '',
    contactNumber: '',
    role: '',
};

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Package, label: 'Manage', active: true },
    { icon: Truck, label: 'Delivery' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: UserCircle2, label: 'Profile' },
];

const STAT_CARDS = [
    { icon: Users, bg: 'bg-primary', label: 'TOTAL EMPLOYEES', sub: 'Current active staff' },
    { icon: ClipboardList, bg: 'bg-warning', label: 'ACTIVE TASKS', sub: 'Pending & In Transit' },
    { icon: CheckCircle2, bg: 'bg-success', label: 'TASKS COMPLETED', sub: 'Total successful deliveries' },
    { icon: AlertCircle, bg: 'bg-danger', label: 'LOCKED ACCOUNTS', sub: 'Needs admin action' },
];

const SYSTEM_STATUS_ITEMS = [
    { icon: Users, bg: 'bg-primary', name: 'Operation System', detail: '— employees active', uptime: '99.9%' },
    { icon: ClipboardList, bg: 'bg-danger', name: 'Delivery Management', detail: '— total orders', uptime: '99.7%' },
    { icon: Package, bg: 'bg-success', name: 'Delivery Tracker', detail: '— active shipments', uptime: '98.2%' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generatePassword(): string {
    const chars = 'SpeedexEmployee2026';
    return Array.from({ length: 10 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
}

function validate(form: FormState): FieldError {
    const errs: FieldError = {};

    if (!form.employeeNumber.trim()) errs.employeeNumber = 'Employee number is required.';
    if (!form.employeeName.trim()) errs.employeeName = 'Full name is required.';

    if (!form.contactNumber.trim()) {
        errs.contactNumber = 'Contact number is required.';
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.contactNumber.trim())) {
        errs.contactNumber = 'Enter a valid contact number.';
    }

    if (!form.role) errs.role = 'Please select a role.';

    return errs;
}

// ─── Add Employee Modal ───────────────────────────────────────────────────────

interface AddEmployeeModalProps {
    onClose: () => void;
    onSuccess: (employee: EmployeeRegisterDTO) => void;
}

function AddEmployeeModal({ onClose, onSuccess }: AddEmployeeModalProps) {
    const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
    const [errors, setErrors] = useState<FieldError>({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange =
        (key: keyof FormState) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                setForm(prev => ({ ...prev, [key]: e.target.value }));
                setErrors(prev => ({ ...prev, [key]: undefined }));
                setApiError('');
            };

    const handleSubmit = async () => {
        if (submitting) return;

        const errs = validate(form);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setSubmitting(true);
        setApiError('');

        try {
            const payload: EmployeeRegisterDTO = {
                employeeNumber: form.employeeNumber.trim(),
                employeeName: form.employeeName.trim(),
                contactNumber: form.contactNumber.trim(),
                role: form.role,
                password: generatePassword(),
            };

            const token = localStorage.getItem('authToken');

            const res = await fetch('/api/authorization/superadmin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${res.status}: Action Failed`);
            }

            const data = await res.json();

            alert(
                `Employee account created successfully!\n\n` +
                `Employee Number: ${data.employeeNumber || payload.employeeNumber}\n` +
                `Generated Password: ${data.password || payload.password}\n\n` +
                `Save this password. It will not be shown again.`
            );

            onSuccess(data);
            onClose();

        } catch (err: any) {
            setApiError(err.message ?? 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3>Add New Employee</h3>
                        <p className="modal-subtitle">Fill in the details to register a new employee account.</p>
                    </div>
                    <button className="icon-btn" onClick={onClose} aria-label="Close">
                        <X size={16} />
                    </button>
                </div>

                {apiError && (
                    <div className="form-api-error">
                        <AlertCircle size={14} />
                        <span>{apiError}</span>
                    </div>
                )}

                <div className="modal-form">
                    <div className="field">
                        <label htmlFor="emp-number">Employee Number</label>
                        <input
                            id="emp-number"
                            type="text"
                            placeholder="e.g. EMP-0001"
                            value={form.employeeNumber}
                            onChange={handleChange('employeeNumber')}
                            className={errors.employeeNumber ? 'input-error' : ''}
                        />
                        {errors.employeeNumber && <span className="field-error"><AlertCircle size={12} />{errors.employeeNumber}</span>}
                    </div>

                    <div className="field">
                        <label htmlFor="emp-name">Full Name</label>
                        <input
                            id="emp-name"
                            type="text"
                            placeholder="e.g. Juan dela Cruz"
                            value={form.employeeName}
                            onChange={handleChange('employeeName')}
                            className={errors.employeeName ? 'input-error' : ''}
                        />
                        {errors.employeeName && <span className="field-error"><AlertCircle size={12} />{errors.employeeName}</span>}
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="emp-contact">Contact Number</label>
                            <input
                                id="emp-contact"
                                type="tel"
                                placeholder="e.g. +63 917 000 0000"
                                value={form.contactNumber}
                                onChange={handleChange('contactNumber')}
                                className={errors.contactNumber ? 'input-error' : ''}
                            />
                            {errors.contactNumber && <span className="field-error"><AlertCircle size={12} />{errors.contactNumber}</span>}
                        </div>

                        <div className="field">
                            <label htmlFor="emp-role">Role</label>
                            <select
                                id="emp-role"
                                value={form.role}
                                onChange={handleChange('role')}
                                className={errors.role ? 'input-error' : ''}
                            >
                                <option value="">Select a role</option>
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.role && <span className="field-error"><AlertCircle size={12} />{errors.role}</span>}
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn" onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                        {submitting
                            ? <><Loader2 size={13} className="spin" /> Registering…</>
                            : <><Save size={13} /> Register Employee</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const navigate = useNavigate();
    const employeeId = localStorage.getItem('employeeId') ?? '';
    const [showAddModal, setShowAddModal] = useState(false);

    const handleLogout = () => {
        ['employeeId', 'refreshToken', 'authToken'].forEach(k => localStorage.removeItem(k));
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-box" />
                </div>
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
                        <div key={label} className={`nav-item${active ? ' active' : ''}`}>
                            <Icon size={22} />
                            <span>{label}</span>
                        </div>
                    ))}
                </nav>
            </aside>

            <main className="main-viewport">
                <div className="dashboard-header">
                    <div>
                        <h2>Manage</h2>
                        <p>
                            Speedex Courier Inc. —{' '}
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </p>
                    </div>

                    <div className="header-user">
                        <div className="user-block">
                            <div className="avatar-circle">
                                {employeeId ? employeeId.charAt(0).toUpperCase() : 'E'}
                            </div>
                            <div className="user-text">
                                <span className="welcome-text">Welcome back</span>
                                <strong>{employeeId || 'Employee'}</strong>
                            </div>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                <div className="dashboard-content">
                    <div className="stats-row">
                        {STAT_CARDS.map(({ icon: Icon, bg, label, sub }) => (
                            <div key={label} className="stat-card">
                                <div className={`stat-icon ${bg}`}><Icon size={18} /></div>
                                <div>
                                    <p>{label}</p>
                                    <h3 className="skeleton" />
                                    <small>{sub}</small>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="dashboard-grid">
                        <div className="card">
                            <div className="card-header">
                                <h3>Recent Employees</h3>
                                <a href="/employees" className="view-all-link">View all →</a>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>NAME</th><th>ID</th><th>ROLE</th><th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="empty-state">
                                                <Package size={20} />
                                                <p>No data available</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3>Recent Activity</h3>
                                <a href="/activity-logs" className="view-all-link">View All</a>
                            </div>
                            <div className="activity-feed-list">
                                <div className="empty-state">
                                    <ClipboardList size={20} />
                                    <p>No recent activity</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-bottom-row">
                        <div className="card">
                            <h3>Quick Actions</h3>
                            <div className="quick-actions-grid">
                                <button className="quick-action-btn primary" onClick={() => setShowAddModal(true)}>
                                    <div className="quick-action-icon"><Users size={20} /></div>
                                    <span>Add Employee</span>
                                </button>
                                <button className="quick-action-btn">
                                    <div className="quick-action-icon warning"><ClipboardList size={20} /></div>
                                    <span>Create Task</span>
                                </button>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3>System Status</h3>
                                <span className="system-all-operational">All Operational</span>
                            </div>
                            <div className="system-status-list">
                                {SYSTEM_STATUS_ITEMS.map(({ icon: Icon, bg, name, detail, uptime }) => (
                                    <div key={name} className="system-status-item">
                                        <div className={`system-icon ${bg}`}><Icon size={16} /></div>
                                        <div className="system-info">
                                            <span className="system-name">{name}</span>
                                            <span className="system-detail">{detail}</span>
                                        </div>
                                        <span className="system-uptime">{uptime}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3>Delivery Performance</h3>
                                <span className="system-all-operational alt">This Week</span>
                            </div>
                            <div style={{ width: '100%', height: '220px', marginTop: '16px' }}>
                                <ResponsiveContainer>
                                    <BarChart data={DAILY_DELIVERIES}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Bar dataKey="weekday" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="peak" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {showAddModal && (
                <AddEmployeeModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={employee => console.log('Employee registered:', employee)}
                />
            )}
        </div>
    );
}