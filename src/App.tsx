import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

type AttendanceState = "default" | "loading" | "invalid" | "success" | "active";
type AppView = "student" | "admin-login" | "admin-dashboard";

type Promotion = {
  id: number;
  title: string;
  source: string;
  enabled: boolean;
};

const initialPromotions: Promotion[] = [
  {
    id: 1,
    title: "Practical skills for the modern workplace",
    source:
      "https://images.unsplash.com/photo-1719159381981-1327b22aff9b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600",
    enabled: true,
  },
  {
    id: 2,
    title: "Learn with expert guidance",
    source:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600",
    enabled: true,
  },
  {
    id: 3,
    title: "Build confidence through practice",
    source:
      "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600",
    enabled: true,
  },
];

function Icon({
  name,
  className = "",
}: {
  name: "check" | "arrow" | "upload" | "image" | "trash" | "replace" | "clock" | "shield" | "menu";
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    upload: <><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></>,
    trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="m6 7 1 14h10l1-14" /></>,
    replace: <><path d="M20 7h-5V2" /><path d="M4 17h5v5" /><path d="M6.1 9A7 7 0 0 1 18.4 5.6L20 7" /><path d="M17.9 15A7 7 0 0 1 5.6 18.4L4 17" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    menu: <><path d="M5 8h14" /><path d="M5 16h14" /></>,
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? "brand-light" : ""}`}>
      <img src="/assets/csc-logo-framed.svg" alt="CSC Computer Software College" />
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button className={`button button-${variant}`} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoFocus = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: boolean;
  autoFocus?: boolean;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        aria-invalid={error}
        autoFocus={autoFocus}
      />
    </label>
  );
}

function ViewSwitch({
  view,
  setView,
  light = false,
}: {
  view: AppView;
  setView: (view: AppView) => void;
  light?: boolean;
}) {
  return (
    <nav className={`view-switch ${light ? "view-switch-light" : ""}`} aria-label="Portal navigation">
      <button className={view === "student" ? "active" : ""} onClick={() => setView("student")}>Student</button>
      <button className={view !== "student" ? "active" : ""} onClick={() => setView("admin-login")}>Admin</button>
    </nav>
  );
}

function PromotionPanel({
  promotions,
  activeIndex,
  setActiveIndex,
  view,
  setView,
}: {
  promotions: Promotion[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  view: AppView;
  setView: (view: AppView) => void;
}) {
  const activePromotions = promotions.filter((promotion) => promotion.enabled);
  const current = activePromotions[activeIndex % Math.max(activePromotions.length, 1)] ?? initialPromotions[0];

  return (
    <section className="promo-panel" style={{ backgroundImage: `url("${current.source}")` }}>
      <div className="promo-overlay" />
      <div className="promo-top">
        <Brand light />
        <ViewSwitch view={view} setView={setView} light />
      </div>
      <div className="promo-content">
        <p className="eyebrow">Learn. Practice. Succeed.</p>
        <h1>Build your skills.<br />Build your future.</h1>
        <p className="promo-description">Practical learning for ambitious students ready to move forward with confidence.</p>
        <ul className="benefits">
          {["Practical Computer Training", "Career-Focused Learning", "Supportive Learning Environment"].map((benefit) => (
            <li key={benefit}><span><Icon name="check" /></span>{benefit}</li>
          ))}
        </ul>
      </div>
      <div className="promo-footer">
        <div className="dots" aria-label={`Promotion ${activeIndex + 1} of ${activePromotions.length}`}>
          {activePromotions.map((promotion, index) => (
            <button
              key={promotion.id}
              className={index === activeIndex ? "active" : ""}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show promotion ${index + 1}`}
            />
          ))}
        </div>
        <p>{String(activeIndex + 1).padStart(2, "0")} / {String(activePromotions.length).padStart(2, "0")}</p>
      </div>
    </section>
  );
}

