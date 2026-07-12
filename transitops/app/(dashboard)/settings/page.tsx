"use client";

import { useMemo, useState } from "react";
import { useTheme } from "next-themes";

type TabId = "general" | "appearance" | "notifications" | "security" | "rbac";
type Permission = "Full Access" | "View Only" | "No Access";

const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "general", label: "General", icon: "tune" },
  { id: "appearance", label: "Appearance", icon: "palette" },
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "security", label: "Security", icon: "shield_lock" },
  { id: "rbac", label: "RBAC", icon: "admin_panel_settings" },
];

const roles = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"] as const;
const modules = ["Fleet", "Drivers", "Trips", "Maintenance", "Fuel/Expenses", "Analytics", "Settings"] as const;

const defaultMatrix: Record<string, Record<string, Permission>> = {
  Fleet: {
    "Fleet Manager": "Full Access",
    Dispatcher: "View Only",
    "Safety Officer": "No Access",
    "Financial Analyst": "View Only",
  },
  Drivers: {
    "Fleet Manager": "View Only",
    Dispatcher: "View Only",
    "Safety Officer": "Full Access",
    "Financial Analyst": "No Access",
  },
  Trips: {
    "Fleet Manager": "View Only",
    Dispatcher: "Full Access",
    "Safety Officer": "View Only",
    "Financial Analyst": "View Only",
  },
  Maintenance: {
    "Fleet Manager": "Full Access",
    Dispatcher: "No Access",
    "Safety Officer": "No Access",
    "Financial Analyst": "View Only",
  },
  "Fuel/Expenses": {
    "Fleet Manager": "View Only",
    Dispatcher: "No Access",
    "Safety Officer": "Full Access",
    "Financial Analyst": "Full Access",
  },
  Analytics: {
    "Fleet Manager": "Full Access",
    Dispatcher: "View Only",
    "Safety Officer": "View Only",
    "Financial Analyst": "Full Access",
  },
  Settings: {
    "Fleet Manager": "Full Access",
    Dispatcher: "No Access",
    "Safety Officer": "No Access",
    "Financial Analyst": "No Access",
  },
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full border transition-colors ${
        checked ? "border-primary bg-primary" : "border-outline-variant bg-surface-variant"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-label-md text-label-md uppercase tracking-wider text-outline">{label}</span>
      {children}
      {hint && <span className="font-body-sm text-body-sm text-outline-variant">{hint}</span>}
    </label>
  );
}

