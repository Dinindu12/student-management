const fs = require('fs');
const path = require('path');

// ===== Supabase Config =====
const SUPABASE_URL = 'https://bwvpfellniegcnslgzav.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dnBmZWxsbmllZ2Nuc2xnemF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxOTQxMjMsImV4cCI6MjEwMjc3MDEyM30.EwkJu2l6GGey4DITjykQ-wfwAruzSG6XkOpvHwPkqcc';

// ===== HTML Content (Full, with corrected Supabase client) =====
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>EduPulse | Student Management System</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%236366f1'/><path d='M50 22L18 47L50 72L82 47L50 22Z' fill='white' opacity='0.9'/><path d='M18 47L18 65L50 88L82 65L82 47' fill='none' stroke='white' stroke-width='5' opacity='0.7'/></svg>" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
    <!-- Supabase JS Client -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        /* ===== CSS (Compressed – same as before) ===== */
        :root {
            --bg-base: #0a0d18; --bg-surface: #111728; --bg-card: rgba(18,24,43,0.75);
            --bg-card-hover: rgba(28,36,62,0.85); --bg-input: rgba(15,23,42,0.7);
            --border-subtle: rgba(255,255,255,0.08); --border-focus: #6366f1;
            --primary: #6366f1; --primary-gradient: linear-gradient(135deg,#6366f1,#8b5cf6,#d946ef);
            --primary-hover: #4f46e5; --secondary: #06b6d4; --success: #10b981;
            --warning: #f59e0b; --danger: #ef4444;
            --text-main: #f8fafc; --text-muted: #94a3b8; --text-subtle: #64748b;
            --radius-sm: 8px; --radius-md: 14px; --radius-lg: 20px; --radius-xl: 26px;
            --shadow-card: 0 10px 30px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
            --shadow-glow: 0 0 25px rgba(99,102,241,0.35);
            --transition-smooth: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        body { font-family:'Inter',sans-serif; background-color:var(--bg-base); background-image:radial-gradient(circle at 15% 15%,rgba(99,102,241,0.12) 0%,transparent 40%),radial-gradient(circle at 85% 85%,rgba(217,70,239,0.08) 0%,transparent 45%),radial-gradient(circle at 50% 50%,rgba(6,182,212,0.05) 0%,transparent 60%); background-attachment:fixed; color:var(--text-main); min-height:100vh; line-height:1.5; overflow-x:hidden; }
        h1,h2,h3,h4,h5,h6,.brand-title { font-family:'Plus Jakarta Sans',sans-serif; letter-spacing:-0.02em; }
        ::-webkit-scrollbar { width:7px; height:7px; } ::-webkit-scrollbar-track { background:rgba(10,13,24,0.8); } ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:4px; } ::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.25); }
        .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px 18px; font-size:.875rem; font-weight:600; border-radius:var(--radius-md); border:1px solid transparent; cursor:pointer; transition:var(--transition-smooth); font-family:'Inter',sans-serif; white-space:nowrap; text-decoration:none; }
        .btn-primary { background:var(--primary-gradient); color:#fff; box-shadow:0 4px 15px rgba(99,102,241,0.35); } .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(99,102,241,0.5); }
        .btn-secondary { background:rgba(255,255,255,0.05); color:var(--text-main); border-color:var(--border-subtle); } .btn-secondary:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2); transform:translateY(-1px); }
        .btn-danger { background:rgba(239,68,68,0.15); color:#fca5a5; border-color:rgba(239,68,68,0.3); } .btn-danger:hover { background:rgba(239,68,68,0.3); color:#fff; }
        .btn-sm { padding:6px 12px; font-size:.75rem; border-radius:var(--radius-sm); }
        .btn-icon { padding:8px 10px; border-radius:var(--radius-sm); background:rgba(255,255,255,0.04); border:1px solid var(--border-subtle); color:var(--text-muted); cursor:pointer; transition:var(--transition-smooth); } .btn-icon:hover { color:#fff; background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2); }
        .form-group { margin-bottom:18px; text-align:left; }
        .form-group label { display:flex; align-items:center; gap:6px; color:var(--text-muted); font-size:.8rem; font-weight:600; margin-bottom:6px; text-transform:uppercase; letter-spacing:.5px; }
        .form-group label i { color:var(--primary); }
        .form-control,.form-select { width:100%; padding:12px 16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); background:var(--bg-input); color:var(--text-main); font-size:.925rem; font-family:'Inter',sans-serif; outline:none; transition:var(--transition-smooth); backdrop-filter:blur(10px); }
        .form-control:focus,.form-select:focus { border-color:var(--border-focus); box-shadow:0 0 0 3px rgba(99,102,241,0.2); background:rgba(15,23,42,0.9); }
        .form-select option { background-color:var(--bg-surface); color:var(--text-main); }
        .auth-wrapper { display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; }
        .auth-card { width:100%; max-width:440px; background:var(--bg-card); backdrop-filter:blur(25px); -webkit-backdrop-filter:blur(25px); border:1px solid var(--border-subtle); border-radius:var(--radius-xl); padding:40px 32px; box-shadow:var(--shadow-card),0 25px 50px -12px rgba(0,0,0,0.7); position:relative; overflow:hidden; animation:zoomIn .35s ease; }
        .auth-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:var(--primary-gradient); }
        .auth-header { text-align:center; margin-bottom:28px; }
        .auth-logo-badge { width:64px; height:64px; border-radius:20px; background:var(--primary-gradient); display:inline-flex; align-items:center; justify-content:center; font-size:1.8rem; color:#fff; margin-bottom:16px; box-shadow:var(--shadow-glow); }
        .auth-header h2 { font-size:1.6rem; font-weight:700; color:#fff; } .auth-header p { color:var(--text-muted); font-size:.875rem; margin-top:4px; }
        .auth-footer { margin-top:24px; text-align:center; font-size:.875rem; color:var(--text-muted); } .auth-footer a { color:#818cf8; font-weight:600; text-decoration:none; cursor:pointer; transition:var(--transition-smooth); } .auth-footer a:hover { color:#c084fc; text-decoration:underline; }
        .role-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:30px; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.6px; }
        .role-badge.admin { background:linear-gradient(135deg,rgba(236,72,153,0.2),rgba(168,85,247,0.25)); color:#f472b6; border:1px solid rgba(236,72,153,0.35); box-shadow:0 0 10px rgba(236,72,153,0.2); }
        .role-badge.teacher { background:rgba(16,185,129,0.2); color:#34d399; border:1px solid rgba(16,185,129,0.35); }
        .role-badge.student { background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.35); }
        .role-badge.parent { background:rgba(6,182,212,0.2); color:#38bdf8; border:1px solid rgba(6,182,212,0.35); }
        .status-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:.725rem; font-weight:600; }
        .status-badge.active,.status-badge.paid,.status-badge.present { background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.25); }
        .status-badge.inactive,.status-badge.pending,.status-badge.late { background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.25); }
        .status-badge.overdue,.status-badge.absent,.status-badge.danger { background:rgba(239,68,68,0.15); color:#f87171; border:1px solid rgba(239,68,68,0.25); }
        .status-badge.excused,.status-badge.info { background:rgba(59,130,246,0.15); color:#60a5fa; border:1px solid rgba(59,130,246,0.25); }
        .navbar { position:fixed; top:0; left:0; width:100%; height:70px; background:rgba(10,13,24,0.85); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid var(--border-subtle); z-index:1000; display:flex; align-items:center; }
        .nav-container { width:100%; max-width:1360px; margin:0 auto; padding:0 20px; display:flex; align-items:center; justify-content:space-between; }
        .logo { display:flex; align-items:center; gap:12px; font-size:1.25rem; font-weight:800; text-decoration:none; color:#fff; }
        .logo-icon { width:38px; height:38px; border-radius:12px; background:var(--primary-gradient); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.1rem; box-shadow:0 4px 12px rgba(99,102,241,0.4); }
        .logo span { background:var(--primary-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .nav-links { display:flex; align-items:center; list-style:none; gap:4px; background:rgba(255,255,255,0.03); padding:4px 6px; border-radius:var(--radius-lg); border:1px solid var(--border-subtle); }
        .nav-links a { display:flex; align-items:center; gap:8px; color:var(--text-muted); text-decoration:none; padding:8px 14px; border-radius:var(--radius-md); font-size:.825rem; font-weight:600; transition:var(--transition-smooth); }
        .nav-links a:hover { color:#fff; background:rgba(255,255,255,0.06); } .nav-links a.active { color:#fff; background:var(--primary-gradient); box-shadow:0 4px 12px rgba(99,102,241,0.3); }
        .nav-right { display:flex; align-items:center; gap:12px; }
        .user-profile-widget { display:flex; align-items:center; gap:10px; padding:4px 12px 4px 6px; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:30px; }
        .avatar-circle { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#4f46e5,#06b6d4); color:#fff; display:flex; align-items:center; justify-content:center; font-size:.8rem; font-weight:700; text-transform:uppercase; }
        .user-meta { display:flex; flex-direction:column; line-height:1.2; } .user-meta .name { font-size:.825rem; font-weight:600; color:#fff; max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .mobile-menu-btn { display:none; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); color:#fff; width:40px; height:40px; border-radius:var(--radius-md); align-items:center; justify-content:center; font-size:1.1rem; cursor:pointer; transition:var(--transition-smooth); } .mobile-menu-btn:hover { background:rgba(255,255,255,0.1); }
        .drawer-overlay { display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); z-index:1100; opacity:0; transition:opacity .3s ease; } .drawer-overlay.open { display:block; opacity:1; }
        .mobile-drawer { position:fixed; top:0; left:-300px; width:280px; height:100%; background:var(--bg-surface); border-right:1px solid var(--border-subtle); z-index:1200; display:flex; flex-direction:column; transition:left .35s cubic-bezier(.4,0,.2,1); padding:24px 18px; box-shadow:10px 0 30px rgba(0,0,0,0.7); } .mobile-drawer.open { left:0; }
        .drawer-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid var(--border-subtle); } .drawer-close { background:none; border:none; color:var(--text-muted); font-size:1.3rem; cursor:pointer; }
        .drawer-links { list-style:none; display:flex; flex-direction:column; gap:6px; flex:1; overflow-y:auto; } .drawer-links a { display:flex; align-items:center; gap:12px; padding:12px 16px; color:var(--text-muted); text-decoration:none; border-radius:var(--radius-md); font-size:.9rem; font-weight:600; transition:var(--transition-smooth); } .drawer-links a:hover,.drawer-links a.active { color:#fff; background:var(--primary-gradient); }
        .main-wrapper { margin-top:70px; padding:28px 20px 60px; max-width:1360px; margin-left:auto; margin-right:auto; }
        .page-content { display:none; animation:fadeIn .35s ease; } .page-content.active { display:block; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes zoomIn { from { opacity:0; transform:scale(.94); } to { opacity:1; transform:scale(1); } }
        .page-header-box { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:28px; padding:20px 24px; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); backdrop-filter:blur(15px); }
        .page-header-info h2 { font-size:1.45rem; font-weight:700; color:#fff; display:flex; align-items:center; gap:10px; } .page-header-info h2 i { color:var(--primary); } .page-header-info p { color:var(--text-muted); font-size:.85rem; margin-top:2px; }
        .header-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:28px; }
        .stat-card { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:22px; position:relative; overflow:hidden; transition:var(--transition-smooth); backdrop-filter:blur(15px); } .stat-card:hover { transform:translateY(-4px); border-color:rgba(99,102,241,0.3); box-shadow:0 12px 30px -10px rgba(99,102,241,0.25); }
        .stat-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .stat-icon { width:46px; height:46px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:1.25rem; }
        .stat-icon.indigo { background:rgba(99,102,241,0.15); color:#818cf8; } .stat-icon.cyan { background:rgba(6,182,212,0.15); color:#38bdf8; } .stat-icon.emerald { background:rgba(16,185,129,0.15); color:#34d399; } .stat-icon.amber { background:rgba(245,158,11,0.15); color:#fbbf24; } .stat-icon.purple { background:rgba(168,85,247,0.15); color:#c084fc; }
        .stat-card h3 { font-size:1.9rem; font-weight:800; color:#fff; margin-bottom:4px; } .stat-card p { color:var(--text-muted); font-size:.85rem; font-weight:500; }
        .charts-row { display:grid; grid-template-columns:2fr 1.2fr; gap:20px; margin-bottom:28px; }
        .card-panel { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:24px; backdrop-filter:blur(15px); box-shadow:var(--shadow-card); }
        .card-panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; } .card-panel-header h3 { font-size:1.1rem; font-weight:700; color:#fff; display:flex; align-items:center; gap:8px; }
        .chart-container { position:relative; width:100%; height:280px; }
        .quick-actions-bar { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
        .quick-action-btn { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; align-items:center; gap:14px; cursor:pointer; transition:var(--transition-smooth); text-align:left; } .quick-action-btn:hover { border-color:var(--primary); transform:translateY(-2px); background:var(--bg-card-hover); } .quick-action-btn i { font-size:1.4rem; color:var(--primary); } .quick-action-btn .text strong { display:block; color:#fff; font-size:.9rem; } .quick-action-btn .text span { color:var(--text-muted); font-size:.75rem; }
        .table-filter-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:16px; }
        .search-box { position:relative; flex:1; min-width:240px; max-width:400px; } .search-box i { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-subtle); font-size:.9rem; } .search-box input { width:100%; padding:10px 14px 10px 38px; border-radius:30px; border:1px solid var(--border-subtle); background:var(--bg-card); color:#fff; font-size:.875rem; outline:none; transition:var(--transition-smooth); } .search-box input:focus { border-color:var(--primary); box-shadow:0 0 15px rgba(99,102,241,0.2); }
        .table-card { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); overflow:hidden; backdrop-filter:blur(15px); box-shadow:var(--shadow-card); }
        .table-responsive { width:100%; overflow-x:auto; }
        .modern-table { width:100%; border-collapse:collapse; text-align:left; font-size:.875rem; }
        .modern-table th { padding:14px 18px; background:rgba(255,255,255,0.02); color:var(--text-muted); font-weight:600; font-size:.75rem; text-transform:uppercase; letter-spacing:.6px; border-bottom:1px solid var(--border-subtle); white-space:nowrap; }
        .modern-table td { padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.04); color:var(--text-main); vertical-align:middle; } .modern-table tbody tr { transition:var(--transition-smooth); } .modern-table tbody tr:hover { background:rgba(255,255,255,0.03); }
        .table-actions { display:flex; align-items:center; gap:6px; }
        .reports-cards-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
        .report-selection-card { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:22px; text-align:center; cursor:pointer; transition:var(--transition-smooth); } .report-selection-card:hover,.report-selection-card.active { border-color:var(--primary); background:var(--bg-card-hover); transform:translateY(-4px); box-shadow:var(--shadow-glow); } .report-selection-card i { font-size:2.2rem; color:var(--primary); margin-bottom:12px; } .report-selection-card h4 { font-size:1rem; font-weight:700; margin-bottom:4px; } .report-selection-card p { color:var(--text-muted); font-size:.75rem; }
        .modal-backdrop { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(5,7,15,0.8); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); z-index:2000; align-items:center; justify-content:center; padding:20px; opacity:0; transition:opacity .25s ease; } .modal-backdrop.show { display:flex; opacity:1; }
        .modal-dialog { background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-xl); max-width:550px; width:100%; max-height:90vh; overflow-y:auto; padding:30px; box-shadow:0 25px 60px rgba(0,0,0,0.8),0 0 0 1px rgba(255,255,255,0.05); position:relative; transform:scale(.92); transition:transform .25s cubic-bezier(.4,0,.2,1); } .modal-backdrop.show .modal-dialog { transform:scale(1); } .modal-dialog.modal-lg { max-width:800px; }
        .modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid var(--border-subtle); } .modal-header h3 { font-size:1.25rem; font-weight:700; color:#fff; display:flex; align-items:center; gap:10px; } .modal-close { background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); color:var(--text-muted); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:var(--transition-smooth); } .modal-close:hover { background:rgba(239,68,68,0.2); color:#ef4444; border-color:rgba(239,68,68,0.3); }
        .batch-attendance-list { max-height:320px; overflow-y:auto; border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:10px; background:rgba(0,0,0,0.2); margin-bottom:18px; }
        .batch-item { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,0.04); } .batch-item:last-child { border-bottom:none; }
        .attendance-radio-group { display:flex; gap:8px; }
        .att-label { cursor:pointer; padding:4px 10px; border-radius:20px; font-size:.75rem; font-weight:600; border:1px solid var(--border-subtle); background:rgba(255,255,255,0.03); color:var(--text-muted); transition:var(--transition-smooth); }
        .att-radio:checked+.att-label.present { background:rgba(16,185,129,0.3); color:#34d399; border-color:#10b981; } .att-radio:checked+.att-label.absent { background:rgba(239,68,68,0.3); color:#f87171; border-color:#ef4444; } .att-radio:checked+.att-label.late { background:rgba(245,158,11,0.3); color:#fbbf24; border-color:#f59e0b; }
        .toast-container { position:fixed; bottom:24px; right:24px; display:flex; flex-direction:column; gap:10px; z-index:9999; pointer-events:none; }
        .toast { pointer-events:auto; background:rgba(18,24,43,0.95); backdrop-filter:blur(15px); -webkit-backdrop-filter:blur(15px); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px 20px; color:#fff; font-size:.875rem; display:flex; align-items:center; gap:12px; box-shadow:0 15px 35px rgba(0,0,0,0.6); animation:toastSlide .3s cubic-bezier(.4,0,.2,1); max-width:380px; }
        .toast.success { border-color:rgba(16,185,129,0.5); } .toast.success i { color:#10b981; font-size:1.1rem; } .toast.error { border-color:rgba(239,68,68,0.5); } .toast.error i { color:#ef4444; font-size:1.1rem; } .toast.info { border-color:rgba(99,102,241,0.5); } .toast.info i { color:#6366f1; font-size:1.1rem; }
        @keyframes toastSlide { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @media (max-width:1080px) { .stats-grid { grid-template-columns:repeat(2,1fr); } .charts-row { grid-template-columns:1fr; } .reports-cards-grid { grid-template-columns:repeat(2,1fr); } .quick-actions-bar { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:768px) { .nav-links { display:none; } .mobile-menu-btn { display:flex; } .user-meta { display:none; } .stats-grid { grid-template-columns:1fr 1fr; gap:12px; } .stat-card { padding:16px; } .stat-card h3 { font-size:1.4rem; } .main-wrapper { padding:16px 12px 40px; margin-top:65px; } .page-header-box { padding:16px; flex-direction:column; align-items:flex-start; } .header-actions { width:100%; justify-content:flex-start; } .reports-cards-grid { grid-template-columns:1fr 1fr; } .quick-actions-bar { grid-template-columns:1fr; } .toast-container { right:12px; left:12px; bottom:12px; } .toast { max-width:100%; } }
        @media (max-width:480px) { .stats-grid { grid-template-columns:1fr; } .reports-cards-grid { grid-template-columns:1fr; } .auth-card { padding:28px 20px; } }
    </style>
</head>
<body>
    <div id="toastContainer" class="toast-container"></div>

    <!-- ===== LOGIN ===== -->
    <div id="loginView" class="auth-wrapper">
        <div class="auth-card">
            <div class="auth-header"><div class="auth-logo-badge"><i class="fas fa-graduation-cap"></i></div><h2>EduPulse Portal</h2><p>Sign in to access your dashboard</p></div>
            <form id="loginForm" onsubmit="handleLogin(event)">
                <div class="form-group"><label><i class="fas fa-envelope"></i> Email</label><input type="email" id="loginEmail" class="form-control" placeholder="name@school.edu" required /></div>
                <div class="form-group"><div style="display:flex;justify-content:space-between;align-items:center;"><label><i class="fas fa-lock"></i> Password</label><a href="#" onclick="openForgotPasswordModal()" style="font-size:.75rem;color:#818cf8;text-decoration:none;margin-bottom:6px;">Forgot password?</a></div><input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required /></div>
                <button type="submit" class="btn btn-primary" style="width:100%;margin-top:10px;"><i class="fas fa-arrow-right-to-bracket"></i> Sign In</button>
            </form>
            <div class="auth-footer">Don't have an account? <a onclick="showAuthView('register')">Create Account</a></div>
        </div>
    </div>

    <!-- ===== REGISTER ===== -->
    <div id="registerView" class="auth-wrapper" style="display:none;">
        <div class="auth-card">
            <div class="auth-header"><div class="auth-logo-badge" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);"><i class="fas fa-user-plus"></i></div><h2>Create Account</h2><p>Join the student management portal</p></div>
            <form id="registerForm" onsubmit="handleRegister(event)">
                <div class="form-group"><label><i class="fas fa-user"></i> Full Name</label><input type="text" id="regName" class="form-control" placeholder="Alex Morgan" required /></div>
                <div class="form-group"><label><i class="fas fa-envelope"></i> Email</label><input type="email" id="regEmail" class="form-control" placeholder="alex@school.edu" required /></div>
                <div class="form-group"><label><i class="fas fa-lock"></i> Password (min 6 chars)</label><input type="password" id="regPassword" class="form-control" placeholder="••••••••" required minlength="6" /></div>
                <div class="form-group"><label><i class="fas fa-user-shield"></i> Account Role</label><select id="regRole" class="form-select" required><option value="student">Student</option><option value="teacher">Teacher</option><option value="parent">Parent</option><option value="admin">Administrator</option></select></div>
                <button type="submit" class="btn btn-primary" style="width:100%;margin-top:10px;"><i class="fas fa-sparkles"></i> Complete Registration</button>
            </form>
            <div class="auth-footer">Already registered? <a onclick="showAuthView('login')">Back to Sign In</a></div>
        </div>
    </div>

    <!-- ===== MAIN APP ===== -->
    <div id="appContainer" style="display:none;">
        <nav class="navbar">
            <div class="nav-container">
                <a href="#" class="logo" onclick="switchPage('dashboard')">
                    <div class="logo-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div>Edu<span>Pulse</span></div>
                </a>
                <ul class="nav-links" id="desktopNavLinks"></ul>
                <div class="nav-right">
                    <div class="user-profile-widget">
                        <div class="avatar-circle" id="userAvatar">U</div>
                        <div class="user-meta"><span class="name" id="navUserName">User Name</span><span id="navUserRoleBadge" class="role-badge student">Student</span></div>
                    </div>
                    <button class="btn-icon" onclick="handleLogout()" title="Sign Out"><i class="fas fa-arrow-right-from-bracket"></i></button>
                    <button class="mobile-menu-btn" onclick="toggleMobileDrawer(true)"><i class="fas fa-bars"></i></button>
                </div>
            </div>
        </nav>
        <div id="drawerOverlay" class="drawer-overlay" onclick="toggleMobileDrawer(false)"></div>
        <div id="mobileDrawer" class="mobile-drawer">
            <div class="drawer-header"><div class="logo"><div class="logo-icon"><i class="fas fa-graduation-cap"></i></div><div>Edu<span>Pulse</span></div></div><button class="drawer-close" onclick="toggleMobileDrawer(false)"><i class="fas fa-xmark"></i></button></div>
            <div style="padding:10px 0 16px;border-bottom:1px solid var(--border-subtle);margin-bottom:12px;"><div style="display:flex;align-items:center;gap:10px;"><div class="avatar-circle" id="drawerAvatar">U</div><div><div id="drawerUserName" style="font-weight:700;font-size:.9rem;">User</div><span id="drawerUserRoleBadge" class="role-badge student" style="margin-top:4px;">Student</span></div></div></div>
            <ul class="drawer-links" id="mobileNavLinks"></ul>
            <div style="margin-top:auto;padding-top:16px;border-top:1px solid var(--border-subtle);"><button class="btn btn-danger" style="width:100%;" onclick="handleLogout()"><i class="fas fa-arrow-right-from-bracket"></i> Sign Out</button></div>
        </div>

        <main class="main-wrapper">
            <!-- ===== DASHBOARD ===== -->
            <div id="page-dashboard" class="page-content active">
                <div class="page-header-box">
                    <div class="page-header-info"><h2><i class="fas fa-gauge-high"></i> Overview Dashboard</h2><p>Welcome back, <span id="welcomeUserName" style="color:#fff;font-weight:600;">User</span>!</p></div>
                    <div class="header-actions"><button class="btn btn-secondary btn-sm" onclick="refreshDashboard()"><i class="fas fa-arrows-rotate"></i> Refresh</button><button id="adminQuickSeedBtn" class="btn btn-primary btn-sm" style="display:none;" onclick="seedDemoData()"><i class="fas fa-wand-magic-sparkles"></i> Seed Sample Data</button></div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-card-top"><div class="stat-icon indigo"><i class="fas fa-users"></i></div><span class="status-badge active">Total</span></div><h3 id="statTotalStudents">0</h3><p>Enrolled Students</p></div>
                    <div class="stat-card"><div class="stat-card-top"><div class="stat-icon cyan"><i class="fas fa-book-open"></i></div><span class="status-badge info">Active</span></div><h3 id="statTotalCourses">0</h3><p>Courses Available</p></div>
                    <div class="stat-card"><div class="stat-card-top"><div class="stat-icon emerald"><i class="fas fa-calendar-check"></i></div><span class="status-badge active">Today</span></div><h3 id="statPresentToday">0</h3><p>Students Present</p></div>
                    <div class="stat-card"><div class="stat-card-top"><div class="stat-icon amber"><i class="fas fa-dollar-sign"></i></div><span class="status-badge pending">Revenue</span></div><h3 id="statTotalFees">$0</h3><p>Collected Fees</p></div>
                </div>
                <div id="quickActionsContainer" class="quick-actions-bar">
                    <div class="quick-action-btn" onclick="openStudentModal()"><i class="fas fa-user-plus"></i><div class="text"><strong>Add Student</strong><span>Enroll new learner</span></div></div>
                    <div class="quick-action-btn" onclick="openBatchAttendanceModal()"><i class="fas fa-clipboard-check"></i><div class="text"><strong>Mark Attendance</strong><span>Batch roll-call</span></div></div>
                    <div class="quick-action-btn" onclick="openGradeModal()"><i class="fas fa-award"></i><div class="text"><strong>Record Grade</strong><span>Add exam scores</span></div></div>
                    <div class="quick-action-btn" onclick="openFeeModal()"><i class="fas fa-file-invoice-dollar"></i><div class="text"><strong>Create Fee Invoice</strong><span>Assign tuition fees</span></div></div>
                </div>
                <div class="charts-row">
                    <div class="card-panel"><div class="card-panel-header"><h3><i class="fas fa-chart-area" style="color:var(--primary);"></i> Trends</h3></div><div class="chart-container"><canvas id="dashboardTrendChart"></canvas></div></div>
                    <div class="card-panel"><div class="card-panel-header"><h3><i class="fas fa-chart-pie" style="color:var(--secondary);"></i> Fee Status</h3></div><div class="chart-container"><canvas id="dashboardFeeChart"></canvas></div></div>
                </div>
            </div>

            <!-- ===== USERS ===== -->
            <div id="page-users" class="page-content">
                <div class="page-header-box"><div class="page-header-info"><h2><i class="fas fa-user-shield"></i> User & Role Management</h2><p>Control system access.</p></div><div class="header-actions"><button class="btn btn-primary btn-sm" onclick="seedDemoData()"><i class="fas fa-database"></i> Generate Demo Data</button></div></div>
                <div class="table-filter-bar"><div class="search-box"><i class="fas fa-search"></i><input type="text" id="userSearchInput" placeholder="Search..." oninput="filterUsersTable(this.value)" /></div><div><select id="userRoleFilter" class="form-select" style="width:auto;padding:8px 14px;" onchange="filterUsersByRole(this.value)"><option value="">All Roles</option><option value="admin">Admin</option><option value="teacher">Teacher</option><option value="student">Student</option><option value="parent">Parent</option></select></div></div>
                <div class="table-card"><div class="table-responsive"><table class="modern-table"><thead><tr><th>#</th><th>User</th><th>Email</th><th>Role</th><th>Change Role</th><th>Actions</th></tr></thead><tbody id="usersTableBody"><tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr></tbody></table></div></div>
            </div>

            <!-- ===== STUDENTS ===== -->
            <div id="page-students" class="page-content">
                <div class="page-header-box"><div class="page-header-info"><h2><i class="fas fa-user-graduate"></i> Students</h2><p>Manage student enrollments.</p></div><div class="header-actions"><button id="addStudentBtn" class="btn btn-primary" onclick="openStudentModal()"><i class="fas fa-plus"></i> Add Student</button></div></div>
                <div class="table-filter-bar"><div class="search-box"><i class="fas fa-search"></i><input type="text" id="studentSearchInput" placeholder="Search..." oninput="filterStudentsTable(this.value)" /></div><div><select id="studentCourseFilter" class="form-select" style="width:auto;padding:8px 14px;" onchange="filterStudentsByCourse(this.value)"><option value="">All Courses</option></select></div></div>
                <div class="table-card"><div class="table-responsive"><table class="modern-table"><thead><tr><th>#</th><th>Student</th><th>Email</th><th>Course</th><th>Status</th><th>Actions</th></tr></thead><tbody id="studentsTableBody"><tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr></tbody></table></div></div>
            </div>

            <!-- ===== COURSES ===== -->
            <div id="page-courses" class="page-content">
                <div class="page-header-box"><div class="page-header-info"><h2><i class="fas fa-book"></i> Courses</h2><p>Manage academic courses.</p></div><div class="header-actions"><button id="addCourseBtn" class="btn btn-primary" onclick="openCourseModal()"><i class="fas fa-plus"></i> Add Course</button></div></div>
                <div class="table-card"><div class="table-responsive"><table class="modern-table"><thead><tr><th>#</th><th>Course</th><th>Code</th><th>Credits</th><th>Instructor</th><th>Enrolled</th><th>Actions</th></tr></thead><tbody id="coursesTableBody"><tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr></tbody></table></div></div>
            </div>

            <!-- ===== ATTENDANCE ===== -->
            <div id="page-attendance" class="page-content">
                <div class="page-header-box"><div class="page-header-info"><h2><i class="fas fa-clipboard-user"></i> Attendance</h2><p>Track daily roll-calls.</p></div><div class="header-actions"><button id="markAttendanceBtn" class="btn btn-primary" onclick="openBatchAttendanceModal()"><i class="fas fa-check-double"></i> Batch Mark Attendance</button></div></div>
                <div class="table-filter-bar"><div class="search-box"><i class="fas fa-search"></i><input type="text" id="attendanceSearchInput" placeholder="Filter..." oninput="filterAttendanceTable(this.value)" /></div><div><input type="date" id="attendanceDateFilter" class="form-control" style="width:auto;padding:8px 12px;" onchange="loadAttendance()" /></div></div>
                <div class="table-card"><div class="table-responsive"><table class="modern-table"><thead><tr><th>#</th><th>Student</th><th>Date</th><th>Status</th><th>Course</th><th>Actions</th></tr></thead><tbody id="attendanceTableBody"><tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr></tbody></table></div></div>
            </div>

            <!-- ===== GRADES ===== -->
            <div id="page-grades" class="page-content">
                <div class="page-header-box"><div class="page-header-info"><h2><i class="fas fa-star-half-stroke"></i> Grades</h2><p>Record exam scores.</p></div><div class="header-actions"><button id="addGradeBtn" class="btn btn-primary" onclick="openGradeModal()"><i class="fas fa-plus"></i> Add Grade</button></div></div>
                <div class="table-card"><div class="table-responsive"><table class="modern-table"><thead><tr><th>#</th><th>Student</th><th>Course</th><th>Score</th><th>Letter</th><th>Remarks</th><th>Actions</th></tr></thead><tbody id="gradesTableBody"><tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr></tbody></table></div></div>
            </div>

            <!-- ===== FEES ===== -->
            <div id="page-fees" class="page-content">
                <div class="page-header-box"><div class="page-header-info"><h2><i class="fas fa-wallet"></i> Fees</h2><p>Manage tuition invoices.</p></div><div class="header-actions"><button id="addFeeBtn" class="btn btn-primary" onclick="openFeeModal()"><i class="fas fa-plus"></i> Issue Fee</button></div></div>
                <div class="table-card"><div class="table-responsive"><table class="modern-table"><thead><tr><th>#</th><th>Student</th><th>Description</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead><tbody id="feesTableBody"><tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr></tbody></table></div></div>
            </div>

            <!-- ===== REPORTS ===== -->
            <div id="page-reports" class="page-content">
                <div class="page-header-box"><div class="page-header-info"><h2><i class="fas fa-chart-line"></i> Reports</h2><p>Generate summaries.</p></div><div class="header-actions"><button class="btn btn-secondary btn-sm" onclick="exportCurrentReportCSV()"><i class="fas fa-file-csv"></i> Export CSV</button><button class="btn btn-primary btn-sm" onclick="window.print()"><i class="fas fa-print"></i> Print</button></div></div>
                <div class="reports-cards-grid">
                    <div class="report-selection-card active" onclick="generateReport('students', this)"><i class="fas fa-users"></i><h4>Students</h4><p>Enrollment</p></div>
                    <div class="report-selection-card" onclick="generateReport('attendance', this)"><i class="fas fa-calendar-check"></i><h4>Attendance</h4><p>Metrics</p></div>
                    <div class="report-selection-card" onclick="generateReport('grades', this)"><i class="fas fa-award"></i><h4>Grades</h4><p>Performance</p></div>
                    <div class="report-selection-card" onclick="generateReport('fees', this)"><i class="fas fa-receipt"></i><h4>Fees</h4><p>Revenue</p></div>
                </div>
                <div class="card-panel" id="reportDisplayArea"></div>
            </div>
        </main>
    </div>

    <!-- ===== MODALS ===== -->
    <div id="forgotPasswordModal" class="modal-backdrop"><div class="modal-dialog"><div class="modal-header"><h3><i class="fas fa-key" style="color:var(--primary);"></i> Reset Password</h3><button class="modal-close" onclick="closeModal('forgotPasswordModal')"><i class="fas fa-xmark"></i></button></div><form onsubmit="handleForgotPassword(event)"><p style="color:var(--text-muted);font-size:.875rem;margin-bottom:18px;">Enter your registered email.</p><div class="form-group"><label>Email</label><input type="email" id="forgotEmail" class="form-control" required /></div><button type="submit" class="btn btn-primary" style="width:100%;"><i class="fas fa-paper-plane"></i> Send Reset Link</button></form></div></div>
    <div id="studentModal" class="modal-backdrop"><div class="modal-dialog"><div class="modal-header"><h3 id="studentModalTitle"><i class="fas fa-user-plus" style="color:var(--primary);"></i> Add Student</h3><button class="modal-close" onclick="closeModal('studentModal')"><i class="fas fa-xmark"></i></button></div><form id="studentForm" onsubmit="saveStudent(event)"><input type="hidden" id="studentId" /><div class="form-group"><label>Name</label><input type="text" id="studentName" class="form-control" required /></div><div class="form-group"><label>Email</label><input type="email" id="studentEmail" class="form-control" required /></div><div class="form-group"><label>Course</label><select id="studentCourseSelect" class="form-select" required></select></div><div class="form-group"><label>Status</label><select id="studentStatusSelect" class="form-select"><option value="active">Active</option><option value="inactive">Inactive</option></select></div><button type="submit" class="btn btn-primary" style="width:100%;"><i class="fas fa-floppy-disk"></i> Save</button></form></div></div>
    <div id="courseModal" class="modal-backdrop"><div class="modal-dialog"><div class="modal-header"><h3 id="courseModalTitle"><i class="fas fa-book" style="color:var(--primary);"></i> Add Course</h3><button class="modal-close" onclick="closeModal('courseModal')"><i class="fas fa-xmark"></i></button></div><form id="courseForm" onsubmit="saveCourse(event)"><input type="hidden" id="courseId" /><div class="form-group"><label>Title</label><input type="text" id="courseName" class="form-control" required /></div><div class="form-group"><label>Code</label><input type="text" id="courseCode" class="form-control" required /></div><div class="form-group"><label>Credits</label><input type="number" id="courseCredits" class="form-control" min="1" max="10" value="3" required /></div><div class="form-group"><label>Instructor</label><input type="text" id="courseInstructor" class="form-control" /></div><button type="submit" class="btn btn-primary" style="width:100%;"><i class="fas fa-floppy-disk"></i> Save</button></form></div></div>
    <div id="batchAttendanceModal" class="modal-backdrop"><div class="modal-dialog modal-lg"><div class="modal-header"><h3><i class="fas fa-clipboard-check" style="color:var(--primary);"></i> Batch Attendance</h3><button class="modal-close" onclick="closeModal('batchAttendanceModal')"><i class="fas fa-xmark"></i></button></div><div><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;"><div class="form-group"><label>Date</label><input type="date" id="batchAttDate" class="form-control" /></div><div class="form-group"><label>Filter by Course</label><select id="batchAttCourse" class="form-select" onchange="renderBatchAttendanceList()"></select></div></div><div style="display:flex;justify-content:space-between;align-items:center;margin:14px 0 8px;"><span style="font-size:.8rem;color:var(--text-muted);font-weight:600;">ROSTER</span><div><button type="button" class="btn btn-secondary btn-sm" onclick="setAllBatchStatus('present')">All Present</button><button type="button" class="btn btn-secondary btn-sm" onclick="setAllBatchStatus('absent')">All Absent</button></div></div><div class="batch-attendance-list" id="batchStudentList"></div><button type="button" class="btn btn-primary" style="width:100%;" onclick="submitBatchAttendance()"><i class="fas fa-check-double"></i> Save Attendance</button></div></div></div>
    <div id="gradeModal" class="modal-backdrop"><div class="modal-dialog"><div class="modal-header"><h3 id="gradeModalTitle"><i class="fas fa-award" style="color:var(--primary);"></i> Add Grade</h3><button class="modal-close" onclick="closeModal('gradeModal')"><i class="fas fa-xmark"></i></button></div><form id="gradeForm" onsubmit="saveGrade(event)"><input type="hidden" id="gradeId" /><div class="form-group"><label>Student</label><select id="gradeStudentSelect" class="form-select" required></select></div><div class="form-group"><label>Course</label><select id="gradeCourseSelect" class="form-select" required></select></div><div class="form-group"><label>Score</label><input type="number" id="gradeValue" class="form-control" min="0" max="100" required /></div><div class="form-group"><label>Remarks</label><input type="text" id="gradeRemarks" class="form-control" /></div><button type="submit" class="btn btn-primary" style="width:100%;"><i class="fas fa-floppy-disk"></i> Save</button></form></div></div>
    <div id="feeModal" class="modal-backdrop"><div class="modal-dialog"><div class="modal-header"><h3 id="feeModalTitle"><i class="fas fa-file-invoice-dollar" style="color:var(--primary);"></i> Fee Invoice</h3><button class="modal-close" onclick="closeModal('feeModal')"><i class="fas fa-xmark"></i></button></div><form id="feeForm" onsubmit="saveFee(event)"><input type="hidden" id="feeId" /><div class="form-group"><label>Student</label><select id="feeStudentSelect" class="form-select" required></select></div><div class="form-group"><label>Description</label><input type="text" id="feeDescription" class="form-control" required /></div><div class="form-group"><label>Amount ($)</label><input type="number" id="feeAmount" class="form-control" min="1" step="0.01" required /></div><div class="form-group"><label>Due Date</label><input type="date" id="feeDueDate" class="form-control" required /></div><div class="form-group"><label>Status</label><select id="feeStatusSelect" class="form-select"><option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option></select></div><button type="submit" class="btn btn-primary" style="width:100%;"><i class="fas fa-floppy-disk"></i> Save</button></form></div></div>
    <div id="invoiceModal" class="modal-backdrop"><div class="modal-dialog"><div class="modal-header"><h3><i class="fas fa-receipt" style="color:var(--primary);"></i> Receipt</h3><button class="modal-close" onclick="closeModal('invoiceModal')"><i class="fas fa-xmark"></i></button></div><div id="invoiceDetailsBody" style="background:rgba(0,0,0,0.25);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:20px;margin-bottom:16px;"></div><div style="display:flex;gap:10px;"><button class="btn btn-secondary" style="flex:1;" onclick="closeModal('invoiceModal')">Close</button><button class="btn btn-primary" style="flex:1;" onclick="window.print()"><i class="fas fa-print"></i> Print</button></div></div></div>

    <!-- ========================================================= -->
    <!-- SUPABASE + APPLICATION LOGIC (All in one script) -->
    <!-- ========================================================= -->
    <script>
        // =========================================================
        // 1. SUPABASE CLIENT (fixed: use window.supabase)
        // =========================================================
        const SUPABASE_URL = '${SUPABASE_URL}';
        const SUPABASE_ANON_KEY = '${SUPABASE_ANON_KEY}';

        // Check if Supabase library is loaded
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase library not loaded. Please check network.');
            alert('Supabase library not loaded. Check console.');
        }

        // Create client instance
        const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // =========================================================
        // 2. GLOBAL STATE
        // =========================================================
        let currentUser = null;
        let currentUserRole = 'student';
        let currentUserName = 'User';
        let cachedStudents = [];
        let cachedCourses = [];
        let cachedAttendance = [];
        let cachedGrades = [];
        let cachedFees = [];
        let cachedUsers = [];
        let currentReportType = 'students';

        let dataLoaded = {
            students: false,
            courses: false,
            attendance: false,
            grades: false,
            fees: false,
            users: false
        };

        let trendChartInstance = null;
        let feeChartInstance = null;

        // =========================================================
        // 3. AUTH (Supabase)
        // =========================================================
        async function initAuth() {
            const { data: { session }, error } = await sb.auth.getSession();
            if (session) {
                currentUser = session.user;
                await fetchUserProfile(session.user);
                showAppUI();
                renderNavigation();
                loadDashboard();
            } else {
                showAuthView('login');
            }

            sb.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    currentUser = session.user;
                    await fetchUserProfile(session.user);
                    showAppUI();
                    renderNavigation();
                    loadDashboard();
                } else if (event === 'SIGNED_OUT') {
                    currentUser = null;
                    currentUserRole = 'student';
                    currentUserName = 'User';
                    showAuthView('login');
                }
            });
        }

        async function fetchUserProfile(user) {
            if (!user) return;
            // Use sb, not supabase
            const { data, error } = await sb
                .from('users')
                .select('name, role')
                .eq('id', user.id)
                .maybeSingle();  // avoid 406 if no row

            if (data) {
                currentUserName = data.name || user.email.split('@')[0];
                currentUserRole = data.role || 'student';
                localStorage.setItem('edu_user_' + user.id, JSON.stringify({
                    name: currentUserName,
                    email: user.email,
                    role: currentUserRole
                }));
            } else {
                // No profile found – insert one
                const name = user.email.split('@')[0];
                const role = 'student';
                const { error: insertError } = await sb
                    .from('users')
                    .insert([{ id: user.id, name, email: user.email, role }]);
                if (insertError) {
                    console.warn('Insert error (maybe duplicate):', insertError);
                    // If conflict, try to fetch again (race condition)
                    if (insertError.code === '23505') { // unique violation
                        const { data: retryData } = await sb
                            .from('users')
                            .select('name, role')
                            .eq('id', user.id)
                            .maybeSingle();
                        if (retryData) {
                            currentUserName = retryData.name || user.email.split('@')[0];
                            currentUserRole = retryData.role || 'student';
                        }
                    }
                    return;
                }
                currentUserName = name;
                currentUserRole = role;
            }
            updateUserDisplay();
            renderNavigation();
        }

        // =========================================================
        // 4. UI HELPERS (Global functions)
        // =========================================================
        function showAuthView(view) {
            document.getElementById('appContainer').style.display = 'none';
            document.getElementById('loginView').style.display = (view === 'login') ? 'flex' : 'none';
            document.getElementById('registerView').style.display = (view === 'register') ? 'flex' : 'none';
        }

        function showAppUI() {
            document.getElementById('loginView').style.display = 'none';
            document.getElementById('registerView').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
            updateUserDisplay();
        }

        function updateUserDisplay() {
            const initials = currentUserName ? currentUserName.charAt(0).toUpperCase() : 'U';
            document.getElementById('userAvatar').textContent = initials;
            document.getElementById('navUserName').textContent = currentUserName;
            document.getElementById('welcomeUserName').textContent = currentUserName;
            document.getElementById('drawerAvatar').textContent = initials;
            document.getElementById('drawerUserName').textContent = currentUserName;

            const roleBadges = [document.getElementById('navUserRoleBadge'), document.getElementById('drawerUserRoleBadge')];
            roleBadges.forEach(badge => {
                if (badge) {
                    badge.className = 'role-badge ' + currentUserRole;
                    let icon = currentUserRole === 'admin' ? 'fa-crown' :
                               currentUserRole === 'teacher' ? 'fa-chalkboard-user' :
                               currentUserRole === 'parent' ? 'fa-user-group' : 'fa-user-graduate';
                    badge.innerHTML = '<i class="fas ' + icon + '"></i> ' + capitalize(currentUserRole);
                }
            });
            const seederBtn = document.getElementById('adminQuickSeedBtn');
            if (seederBtn) seederBtn.style.display = (currentUserRole === 'admin') ? 'inline-flex' : 'none';
        }

        function renderNavigation() {
            const navItems = [
                { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high', roles: ['admin','teacher','student','parent'] },
                { id: 'users', label: 'Users & Roles', icon: 'fa-user-shield', roles: ['admin'] },
                { id: 'students', label: 'Students', icon: 'fa-user-graduate', roles: ['admin','teacher'] },
                { id: 'courses', label: 'Courses', icon: 'fa-book', roles: ['admin','teacher','student'] },
                { id: 'attendance', label: 'Attendance', icon: 'fa-clipboard-user', roles: ['admin','teacher','student','parent'] },
                { id: 'grades', label: 'Grades', icon: 'fa-star-half-stroke', roles: ['admin','teacher','student','parent'] },
                { id: 'fees', label: 'Fees', icon: 'fa-wallet', roles: ['admin','teacher','student','parent'] },
                { id: 'reports', label: 'Reports', icon: 'fa-chart-line', roles: ['admin','teacher'] }
            ];
            const allowed = navItems.filter(item => item.roles.includes(currentUserRole));
            document.getElementById('desktopNavLinks').innerHTML = allowed.map(item => \`
                <li><a href="#" data-page="\${item.id}" class="\${item.id === 'dashboard' ? 'active' : ''}" onclick="event.preventDefault();switchPage('\${item.id}')"><i class="fas \${item.icon}"></i> \${item.label}</a></li>
            \`).join('');
            document.getElementById('mobileNavLinks').innerHTML = allowed.map(item => \`
                <li><a href="#" data-page="\${item.id}" class="\${item.id === 'dashboard' ? 'active' : ''}" onclick="event.preventDefault();switchPage('\${item.id}')"><i class="fas \${item.icon}"></i> \${item.label}</a></li>
            \`).join('');

            const canEdit = (currentUserRole === 'admin' || currentUserRole === 'teacher');
            document.getElementById('addStudentBtn').style.display = canEdit ? 'inline-flex' : 'none';
            document.getElementById('addCourseBtn').style.display = (currentUserRole === 'admin') ? 'inline-flex' : 'none';
            document.getElementById('markAttendanceBtn').style.display = canEdit ? 'inline-flex' : 'none';
            document.getElementById('addGradeBtn').style.display = canEdit ? 'inline-flex' : 'none';
            document.getElementById('addFeeBtn').style.display = (currentUserRole === 'admin') ? 'inline-flex' : 'none';
            document.getElementById('quickActionsContainer').style.display = canEdit ? 'grid' : 'none';
        }

        function toggleMobileDrawer(open) {
            const drawer = document.getElementById('mobileDrawer');
            const overlay = document.getElementById('drawerOverlay');
            if (open) { drawer.classList.add('open'); overlay.classList.add('open'); } else { drawer.classList.remove('open'); overlay.classList.remove('open'); }
        }

        function switchPage(pageId) {
            document.querySelectorAll('.nav-links a, .drawer-links a').forEach(a => a.classList.toggle('active', a.getAttribute('data-page') === pageId));
            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('page-' + pageId);
            if (target) target.classList.add('active');
            toggleMobileDrawer(false);
            if (pageId === 'dashboard') loadDashboard();
            if (pageId === 'users') loadUsers();
            if (pageId === 'students') loadStudents();
            if (pageId === 'courses') loadCourses();
            if (pageId === 'attendance') loadAttendance();
            if (pageId === 'grades') loadGrades();
            if (pageId === 'fees') loadFees();
            if (pageId === 'reports') generateReport(currentReportType);
        }

        // =========================================================
        // 5. CRUD HELPER
        // =========================================================
        async function fetchTable(table, orderBy, limit = 200, filter = null) {
            let query = sb.from(table).select('*').order(orderBy || 'created_at', { ascending: false }).limit(limit);
            if (filter) {
                query = query.eq(filter.field, filter.value);
            }
            const { data, error } = await query;
            if (error) throw error;
            return data;
        }

        // =========================================================
        // 6. DASHBOARD
        // =========================================================
        async function loadDashboard() {
            try {
                if (!dataLoaded.students) {
                    const data = await fetchTable('students', 'name');
                    cachedStudents = data || [];
                    dataLoaded.students = true;
                }
                if (!dataLoaded.courses) {
                    const data = await fetchTable('courses', 'name');
                    cachedCourses = data || [];
                    dataLoaded.courses = true;
                }
                if (!dataLoaded.fees) {
                    const data = await fetchTable('fees', 'due_date');
                    cachedFees = data || [];
                    dataLoaded.fees = true;
                }
                if (!dataLoaded.attendance) {
                    const data = await fetchTable('attendance', 'date', 100);
                    cachedAttendance = data || [];
                    dataLoaded.attendance = true;
                }

                document.getElementById('statTotalStudents').textContent = cachedStudents.length;
                document.getElementById('statTotalCourses').textContent = cachedCourses.length;
                const today = new Date().toISOString().split('T')[0];
                const presentToday = cachedAttendance.filter(a => a.date === today && a.status === 'present').length;
                document.getElementById('statPresentToday').textContent = presentToday;
                const totalPaid = cachedFees.filter(f => f.status === 'paid').reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
                document.getElementById('statTotalFees').textContent = '$' + totalPaid.toLocaleString();

                renderDashboardCharts();
            } catch (e) { console.warn('Dashboard load:', e.message); }
        }

        function refreshDashboard() {
            dataLoaded.students = false; dataLoaded.courses = false; dataLoaded.fees = false; dataLoaded.attendance = false;
            loadDashboard();
            showToast('Dashboard refreshed.', 'info');
        }

        function renderDashboardCharts() {
            const trendCtx = document.getElementById('dashboardTrendChart');
            if (trendCtx) {
                if (trendChartInstance) trendChartInstance.destroy();
                trendChartInstance = new Chart(trendCtx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [
                            { label: 'Attendance Rate (%)', data: [88,92,95,91,89,78,85], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.15)', fill: true, tension: 0.4, borderWidth: 3 },
                            { label: 'Engagements', data: [70,75,82,85,80,65,78], borderColor: '#06b6d4', borderDash: [5,5], tension: 0.4, fill: false }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } } } }
                });
            }
            const feeCtx = document.getElementById('dashboardFeeChart');
            if (feeCtx) {
                if (feeChartInstance) feeChartInstance.destroy();
                const paid = cachedFees.filter(f => f.status === 'paid').length || 1;
                const pending = cachedFees.filter(f => f.status === 'pending').length || 1;
                const overdue = cachedFees.filter(f => f.status === 'overdue').length || 0;
                feeChartInstance = new Chart(feeCtx, {
                    type: 'doughnut',
                    data: { labels: ['Paid','Pending','Overdue'], datasets: [{ data: [paid,pending,overdue], backgroundColor: ['#10b981','#f59e0b','#ef4444'], borderWidth: 0, hoverOffset: 6 }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }, cutout: '70%' }
                });
            }
        }

        // =========================================================
        // 7. AUTH HANDLERS
        // =========================================================
        async function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            if (!email || !password) { showToast('Please fill all fields.', 'error'); return; }
            try {
                const { data, error } = await sb.auth.signInWithPassword({ email, password });
                if (error) throw error;
                showToast('Welcome back!', 'success');
            } catch (err) {
                showToast(err.message || 'Login failed.', 'error');
            }
        }

        async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    if (!name || !email || password.length < 6) {
        showToast('Fill all fields (password min 6).', 'error');
        return;
    }
    try {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
            // Use upsert to avoid 409 conflict
            const { error: upsertError } = await sb
                .from('users')
                .upsert({ id: data.user.id, name, email, role }, { onConflict: 'id' });
            if (upsertError) {
                console.error('Upsert error:', upsertError);
                showToast('Failed to save user profile: ' + upsertError.message, 'error');
                return;
            }
        }
        if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        showToast('Account created! Please login.', 'success');
        showAuthView('login');
    } catch (err) {
        showToast(err.message || 'Registration failed.', 'error');
    }
}

        async function handleForgotPassword(e) {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value.trim();
            if (!email) return;
            try {
                const { error } = await sb.auth.resetPasswordForEmail(email);
                if (error) throw error;
                showToast('Password reset link sent to ' + email, 'success');
                closeModal('forgotPasswordModal');
            } catch (err) {
                showToast(err.message, 'error');
            }
        }

        function handleLogout() {
            sb.auth.signOut().then(() => {
                showToast('Logged out.', 'info');
                toggleMobileDrawer(false);
            });
        }

        // =========================================================
        // 8. USERS (admin only)
        // =========================================================
        async function loadUsers(force = false) {
            if (currentUserRole !== 'admin') return;
            if (!force && dataLoaded.users) { renderUsersTable(cachedUsers); return; }
            document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr>';
            try {
                const { data, error } = await sb.from('users').select('*').order('name');
                if (error) throw error;
                cachedUsers = data || [];
                dataLoaded.users = true;
                renderUsersTable(cachedUsers);
            } catch (e) { document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--danger);">Failed to load.</td></tr>'; }
        }

        function renderUsersTable(users) {
            const tbody = document.getElementById('usersTableBody');
            if (!users.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">No users.</td></tr>'; return; }
            tbody.innerHTML = users.map((u, i) => \`
                <tr>
                    <td>\${i+1}</td>
                    <td><div style="display:flex;align-items:center;gap:10px;"><div class="avatar-circle" style="width:30px;height:30px;font-size:0.75rem;">\${(u.name||'U').charAt(0).toUpperCase()}</div><strong>\${escapeHtml(u.name)}</strong></div></td>
                    <td>\${escapeHtml(u.email)}</td>
                    <td><span class="role-badge \${u.role||'student'}">\${capitalize(u.role||'student')}</span></td>
                    <td><select class="form-select" style="padding:4px 8px;font-size:0.8rem;width:auto;" onchange="updateUserRole('\${u.id}', this.value)"><option value="student" \${u.role==='student'?'selected':''}>Student</option><option value="teacher" \${u.role==='teacher'?'selected':''}>Teacher</option><option value="parent" \${u.role==='parent'?'selected':''}>Parent</option><option value="admin" \${u.role==='admin'?'selected':''}>Admin</option></select></td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteUserRecord('\${u.id}')"><i class="fas fa-trash"></i></button></td>
                </tr>
            \`).join('');
        }

        async function updateUserRole(id, role) {
            try {
                const { error } = await sb.from('users').update({ role }).eq('id', id);
                if (error) throw error;
                showToast('Role updated!', 'success');
                if (currentUser && currentUser.id === id) {
                    currentUserRole = role;
                    updateUserDisplay();
                    renderNavigation();
                }
                loadUsers(true);
            } catch (e) { showToast(e.message, 'error'); }
        }

        async function deleteUserRecord(id) {
            if (!confirm('Delete this user?')) return;
            try {
                const { error } = await sb.from('users').delete().eq('id', id);
                if (error) throw error;
                showToast('User deleted.', 'success');
                loadUsers(true);
            } catch (e) { showToast(e.message, 'error'); }
        }

        function filterUsersTable(q) {
            const query = q.toLowerCase();
            renderUsersTable(cachedUsers.filter(u => (u.name && u.name.toLowerCase().includes(query)) || (u.email && u.email.toLowerCase().includes(query)) || (u.role && u.role.toLowerCase().includes(query))));
        }

        function filterUsersByRole(role) {
            if (!role) renderUsersTable(cachedUsers);
            else renderUsersTable(cachedUsers.filter(u => u.role === role));
        }

        // =========================================================
        // 9. STUDENTS
        // =========================================================
        async function loadStudents(force = false) {
            if (!force && dataLoaded.students) { populateCourseDropdowns(); renderStudentsTable(cachedStudents); return; }
            document.getElementById('studentsTableBody').innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr>';
            try {
                const { data, error } = await sb.from('students').select('*').order('name');
                if (error) throw error;
                cachedStudents = data || [];
                dataLoaded.students = true;
                populateCourseDropdowns();
                renderStudentsTable(cachedStudents);
            } catch (e) { document.getElementById('studentsTableBody').innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--danger);">Failed.</td></tr>'; }
        }

        function renderStudentsTable(students) {
            const tbody = document.getElementById('studentsTableBody');
            if (!students.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">No students.</td></tr>'; return; }
            const canEdit = (currentUserRole === 'admin' || currentUserRole === 'teacher');
            tbody.innerHTML = students.map((s, i) => \`
                <tr>
                    <td>\${i+1}</td>
                    <td><div style="display:flex;align-items:center;gap:10px;"><div class="avatar-circle" style="width:32px;height:32px;font-size:0.8rem;">\${(s.name||'S').charAt(0).toUpperCase()}</div><strong>\${escapeHtml(s.name)}</strong></div></td>
                    <td>\${escapeHtml(s.email)}</td>
                    <td><span style="font-weight:600;color:#38bdf8;">\${escapeHtml(s.course||'Unassigned')}</span></td>
                    <td><span class="status-badge \${s.status||'active'}">\${capitalize(s.status||'active')}</span></td>
                    <td>\${canEdit ? \`<button class="btn-icon" onclick="editStudent('\${s.id}')"><i class="fas fa-pen-to-square"></i></button><button class="btn-icon" style="color:#f87171;" onclick="deleteStudent('\${s.id}')"><i class="fas fa-trash"></i></button>\` : '<span style="color:var(--text-subtle);font-size:0.75rem;">View</span>'}</td>
                </tr>
            \`).join('');
        }

        function openStudentModal(student = null) {
            populateCourseDropdowns();
            document.getElementById('studentModalTitle').innerHTML = student ? '<i class="fas fa-user-pen" style="color:var(--primary);"></i> Edit Student' : '<i class="fas fa-user-plus" style="color:var(--primary);"></i> Add Student';
            document.getElementById('studentId').value = student ? student.id : '';
            document.getElementById('studentName').value = student ? student.name : '';
            document.getElementById('studentEmail').value = student ? student.email : '';
            document.getElementById('studentCourseSelect').value = student ? student.course : '';
            document.getElementById('studentStatusSelect').value = student ? (student.status || 'active') : 'active';
            openModal('studentModal');
        }

        async function saveStudent(e) {
            e.preventDefault();
            const id = document.getElementById('studentId').value;
            const data = { name: document.getElementById('studentName').value.trim(), email: document.getElementById('studentEmail').value.trim(), course: document.getElementById('studentCourseSelect').value, status: document.getElementById('studentStatusSelect').value, updated_at: new Date().toISOString() };
            try {
                if (id) {
                    const { error } = await sb.from('students').update(data).eq('id', id);
                    if (error) throw error;
                    showToast('Updated.', 'success');
                } else {
                    data.created_at = new Date().toISOString();
                    const { error } = await sb.from('students').insert([data]);
                    if (error) throw error;
                    showToast('Added!', 'success');
                }
                closeModal('studentModal');
                dataLoaded.students = false;
                loadStudents(true);
            } catch (e) { showToast(e.message, 'error'); }
        }

        function editStudent(id) {
            const s = cachedStudents.find(st => st.id === id);
            if (s) openStudentModal(s);
        }

        async function deleteStudent(id) {
            if (!confirm('Delete?')) return;
            try {
                const { error } = await sb.from('students').delete().eq('id', id);
                if (error) throw error;
                showToast('Deleted.', 'success');
                dataLoaded.students = false;
                loadStudents(true);
            } catch (e) { showToast(e.message, 'error'); }
        }

        function filterStudentsTable(q) {
            const query = q.toLowerCase();
            renderStudentsTable(cachedStudents.filter(s => (s.name && s.name.toLowerCase().includes(query)) || (s.email && s.email.toLowerCase().includes(query)) || (s.course && s.course.toLowerCase().includes(query))));
        }

        function filterStudentsByCourse(course) {
            if (!course) renderStudentsTable(cachedStudents);
            else renderStudentsTable(cachedStudents.filter(s => s.course === course));
        }

        // =========================================================
        // 10. COURSES
        // =========================================================
        async function loadCourses(force = false) {
            if (!force && dataLoaded.courses) { renderCoursesTable(cachedCourses); return; }
            document.getElementById('coursesTableBody').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr>';
            try {
                const { data, error } = await sb.from('courses').select('*').order('name');
                if (error) throw error;
                cachedCourses = data || [];
                dataLoaded.courses = true;
                renderCoursesTable(cachedCourses);
            } catch (e) { document.getElementById('coursesTableBody').innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--danger);">Failed.</td></tr>'; }
        }

        function renderCoursesTable(courses) {
            const tbody = document.getElementById('coursesTableBody');
            if (!courses.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No courses.</td></tr>'; return; }
            const canManage = (currentUserRole === 'admin');
            tbody.innerHTML = courses.map((c, i) => {
                const enrolled = cachedStudents.filter(s => s.course === c.name).length;
                return \`
                    <tr>
                        <td>\${i+1}</td>
                        <td><strong>\${escapeHtml(c.name)}</strong></td>
                        <td><span class="status-badge info">\${escapeHtml(c.code||'N/A')}</span></td>
                        <td>\${c.credits||3} Credits</td>
                        <td>\${escapeHtml(c.instructor||'Staff')}</td>
                        <td><span class="status-badge active"><i class="fas fa-users"></i> \${enrolled}</span></td>
                        <td>\${canManage ? \`<button class="btn-icon" onclick="editCourse('\${c.id}')"><i class="fas fa-pen-to-square"></i></button><button class="btn-icon" style="color:#f87171;" onclick="deleteCourse('\${c.id}')"><i class="fas fa-trash"></i></button>\` : '<span style="color:var(--text-subtle);font-size:0.75rem;">View</span>'}</td>
                    </tr>
                \`;
            }).join('');
        }

        function openCourseModal(course = null) {
            document.getElementById('courseModalTitle').innerHTML = course ? '<i class="fas fa-pen-to-square" style="color:var(--primary);"></i> Edit Course' : '<i class="fas fa-book-medical" style="color:var(--primary);"></i> Add Course';
            document.getElementById('courseId').value = course ? course.id : '';
            document.getElementById('courseName').value = course ? course.name : '';
            document.getElementById('courseCode').value = course ? course.code : '';
            document.getElementById('courseCredits').value = course ? course.credits : '3';
            document.getElementById('courseInstructor').value = course ? (course.instructor || '') : '';
            openModal('courseModal');
        }

        async function saveCourse(e) {
            e.preventDefault();
            const id = document.getElementById('courseId').value;
            const data = { name: document.getElementById('courseName').value.trim(), code: document.getElementById('courseCode').value.trim(), credits: parseInt(document.getElementById('courseCredits').value)||3, instructor: document.getElementById('courseInstructor').value.trim(), updated_at: new Date().toISOString() };
            try {
                if (id) {
                    const { error } = await sb.from('courses').update(data).eq('id', id);
                    if (error) throw error;
                    showToast('Updated.', 'success');
                } else {
                    data.created_at = new Date().toISOString();
                    const { error } = await sb.from('courses').insert([data]);
                    if (error) throw error;
                    showToast('Added!', 'success');
                }
                closeModal('courseModal');
                dataLoaded.courses = false;
                loadCourses(true);
            } catch (e) { showToast(e.message, 'error'); }
        }

        function editCourse(id) {
            const c = cachedCourses.find(cr => cr.id === id);
            if (c) openCourseModal(c);
        }

        async function deleteCourse(id) {
            if (!confirm('Delete?')) return;
            try {
                const { error } = await sb.from('courses').delete().eq('id', id);
                if (error) throw error;
                showToast('Deleted.', 'success');
                dataLoaded.courses = false;
                loadCourses(true);
            } catch (e) { showToast(e.message, 'error'); }
        }

        // =========================================================
        // 11. ATTENDANCE
        // =========================================================
        async function loadAttendance(force = false) {
            if (!force && dataLoaded.attendance) { renderAttendanceTable(cachedAttendance); return; }
            document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr>';
            const dateFilter = document.getElementById('attendanceDateFilter').value;
            try {
                let query = sb.from('attendance').select('*').order('date', { ascending: false }).limit(50);
                if (dateFilter) query = sb.from('attendance').select('*').eq('date', dateFilter);
                const { data, error } = await query;
                if (error) throw error;
                cachedAttendance = data || [];
                dataLoaded.attendance = true;
                renderAttendanceTable(cachedAttendance);
            } catch (e) { document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">No logs.</td></tr>'; }
        }

        function renderAttendanceTable(records) {
            const tbody = document.getElementById('attendanceTableBody');
            if (!records.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">No records.</td></tr>'; return; }
            const canManage = (currentUserRole === 'admin' || currentUserRole === 'teacher');
            tbody.innerHTML = records.map((a, i) => \`
                <tr>
                    <td>\${i+1}</td>
                    <td><strong>\${escapeHtml(a.student_name)}</strong></td>
                    <td><i class="fas fa-calendar-day" style="color:var(--primary);margin-right:6px;"></i>\${a.date}</td>
                    <td><span class="status-badge \${a.status}">\${capitalize(a.status)}</span></td>
                    <td>\${escapeHtml(a.course_name||'General')}</td>
                    <td>\${canManage ? \`<button class="btn-icon" style="color:#f87171;" onclick="deleteAttendance('\${a.id}')"><i class="fas fa-trash"></i></button>\` : '-'}</td>
                </tr>
            \`).join('');
        }

        async function openBatchAttendanceModal() {
            if (!cachedStudents.length) await loadStudents(true);
            if (!cachedCourses.length) await loadCourses(true);
            document.getElementById('batchAttDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('batchAttCourse').innerHTML = '<option value="">All Students</option>' + cachedCourses.map(c => '<option value="' + c.name + '">' + c.name + '</option>').join('');
            renderBatchAttendanceList();
            openModal('batchAttendanceModal');
        }

        function renderBatchAttendanceList() {
            const filter = document.getElementById('batchAttCourse').value;
            const container = document.getElementById('batchStudentList');
            const list = filter ? cachedStudents.filter(s => s.course === filter) : cachedStudents;
            if (!list.length) { container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);">No students.</div>'; return; }
            container.innerHTML = list.map(s => \`
                <div class="batch-item" data-student-id="\${s.id}" data-student-name="\${escapeHtml(s.name)}" data-student-course="\${escapeHtml(s.course||'')}">
                    <div><strong>\${escapeHtml(s.name)}</strong><div style="font-size:0.75rem;color:var(--text-muted);">\${escapeHtml(s.course||'General')}</div></div>
                    <div class="attendance-radio-group">
                        <input type="radio" class="att-radio" name="att_\${s.id}" id="p_\${s.id}" value="present" checked style="display:none;" /><label for="p_\${s.id}" class="att-label present"><i class="fas fa-check"></i> Present</label>
                        <input type="radio" class="att-radio" name="att_\${s.id}" id="a_\${s.id}" value="absent" style="display:none;" /><label for="a_\${s.id}" class="att-label absent"><i class="fas fa-xmark"></i> Absent</label>
                        <input type="radio" class="att-radio" name="att_\${s.id}" id="l_\${s.id}" value="late" style="display:none;" /><label for="l_\${s.id}" class="att-label late"><i class="fas fa-clock"></i> Late</label>
                    </div>
                </div>
            \`).join('');
        }

        function setAllBatchStatus(status) { document.querySelectorAll('.batch-item').forEach(item => { const sid = item.dataset.studentId; const radio = document.getElementById(status.charAt(0)+'_'+sid); if(radio) radio.checked = true; }); }

        async function submitBatchAttendance() {
            const date = document.getElementById('batchAttDate').value;
            if (!date) { showToast('Select date.', 'error'); return; }
            const items = document.querySelectorAll('.batch-item');
            if (!items.length) return;
            const records = [];
            items.forEach(item => {
                const name = item.dataset.studentName;
                const course = item.dataset.studentCourse;
                const sid = item.dataset.studentId;
                const checked = item.querySelector('input[type="radio"]:checked');
                const status = checked ? checked.value : 'present';
                records.push({ student_id: sid, student_name: name, course_name: course, date, status, created_at: new Date().toISOString() });
            });
            try {
                const { error } = await sb.from('attendance').insert(records);
                if (error) throw error;
                showToast('Saved ' + records.length + ' records!', 'success');
                closeModal('batchAttendanceModal');
                dataLoaded.attendance = false;
                loadAttendance(true);
                loadDashboard();
            } catch (e) { showToast(e.message, 'error'); }
        }

        async function deleteAttendance(id) {
            if (!confirm('Delete?')) return;
            try {
                const { error } = await sb.from('attendance').delete().eq('id', id);
                if (error) throw error;
                showToast('Deleted.', 'success');
                dataLoaded.attendance = false;
                loadAttendance(true);
            } catch (e) { showToast(e.message, 'error'); }
        }

        function filterAttendanceTable(q) {
            const query = q.toLowerCase();
            renderAttendanceTable(cachedAttendance.filter(a => (a.student_name && a.student_name.toLowerCase().includes(query)) || (a.status && a.status.toLowerCase().includes(query)) || (a.course_name && a.course_name.toLowerCase().includes(query))));
        }

        // =========================================================
        // 12. GRADES
        // =========================================================
        async function loadGrades(force = false) {
            if (!force && dataLoaded.grades) { renderGradesTable(cachedGrades); return; }
            document.getElementById('gradesTableBody').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr>';
            try {
                const { data, error } = await sb.from('grades').select('*').order('student_name');
                if (error) throw error;
                cachedGrades = data || [];
                dataLoaded.grades = true;
                renderGradesTable(cachedGrades);
            } catch (e) { document.getElementById('gradesTableBody').innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No grades.</td></tr>'; }
        }

        function calcLetter(score) {
            if (score >= 90) return { letter: 'A+', gpa: 4.0, badge: 'active' };
            if (score >= 80) return { letter: 'A', gpa: 3.7, badge: 'active' };
            if (score >= 70) return { letter: 'B', gpa: 3.0, badge: 'info' };
            if (score >= 60) return { letter: 'C', gpa: 2.0, badge: 'pending' };
            if (score >= 50) return { letter: 'D', gpa: 1.0, badge: 'pending' };
            return { letter: 'F', gpa: 0.0, badge: 'danger' };
        }

        function renderGradesTable(grades) {
            const tbody = document.getElementById('gradesTableBody');
            if (!grades.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No grades.</td></tr>'; return; }
            const canManage = (currentUserRole === 'admin' || currentUserRole === 'teacher');
            tbody.innerHTML = grades.map((g, i) => {
                const info = calcLetter(g.grade || 0);
                return \`
                    <tr>
                        <td>\${i+1}</td>
                        <td><strong>\${escapeHtml(g.student_name)}</strong></td>
                        <td><span style="color:#38bdf8;font-weight:600;">\${escapeHtml(g.course_name)}</span></td>
                        <td><strong>\${g.grade}%</strong></td>
                        <td><span class="status-badge \${info.badge}">\${info.letter} (\${info.gpa} GPA)</span></td>
                        <td style="color:var(--text-muted);font-size:0.8rem;">\${escapeHtml(g.remarks||'')}</td>
                        <td>\${canManage ? \`<button class="btn-icon" onclick="editGrade('\${g.id}')"><i class="fas fa-pen-to-square"></i></button><button class="btn-icon" style="color:#f87171;" onclick="deleteGrade('\${g.id}')"><i class="fas fa-trash"></i></button>\` : '<span style="color:var(--text-subtle);font-size:0.75rem;">Finalized</span>'}</td>
                    </tr>
                \`;
            }).join('');
        }

        async function openGradeModal(grade = null) {
            await loadStudents(true);
            await loadCourses(true);
            populateStudentDropdown('gradeStudentSelect');
            populateCourseDropdowns();
            document.getElementById('gradeModalTitle').innerHTML = grade ? '<i class="fas fa-award" style="color:var(--primary);"></i> Edit Grade' : '<i class="fas fa-award" style="color:var(--primary);"></i> Add Grade';
            document.getElementById('gradeId').value = grade ? grade.id : '';
            document.getElementById('gradeStudentSelect').value = grade ? grade.student_name : '';
            document.getElementById('gradeCourseSelect').value = grade ? grade.course_name : '';
            document.getElementById('gradeValue').value = grade ? grade.grade : '';
            document.getElementById('gradeRemarks').value = grade ? (grade.remarks||'') : '';
            openModal('gradeModal');
        }

        async function saveGrade(e) {
            e.preventDefault();
            const id = document.getElementById('gradeId').value;
            const data = { student_name: document.getElementById('gradeStudentSelect').value, course_name: document.getElementById('gradeCourseSelect').value, grade: parseInt(document.getElementById('gradeValue').value)||0, remarks: document.getElementById('gradeRemarks').value.trim(), updated_at: new Date().toISOString() };
            try {
                if (id) {
                    const { error } = await sb.from('grades').update(data).eq('id', id);
                    if (error) throw error;
                    showToast('Updated.', 'success');
                } else {
                    data.created_at = new Date().toISOString();
                    const { error } = await sb.from('grades').insert([data]);
                    if (error) throw error;
                    showToast('Added!', 'success');
                }
                closeModal('gradeModal');
                dataLoaded.grades = false;
                loadGrades(true);
            } catch (e) { showToast(e.message, 'error'); }
        }

        function editGrade(id) { const g = cachedGrades.find(gr => gr.id === id); if(g) openGradeModal(g); }
        async function deleteGrade(id) {
            if (!confirm('Delete?')) return;
            try {
                const { error } = await sb.from('grades').delete().eq('id', id);
                if (error) throw error;
                showToast('Deleted.', 'success');
                dataLoaded.grades = false;
                loadGrades(true);
            } catch (e) { showToast(e.message, 'error'); }
        }

        // =========================================================
        // 13. FEES
        // =========================================================
        async function loadFees(force = false) {
            if (!force && dataLoaded.fees) { renderFeesTable(cachedFees); return; }
            document.getElementById('feesTableBody').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">Loading...</td></tr>';
            try {
                const { data, error } = await sb.from('fees').select('*').order('due_date', { ascending: false });
                if (error) throw error;
                cachedFees = data || [];
                dataLoaded.fees = true;
                renderFeesTable(cachedFees);
            } catch (e) { document.getElementById('feesTableBody').innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No fees.</td></tr>'; }
        }

        function renderFeesTable(fees) {
            const tbody = document.getElementById('feesTableBody');
            if (!fees.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No fees.</td></tr>'; return; }
            const canManage = (currentUserRole === 'admin');
            tbody.innerHTML = fees.map((f, i) => \`
                <tr>
                    <td>\${i+1}</td>
                    <td><strong>\${escapeHtml(f.student_name)}</strong></td>
                    <td>\${escapeHtml(f.description)}</td>
                    <td><strong style="color:#34d399;">$\${(Number(f.amount)||0).toFixed(2)}</strong></td>
                    <td><i class="fas fa-clock" style="color:var(--warning);margin-right:4px;"></i>\${f.due_date||'N/A'}</td>
                    <td><span class="status-badge \${f.status||'pending'}">\${capitalize(f.status||'pending')}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewInvoice('\${f.id}')"><i class="fas fa-file-invoice"></i> Receipt</button>
                        \${canManage ? \`<button class="btn-icon" onclick="editFee('\${f.id}')"><i class="fas fa-pen-to-square"></i></button><button class="btn-icon" style="color:#f87171;" onclick="deleteFee('\${f.id}')"><i class="fas fa-trash"></i></button>\` : ''}
                    </td>
                </tr>
            \`).join('');
        }

        async function openFeeModal(fee = null) {
            await loadStudents(true);
            populateStudentDropdown('feeStudentSelect');
            document.getElementById('feeModalTitle').innerHTML = fee ? '<i class="fas fa-pen-to-square" style="color:var(--primary);"></i> Edit Fee' : '<i class="fas fa-file-invoice-dollar" style="color:var(--primary);"></i> Issue Fee';
            document.getElementById('feeId').value = fee ? fee.id : '';
            document.getElementById('feeStudentSelect').value = fee ? fee.student_name : '';
            document.getElementById('feeDescription').value = fee ? (fee.description||'') : 'Tuition Fee - Semester 1';
            document.getElementById('feeAmount').value = fee ? fee.amount : '450.00';
            document.getElementById('feeDueDate').value = fee ? fee.due_date : new Date().toISOString().split('T')[0];
            document.getElementById('feeStatusSelect').value = fee ? fee.status : 'pending';
            openModal('feeModal');
        }

        async function saveFee(e) {
            e.preventDefault();
            const id = document.getElementById('feeId').value;
            const data = { student_name: document.getElementById('feeStudentSelect').value, description: document.getElementById('feeDescription').value.trim(), amount: parseFloat(document.getElementById('feeAmount').value)||0, due_date: document.getElementById('feeDueDate').value, status: document.getElementById('feeStatusSelect').value, updated_at: new Date().toISOString() };
            try {
                if (id) {
                    const { error } = await sb.from('fees').update(data).eq('id', id);
                    if (error) throw error;
                    showToast('Updated.', 'success');
                } else {
                    data.created_at = new Date().toISOString();
                    const { error } = await sb.from('fees').insert([data]);
                    if (error) throw error;
                    showToast('Issued!', 'success');
                }
                closeModal('feeModal');
                dataLoaded.fees = false;
                loadFees(true);
                loadDashboard();
            } catch (e) { showToast(e.message, 'error'); }
        }

        function editFee(id) { const f = cachedFees.find(fe => fe.id === id); if(f) openFeeModal(f); }
        async function deleteFee(id) {
            if (!confirm('Delete?')) return;
            try {
                const { error } = await sb.from('fees').delete().eq('id', id);
                if (error) throw error;
                showToast('Deleted.', 'success');
                dataLoaded.fees = false;
                loadFees(true);
                loadDashboard();
            } catch (e) { showToast(e.message, 'error'); }
        }

        function viewInvoice(id) {
            const fee = cachedFees.find(f => f.id === id);
            if (!fee) return;
            document.getElementById('invoiceDetailsBody').innerHTML = \`
                <div style="text-align:center;margin-bottom:16px;border-bottom:1px solid var(--border-subtle);padding-bottom:12px;"><h2 style="font-size:1.4rem;color:#fff;">EduPulse Academy</h2><p style="color:var(--text-muted);font-size:0.8rem;">Official Receipt</p></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.875rem;"><span style="color:var(--text-muted);">Invoice:</span><strong>INV-\${fee.id.substring(0,8).toUpperCase()}</strong></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.875rem;"><span style="color:var(--text-muted);">Student:</span><strong>\${escapeHtml(fee.student_name)}</strong></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.875rem;"><span style="color:var(--text-muted);">Description:</span><span>\${escapeHtml(fee.description)}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.875rem;"><span style="color:var(--text-muted);">Due:</span><span>\${fee.due_date}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.875rem;"><span style="color:var(--text-muted);">Status:</span><span class="status-badge \${fee.status}">\${capitalize(fee.status)}</span></div>
                <div style="margin-top:16px;padding-top:12px;border-top:1px dashed var(--border-subtle);display:flex;justify-content:space-between;"><span style="font-size:1.1rem;font-weight:700;">Total:</span><span style="font-size:1.4rem;font-weight:800;color:#34d399;">$\${(Number(fee.amount)||0).toFixed(2)}</span></div>
            \`;
            openModal('invoiceModal');
        }

        // =========================================================
        // 14. REPORTS
        // =========================================================
        async function generateReport(type, element = null) {
            currentReportType = type;
            if (element) { document.querySelectorAll('.report-selection-card').forEach(c => c.classList.remove('active')); element.classList.add('active'); }
            const container = document.getElementById('reportDisplayArea');
            container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> Generating...</div>';
            try {
                if (type === 'students') {
                    const { data, error } = await sb.from('students').select('*').order('name');
                    if (error) throw error;
                    const list = data || [];
                    container.innerHTML = \`
                        <div class="card-panel-header"><h3><i class="fas fa-users" style="color:var(--primary);"></i> Students Registry</h3><span class="status-badge info">Total: \${list.length}</span></div>
                        <div class="table-responsive"><table class="modern-table"><thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Status</th></tr></thead><tbody>\${list.map(s => \`<tr><td><strong>\${escapeHtml(s.name)}</strong></td><td>\${escapeHtml(s.email)}</td><td>\${escapeHtml(s.course)}</td><td><span class="status-badge \${s.status||'active'}">\${capitalize(s.status||'active')}</span></td></tr>\`).join('')}</tbody></table></div>
                    \`;
                } else if (type === 'attendance') {
                    const { data, error } = await sb.from('attendance').select('*').order('date', { ascending: false }).limit(100);
                    if (error) throw error;
                    const list = data || [];
                    const present = list.filter(a => a.status === 'present').length;
                    const absent = list.filter(a => a.status === 'absent').length;
                    const late = list.filter(a => a.status === 'late').length;
                    const rate = list.length ? Math.round((present/list.length)*100) : 0;
                    container.innerHTML = \`
                        <div class="card-panel-header"><h3><i class="fas fa-clipboard-check" style="color:var(--success);"></i> Attendance</h3><span class="status-badge active">\${rate}%</span></div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;">
                            <div style="background:rgba(16,185,129,0.1);padding:14px;border-radius:var(--radius-md);text-align:center;"><h4 style="color:#34d399;font-size:1.5rem;">\${present}</h4><p style="font-size:0.75rem;color:var(--text-muted);">Present</p></div>
                            <div style="background:rgba(239,68,68,0.1);padding:14px;border-radius:var(--radius-md);text-align:center;"><h4 style="color:#f87171;font-size:1.5rem;">\${absent}</h4><p style="font-size:0.75rem;color:var(--text-muted);">Absent</p></div>
                            <div style="background:rgba(245,158,11,0.1);padding:14px;border-radius:var(--radius-md);text-align:center;"><h4 style="color:#fbbf24;font-size:1.5rem;">\${late}</h4><p style="font-size:0.75rem;color:var(--text-muted);">Late</p></div>
                        </div>
                        <div class="table-responsive"><table class="modern-table"><thead><tr><th>Student</th><th>Date</th><th>Status</th></tr></thead><tbody>\${list.slice(0,20).map(a => \`<tr><td>\${escapeHtml(a.student_name)}</td><td>\${a.date}</td><td><span class="status-badge \${a.status}">\${capitalize(a.status)}</span></td></tr>\`).join('')}</tbody></table></div>
                    \`;
                } else if (type === 'grades') {
                    const { data, error } = await sb.from('grades').select('*').order('student_name');
                    if (error) throw error;
                    const list = data || [];
                    const avg = list.length ? (list.reduce((s,g) => s + (g.grade||0), 0)/list.length).toFixed(1) : 0;
                    container.innerHTML = \`
                        <div class="card-panel-header"><h3><i class="fas fa-award" style="color:var(--warning);"></i> Grades</h3><span class="status-badge info">Avg: \${avg}%</span></div>
                        <div class="table-responsive"><table class="modern-table"><thead><tr><th>Student</th><th>Course</th><th>Grade</th><th>Letter</th></tr></thead><tbody>\${list.map(g => { const l=calcLetter(g.grade||0); return \`<tr><td>\${escapeHtml(g.student_name)}</td><td>\${escapeHtml(g.course_name)}</td><td><strong>\${g.grade}%</strong></td><td><span class="status-badge \${l.badge}">\${l.letter}</span></td></tr>\`; }).join('')}</tbody></table></div>
                    \`;
                } else if (type === 'fees') {
                    const { data, error } = await sb.from('fees').select('*');
                    if (error) throw error;
                    const list = data || [];
                    const total = list.reduce((s,f) => s + (Number(f.amount)||0), 0);
                    const paid = list.filter(f => f.status === 'paid').reduce((s,f) => s + (Number(f.amount)||0), 0);
                    const pending = total - paid;
                    container.innerHTML = \`
                        <div class="card-panel-header"><h3><i class="fas fa-receipt" style="color:var(--primary);"></i> Fees</h3><span class="status-badge active">Collected: $\${paid.toLocaleString()}</span></div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;">
                            <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:var(--radius-md);text-align:center;"><h4 style="color:#fff;font-size:1.4rem;">$\${total.toLocaleString()}</h4><p style="font-size:0.75rem;color:var(--text-muted);">Total Billed</p></div>
                            <div style="background:rgba(16,185,129,0.1);padding:14px;border-radius:var(--radius-md);text-align:center;"><h4 style="color:#34d399;font-size:1.4rem;">$\${paid.toLocaleString()}</h4><p style="font-size:0.75rem;color:var(--text-muted);">Collected</p></div>
                            <div style="background:rgba(245,158,11,0.1);padding:14px;border-radius:var(--radius-md);text-align:center;"><h4 style="color:#fbbf24;font-size:1.4rem;">$\${pending.toLocaleString()}</h4><p style="font-size:0.75rem;color:var(--text-muted);">Outstanding</p></div>
                        </div>
                    \`;
                }
            } catch (e) { container.innerHTML = '<div style="text-align:center;color:var(--danger);padding:30px;">Error generating report.</div>'; }
        }

        function exportCurrentReportCSV() {
            const table = document.querySelector('#reportDisplayArea table');
            if (!table) { showToast('No table to export.', 'error'); return; }
            let csv = [];
            document.querySelectorAll('#reportDisplayArea table tr').forEach(row => {
                let rowData = [];
                row.querySelectorAll('td, th').forEach(cell => rowData.push('"' + cell.innerText.replace(/"/g,'""').trim() + '"'));
                csv.push(rowData.join(','));
            });
            const blob = new Blob([csv.join('\\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = \`EduPulse_\${currentReportType}.csv\`; a.click(); URL.revokeObjectURL(url);
            showToast('CSV exported!', 'success');
        }

        // =========================================================
        // 15. SEED DEMO DATA
        // =========================================================
        async function seedDemoData() {
            if (!confirm('Seed demo data? This will add sample data.')) return;
            showToast('Seeding...', 'info');
            try {
                const courses = [
                    { name: 'Computer Science 101', code: 'CS-101', credits: 4, instructor: 'Dr. Alan Turing', created_at: new Date().toISOString() },
                    { name: 'Advanced Mathematics', code: 'MATH-201', credits: 3, instructor: 'Prof. Katherine Johnson', created_at: new Date().toISOString() },
                    { name: 'Modern Physics', code: 'PHYS-102', credits: 4, instructor: 'Dr. Richard Feynman', created_at: new Date().toISOString() },
                    { name: 'Digital Media & Design', code: 'ART-105', credits: 3, instructor: 'Prof. Paula Scher', created_at: new Date().toISOString() }
                ];
                const students = [
                    { name: 'Emma Watson', email: 'emma@school.edu', course: 'Computer Science 101', status: 'active', created_at: new Date().toISOString() },
                    { name: 'Liam Hemsworth', email: 'liam@school.edu', course: 'Advanced Mathematics', status: 'active', created_at: new Date().toISOString() },
                    { name: 'Sophia Chen', email: 'sophia@school.edu', course: 'Modern Physics', status: 'active', created_at: new Date().toISOString() },
                    { name: 'Noah Davis', email: 'noah@school.edu', course: 'Digital Media & Design', status: 'active', created_at: new Date().toISOString() },
                    { name: 'Olivia Taylor', email: 'olivia@school.edu', course: 'Computer Science 101', status: 'active', created_at: new Date().toISOString() }
                ];
                const today = new Date().toISOString().split('T')[0];
                const attendance = students.map(s => ({
                    student_name: s.name,
                    course_name: s.course,
                    date: today,
                    status: Math.random() > 0.2 ? 'present' : 'absent',
                    created_at: new Date().toISOString()
                }));
                const grades = [
                    { student_name: 'Emma Watson', course_name: 'Computer Science 101', grade: 94, remarks: 'Excellent', created_at: new Date().toISOString() },
                    { student_name: 'Liam Hemsworth', course_name: 'Advanced Mathematics', grade: 82, remarks: 'Good', created_at: new Date().toISOString() },
                    { student_name: 'Sophia Chen', course_name: 'Modern Physics', grade: 91, remarks: 'Top lab', created_at: new Date().toISOString() },
                    { student_name: 'Noah Davis', course_name: 'Digital Media & Design', grade: 76, remarks: 'Creative', created_at: new Date().toISOString() }
                ];
                const fees = students.map(s => ({
                    student_name: s.name,
                    description: 'Semester 1 Tuition Fee',
                    amount: 450.00,
                    due_date: '2026-09-30',
                    status: Math.random() > 0.4 ? 'paid' : 'pending',
                    created_at: new Date().toISOString()
                }));

                await sb.from('courses').insert(courses);
                await sb.from('students').insert(students);
                await sb.from('attendance').insert(attendance);
                await sb.from('grades').insert(grades);
                await sb.from('fees').insert(fees);

                if (window.confetti) confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
                showToast('Demo data seeded!', 'success');
                Object.keys(dataLoaded).forEach(key => dataLoaded[key] = false);
                loadDashboard();
            } catch (e) { showToast('Seed error: ' + e.message, 'error'); }
        }

        // =========================================================
        // 16. HELPERS
        // =========================================================
        function populateCourseDropdowns() {
            ['studentCourseSelect','studentCourseFilter','gradeCourseSelect'].forEach(id => {
                const sel = document.getElementById(id);
                if (!sel) return;
                const isFilter = id === 'studentCourseFilter';
                sel.innerHTML = (isFilter ? '<option value="">All Courses</option>' : '<option value="">Select Course</option>') +
                    cachedCourses.map(c => '<option value="' + c.name + '">' + c.name + ' (' + (c.code||'N/A') + ')</option>').join('');
            });
        }

        function populateStudentDropdown(id) {
            const sel = document.getElementById(id);
            if (!sel) return;
            sel.innerHTML = '<option value="">Select Student</option>' +
                cachedStudents.map(s => '<option value="' + s.name + '">' + s.name + ' (' + (s.course||'No course') + ')</option>').join('');
        }

        function openModal(id) { document.getElementById(id).classList.add('show'); }
        function closeModal(id) { document.getElementById(id).classList.remove('show'); }
        function openForgotPasswordModal() { openModal('forgotPasswordModal'); }
        function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
        function escapeHtml(str) { if(!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }

        function showToast(msg, type = 'info') {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = 'toast ' + type;
            const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';
            toast.innerHTML = '<i class="fas ' + icon + '"></i> <span>' + escapeHtml(msg) + '</span>';
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

        window.addEventListener('click', (e) => { if (e.target.classList.contains('modal-backdrop')) e.target.classList.remove('show'); });

        // =========================================================
        // 17. START
        // =========================================================
        initAuth();
        console.log('🚀 EduPulse with Supabase loaded!');
    </script>
</body>
</html>`;

// Write file
fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf8');
console.log('✅ Supabase version generated with fixed client!');
console.log('🚀 Open index.html with Live Server and test.');
console.log('⚠️ Make sure RLS policies for users table are set (see docs).');