function StatusCard({ state, onDone }: { state: Exclude<AttendanceState, "default" | "loading">; onDone: () => void }) {
  const content = {
    invalid: {
      label: "Unable to continue",
      title: "Register Number Not Found",
      description: "Please check your Register Number and try again.",
      note: "Register numbers are provided by your CSC administrator.",
    },
    success: {
      label: "Attendance Marked",
      title: "Welcome to CSC Class",
      description: "Your attendance has been recorded successfully.",
      note: "Entry time: 09:15 AM",
    },
    active: {
      label: "Attendance Already Active",
      title: "Your session is in progress",
      description: "Your attendance session is already active.",
      note: "Please contact the administrator if you are trying to mark your exit.",
    },
  }[state];

  return (
    <div className={`status-card status-${state}`} role={state === "invalid" ? "alert" : "status"}>
      <div className="status-icon">
        <Icon name={state === "success" ? "check" : state === "active" ? "clock" : "shield"} />
      </div>
      <p className="status-label">{content.label}</p>
      <h2>{content.title}</h2>
      <p className="status-description">{content.description}</p>
      <div className="status-note">{content.note}</div>
      {state === "active" && <p className="approval-note">Exit requests require administrator approval. You have not been marked out.</p>}
      <Button onClick={onDone}>{state === "invalid" ? "Try again" : "Done"}</Button>
    </div>
  );
}

function StudentLogin() {
  const [registerNumber, setRegisterNumber] = useState("");
  const [state, setState] = useState<AttendanceState>("default");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!registerNumber.trim()) return;
    setState("loading");
    window.setTimeout(() => {
      const normalized = registerNumber.trim().toUpperCase();
      setState(normalized === "CSC1001" ? "success" : normalized === "CSC2002" ? "active" : "invalid");
    }, 900);
  };

  const reset = () => {
    setState("default");
    setRegisterNumber("");
  };

  return (
    <main className="login-panel">
      <div className="mobile-brand"><Brand /></div>
      <div className="login-content">
        {state === "default" || state === "loading" ? (
          <>
            <div className="login-heading">
              <p className="section-label">Student attendance</p>
              <h2>Welcome back</h2>
              <p className="lead">Mark your attendance</p>
              <p>Enter your Register Number to continue.</p>
            </div>
            <form onSubmit={submit} className="login-form">
              <TextField
                label="Register Number"
                value={registerNumber}
                onChange={setRegisterNumber}
                placeholder="Enter your register number"
                autoFocus
              />
              <Button type="submit" disabled={!registerNumber.trim() || state === "loading"}>
                {state === "loading" ? <><span className="spinner" />Checking register...</> : <>Login <Icon name="arrow" /></>}
              </Button>
            </form>
            <p className="form-note"><Icon name="shield" /> Use your registered number to mark your attendance.</p>
          </>
        ) : (
          <StatusCard state={state} onDone={reset} />
        )}
      </div>
      <div className="login-footer">
        <span>CSC Class Attendance</span>
        <span>Secure student access</span>
      </div>
    </main>
  );
}

function AdminLogin({ onLogin, onStudent }: { onLogin: () => void; onStudent: () => void }) {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="admin-login-shell">
      <div className="admin-login-card">
        <Brand />
        <div className="admin-login-heading">
          <p className="section-label">Administration</p>
          <h1>Sign in to your workspace</h1>
          <p>Manage attendance and login page promotions securely.</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onLogin(); }} className="login-form">
          <TextField label="Staff ID" value={staffId} onChange={setStaffId} placeholder="Enter your staff ID" />
          <TextField label="Password" value={password} onChange={setPassword} placeholder="Enter your password" type="password" />
          <Button type="submit" disabled={!staffId || !password}>Sign in <Icon name="arrow" /></Button>
        </form>
        <button className="back-link" onClick={onStudent}>Return to student attendance</button>
      </div>
      <div className="admin-login-aside">
        <div>
          <span className="aside-icon"><Icon name="shield" /></span>
          <p className="eyebrow">CSC Class Admin</p>
          <h2>Simple controls.<br />Clear oversight.</h2>
          <p>Keep the student experience current without adding complexity to attendance.</p>
        </div>
      </div>
    </main>
  );
}