function inputClass() {
  return "min-h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 font-body-md text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary";
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const { resolvedTheme, setTheme } = useTheme();
  const [orgName, setOrgName] = useState("TransitOps HQ");
  const [currency, setCurrency] = useState("INR");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [compactMode, setCompactMode] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [licenseAlerts, setLicenseAlerts] = useState(true);
  const [fuelApprovalAlerts, setFuelApprovalAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [auditRetention, setAuditRetention] = useState("180");
  const [matrix, setMatrix] = useState(defaultMatrix);

  const changedPermissions = useMemo(
    () =>
      modules.reduce((count, module) => {
        return (
          count +
          roles.filter((role) => matrix[module][role] !== defaultMatrix[module][role]).length
        );
      }, 0),
    [matrix]
  );

  const setPermission = (module: string, role: string, permission: Permission) => {
    setMatrix((current) => ({
      ...current,
      [module]: {
        ...current[module],
        [role]: permission,
      },
    }));
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-margin">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Settings</h1>
          <p className="mt-2 font-body-md text-body-md text-outline">
            Configure workspace behavior, access, security, and operational preferences.
          </p>
        </div>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-black transition-colors hover:bg-surface-tint">
          <span className="material-symbols-outlined text-[18px]">save</span>
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-container-gap lg:grid-cols-[280px_1fr]">
        <nav className="flex gap-2 overflow-x-auto rounded-lg border border-outline-variant bg-surface-container p-2 lg:flex-col lg:overflow-visible">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-left font-body-md text-body-md transition-colors ${
                activeTab === tab.id
                  ? "bg-surface-container-highest text-primary"
                  : "text-outline hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activeTab === tab.id ? "icon-fill" : ""}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="min-w-0">
          {activeTab === "general" && (
            <div className="grid grid-cols-1 gap-container-gap xl:grid-cols-2">
              <div className="rounded-lg border border-outline-variant bg-surface-container p-5">
                <h2 className="font-headline-sm text-headline-sm text-primary">Organization</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Organization Name">
                    <input className={inputClass()} value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </Field>
                  <Field label="Currency">
                    <select className={inputClass()} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </Field>
                  <Field label="Distance Unit">
                    <select className={inputClass()} value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)}>
                      <option value="km">Kilometers</option>
                      <option value="miles">Miles</option>
                    </select>
                  </Field>
                  <Field label="Date Format">
                    <select className={inputClass()} value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </Field>
                  <Field label="Timezone">
                    <select className={inputClass()} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                      <option>Asia/Kolkata</option>
                      <option>UTC</option>
                      <option>America/New_York</option>
                      <option>Europe/London</option>
                    </select>
                  </Field>
                </div>
              </div>

              <div className="rounded-lg border border-outline-variant bg-surface-container p-5">
                <h2 className="font-headline-sm text-headline-sm text-primary">Operational Defaults</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Default Region">
                    <select className={inputClass()} defaultValue="West">
                      <option>North</option>
                      <option>South</option>
                      <option>East</option>
                      <option>West</option>
                    </select>
                  </Field>
                  <Field label="Fuel Approval Limit">
                    <input className={inputClass()} defaultValue="10000" inputMode="numeric" />
                  </Field>
                  <Field label="License Alert Window">
                    <select className={inputClass()} defaultValue="30">
                      <option value="15">15 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                    </select>
                  </Field>
                  <Field label="Trip Code Prefix">
                    <input className={inputClass()} defaultValue="TRP" maxLength={6} />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="grid grid-cols-1 gap-container-gap xl:grid-cols-3">
              <div className="rounded-lg border border-outline-variant bg-surface-container p-5 xl:col-span-2">
                <h2 className="font-headline-sm text-headline-sm text-primary">Interface</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Theme">
                    <select className={inputClass()} value={resolvedTheme || "dark"} onChange={(e) => setTheme(e.target.value)}>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="system">System</option>
                    </select>
                  </Field>
                  <Field label="Accent Color">
                    <select className={inputClass()} defaultValue="neutral">
                      <option value="neutral">Monochrome</option>
                      <option value="indigo">Indigo</option>
                      <option value="cyan">Cyan</option>
                      <option value="green">Green</option>
                    </select>
                  </Field>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                    <div>
                      <p className="font-body-md text-body-md text-on-surface">Compact tables</p>
                      <p className="font-body-sm text-body-sm text-outline-variant">Show more fleet rows on smaller screens.</p>
                    </div>
                    <Toggle checked={compactMode} onChange={() => setCompactMode((v) => !v)} />
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                    <div>
                      <p className="font-body-md text-body-md text-on-surface">Reduce motion</p>
                      <p className="font-body-sm text-body-sm text-outline-variant">Limit animated counters, pulses, and transitions.</p>
                    </div>
                    <Toggle checked={reduceMotion} onChange={() => setReduceMotion((v) => !v)} />
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-outline-variant bg-surface-container p-5">
                <h2 className="font-headline-sm text-headline-sm text-primary">Preview</h2>
                <div className="mt-5 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Fleet Card</span>
                    <span className="material-symbols-outlined text-status-green icon-fill">local_shipping</span>
                  </div>
                  <p className="mt-4 font-headline-lg text-headline-lg text-primary">42</p>
                  <p className="font-body-sm text-body-sm text-outline-variant">Available vehicles</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="grid grid-cols-1 gap-container-gap xl:grid-cols-2">
              {[
                ["Email alerts", "Send operational alerts to assigned role owners.", emailAlerts, () => setEmailAlerts((v) => !v)],
                ["License expiry alerts", "Notify Safety Officers before driver licenses expire.", licenseAlerts, () => setLicenseAlerts((v) => !v)],
                ["Fuel approvals", "Notify Finance when fuel or expense logs need action.", fuelApprovalAlerts, () => setFuelApprovalAlerts((v) => !v)],
                ["Weekly digest", "Send a weekly fleet health and cost summary.", weeklyDigest, () => setWeeklyDigest((v) => !v)],
              ].map(([title, body, checked, toggle]) => (
                <div key={String(title)} className="flex items-center justify-between gap-4 rounded-lg border border-outline-variant bg-surface-container p-5">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary">{title as string}</h2>
                    <p className="mt-1 font-body-sm text-body-sm text-outline-variant">{body as string}</p>
                  </div>
                  <Toggle checked={Boolean(checked)} onChange={toggle as () => void} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "security" && (
            <div className="grid grid-cols-1 gap-container-gap xl:grid-cols-2">
              <div className="rounded-lg border border-outline-variant bg-surface-container p-5">
                <h2 className="font-headline-sm text-headline-sm text-primary">Access Policy</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Session Timeout">
                    <select className={inputClass()} value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)}>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="480">8 hours</option>
                    </select>
                  </Field>
                  <Field label="Audit Retention">
                    <select className={inputClass()} value={auditRetention} onChange={(e) => setAuditRetention(e.target.value)}>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </Field>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                  <div>
                    <p className="font-body-md text-body-md text-on-surface">Require MFA for managers</p>
                    <p className="font-body-sm text-body-sm text-outline-variant">Adds an extra challenge for privileged roles.</p>
                  </div>
                  <Toggle checked={mfaRequired} onChange={() => setMfaRequired((v) => !v)} />
                </div>
              </div>

              <div className="rounded-lg border border-outline-variant bg-surface-container p-5">
                <h2 className="font-headline-sm text-headline-sm text-primary">Data & Integrations</h2>
                <div className="mt-5 flex flex-col gap-3">
                  {["CSV export enabled", "API access tokens", "Failed login lockout", "Receipt upload scanning"].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low p-3">
                      <span className="font-body-md text-body-md text-on-surface">{item}</span>
                      <span className="rounded-full bg-status-green/10 px-2 py-1 text-xs font-medium text-status-green">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "rbac" && (
            <div className="rounded-lg border border-outline-variant bg-surface-container">
              <div className="flex flex-col gap-3 border-b border-outline-variant p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">Permission Matrix</h2>
                  <p className="mt-1 font-body-sm text-body-sm text-outline-variant">
                    {changedPermissions} permission override{changedPermissions === 1 ? "" : "s"} pending.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMatrix(defaultMatrix)}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-outline-variant px-4 text-sm text-outline transition-colors hover:bg-surface-container-high hover:text-primary"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-low">
                      <th className="p-4 font-label-sm text-label-sm uppercase tracking-wider text-outline">Module</th>
                      {roles.map((role) => (
                        <th key={role} className="p-4 font-label-sm text-label-sm uppercase tracking-wider text-outline">
                          {role}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => (
                      <tr key={module} className="border-b border-outline-variant last:border-b-0">
                        <td className="p-4 font-body-md text-body-md text-primary">{module}</td>
                        {roles.map((role) => (
                          <td key={role} className="p-4">
                            <select
                              className={inputClass()}
                              value={matrix[module][role]}
                              onChange={(e) => setPermission(module, role, e.target.value as Permission)}
                            >
                              <option>Full Access</option>
                              <option>View Only</option>
                              <option>No Access</option>
                            </select>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