function AdminDashboard({
  promotions,
  setPromotions,
  onLogout,
}: {
  promotions: Promotion[];
  setPromotions: (promotions: Promotion[]) => void;
  onLogout: () => void;
}) {
  const uploadRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [replaceId, setReplaceId] = useState<number | null>(null);

  const addFiles = (files: FileList | null, targetId?: number) => {
    if (!files?.[0]) return;
    const source = URL.createObjectURL(files[0]);
    if (targetId) {
      setPromotions(promotions.map((promotion) => promotion.id === targetId ? { ...promotion, source } : promotion));
    } else {
      setPromotions([...promotions, { id: Date.now(), title: files[0].name, source, enabled: true }].slice(0, 5));
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (destination < 0 || destination >= promotions.length) return;
    const updated = [...promotions];
    [updated[index], updated[destination]] = [updated[destination], updated[index]];
    setPromotions(updated);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Brand light />
        <nav>
          <button><span><Icon name="clock" /></span>Attendance</button>
          <button className="active"><span><Icon name="image" /></span>Login Promotions</button>
        </nav>
        <div className="sidebar-profile">
          <div className="avatar">AK</div>
          <div><strong>Admin Kumar</strong><span>Administrator</span></div>
          <button onClick={onLogout}>Sign out</button>
        </div>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="mobile-menu" aria-label="Open menu"><Icon name="menu" /></button>
          <div><p className="section-label">Admin Dashboard</p><h1>Login Page Promotions</h1></div>
          <Button onClick={() => uploadRef.current?.click()}><Icon name="upload" />Upload image</Button>
          <input ref={uploadRef} className="visually-hidden" type="file" accept="image/*" onChange={(event) => addFiles(event.target.files)} />
        </header>
        <section className="dashboard-intro">
          <div>
            <h2>Student login visuals</h2>
            <p>Choose up to five images shown on the student attendance page. Drag order is reflected in the carousel.</p>
          </div>
          <span>{promotions.filter((item) => item.enabled).length} active</span>
        </section>
        <div className="promotion-list">
          {promotions.map((promotion, index) => (
            <article className="promotion-row" key={promotion.id}>
              <div className="drag-index">
                <button onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">↑</button>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <button onClick={() => move(index, 1)} disabled={index === promotions.length - 1} aria-label="Move down">↓</button>
              </div>
              <img src={promotion.source} alt="" />
              <div className="promotion-info">
                <div><strong>Image {index + 1}</strong><span>{promotion.title}</span></div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={promotion.enabled}
                    onChange={() => setPromotions(promotions.map((item) => item.id === promotion.id ? { ...item, enabled: !item.enabled } : item))}
                  />
                  <span />
                  {promotion.enabled ? "Enabled" : "Disabled"}
                </label>
              </div>
              <div className="row-actions">
                <Button variant="secondary" onClick={() => window.open(promotion.source, "_blank")}><Icon name="image" />Preview</Button>
                <Button variant="secondary" onClick={() => { setReplaceId(promotion.id); replaceRef.current?.click(); }}><Icon name="replace" />Replace</Button>
                <Button variant="danger" onClick={() => setPromotions(promotions.filter((item) => item.id !== promotion.id))}><Icon name="trash" />Delete</Button>
              </div>
            </article>
          ))}
        </div>
        <input
          ref={replaceRef}
          className="visually-hidden"
          type="file"
          accept="image/*"
          onChange={(event) => { if (replaceId) addFiles(event.target.files, replaceId); }}
        />
        <div className="dashboard-tip"><Icon name="shield" /><p><strong>Changes appear automatically</strong><span>Enabled promotions rotate on the student login page. The first image is shown by default.</span></p></div>
      </main>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<AppView>("student");
  const [promotions, setPromotions] = useState(initialPromotions);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const enabledCount = promotions.filter((promotion) => promotion.enabled).length;
    if (activeIndex >= enabledCount) setActiveIndex(0);
    const interval = window.setInterval(() => {
      setActiveIndex((index) => enabledCount > 0 ? (index + 1) % enabledCount : 0);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [promotions, activeIndex]);

  if (view === "admin-login") {
    return <AdminLogin onLogin={() => setView("admin-dashboard")} onStudent={() => setView("student")} />;
  }

  if (view === "admin-dashboard") {
    return <AdminDashboard promotions={promotions} setPromotions={setPromotions} onLogout={() => setView("admin-login")} />;
  }

  return (
    <div className="student-shell">
      <PromotionPanel promotions={promotions} activeIndex={activeIndex} setActiveIndex={setActiveIndex} view={view} setView={setView} />
      <div className="mobile-view-switch"><ViewSwitch view={view} setView={setView} /></div>
      <StudentLogin />
    </div>
  );
}
