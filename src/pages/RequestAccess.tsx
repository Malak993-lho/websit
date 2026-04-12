import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Shield, Heart, Users, Plus, Trash2, Sparkles, ChevronDown, Check, Loader2 } from "lucide-react";
import tamtamLogo from "@/assets/tamtam-logo.jpeg";
import { getApiBaseUrl } from "@/lib/apiConfig";
import { ACCESS_REQUEST_ENDPOINT, createAccessRequest } from "@/services/accessRequests";

interface Child {
  name: string;
  age: string;
}

const emptyRoleExtras = {
  children_count: "",
  organization_name: "",
  position: "",
  children_supported_count: "",
  hospital_name: "",
  patients_count: "",
  custom_role_details: "",
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  location: string;
  role: string;
  message: string;
} & typeof emptyRoleExtras;

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  countryCode: "+1",
  location: "",
  role: "",
  message: "",
  ...emptyRoleExtras,
};

const FloatingShape = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full pointer-events-none ${className}`} />
);

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
  narrow,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  narrow?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${narrow ? "w-[108px] flex-shrink-0" : "w-full"}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-3.5 rounded-xl border border-[hsl(38,30%,82%)] bg-[hsl(40,50%,97%)] text-foreground text-sm min-h-[52px] text-left flex items-center justify-between transition-all duration-300 focus:outline-none focus:border-[hsl(32,80%,62%)] focus:shadow-[0_0_0_3px_hsl(32,80%,62%,0.15)]"
      >
        <span className={selected ? "text-foreground truncate" : "text-muted-foreground/50 truncate"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[140px] bg-card rounded-xl border border-[hsl(38,30%,85%)] shadow-lg py-1 max-h-[220px] overflow-y-auto animate-slide-down">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                value === opt.value
                  ? "bg-[hsl(32,80%,62%,0.1)] text-foreground font-semibold"
                  : "text-foreground/80 hover:bg-muted/40"
              }`}
            >
              {opt.label}
              {value === opt.value && <Check size={14} className="text-[hsl(32,80%,62%)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function parseNonNegativeInt(raw: string): number | null {
  const t = raw.trim();
  if (t === "") return null;
  const n = Number(t);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) return null;
  return n;
}

function parsePositiveInt(raw: string): number | null {
  const n = parseNonNegativeInt(raw);
  if (n === null || n < 1) return null;
  return n;
}

type DynamicValidation =
  | { ok: true; extras: Record<string, string | number> }
  | { ok: false; error: string };

function validateDynamicFields(form: FormState): DynamicValidation {
  const r = form.role.trim();
  if (!r) {
    return { ok: false, error: "Please select your role." };
  }

  if (r === "parent") {
    const n = parsePositiveInt(form.children_count);
    if (n === null) {
      return {
        ok: false,
        error: "Please add at least one child with a name.",
      };
    }
    return { ok: true, extras: { children_count: n } };
  }

  if (r === "ngo") {
    if (!form.organization_name.trim()) {
      return { ok: false, error: "Organization name is required." };
    }
    if (!form.position.trim()) {
      return { ok: false, error: "Your position or title is required." };
    }
    const n = parseNonNegativeInt(form.children_supported_count);
    if (n === null) {
      return {
        ok: false,
        error: "Please enter how many children your organization supports (whole number, 0 or more).",
      };
    }
    return {
      ok: true,
      extras: {
        organization_name: form.organization_name.trim(),
        position: form.position.trim(),
        children_supported_count: n,
      },
    };
  }

  if (r === "hospital") {
    if (!form.hospital_name.trim()) {
      return { ok: false, error: "Hospital or facility name is required." };
    }
    if (!form.position.trim()) {
      return { ok: false, error: "Your position or title is required." };
    }
    const n = parseNonNegativeInt(form.patients_count);
    if (n === null) {
      return {
        ok: false,
        error: "Please enter an approximate patient count (whole number, 0 or more).",
      };
    }
    return {
      ok: true,
      extras: {
        hospital_name: form.hospital_name.trim(),
        position: form.position.trim(),
        patients_count: n,
      },
    };
  }

  if (r === "psychologist") {
    if (!form.organization_name.trim()) {
      return { ok: false, error: "Practice or organization name is required." };
    }
    const n = parseNonNegativeInt(form.patients_count);
    if (n === null) {
      return {
        ok: false,
        error: "Please enter an approximate patient count (whole number, 0 or more).",
      };
    }
    return {
      ok: true,
      extras: {
        organization_name: form.organization_name.trim(),
        patients_count: n,
      },
    };
  }

  if (r === "donor") {
    const extras: Record<string, string | number> = {};
    const org = form.organization_name.trim();
    if (org) {
      extras.organization_name = org;
    }
    return { ok: true, extras };
  }

  if (r === "other") {
    if (!form.custom_role_details.trim()) {
      return { ok: false, error: "Please describe your role or how you relate to TamTam." };
    }
    return {
      ok: true,
      extras: { custom_role_details: form.custom_role_details.trim() },
    };
  }

  return { ok: false, error: "Please select a valid role." };
}

function composeReasonForPayload(form: FormState, extras: Record<string, string | number>): string {
  const lines: string[] = [];
  lines.push(`requested_role: ${form.role.trim()}`);
  lines.push(`phone: ${`${form.countryCode} ${form.phone}`.trim()}`);
  lines.push(`location: ${form.location.trim() || "(not provided)"}`);
  for (const [key, value] of Object.entries(extras)) {
    lines.push(`${key}: ${value}`);
  }
  const msg = form.message.trim();
  lines.push(`reason: ${msg || "(not provided)"}`);
  return lines.join("\n");
}

const RequestAccess = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [children, setChildren] = useState<Child[]>([{ name: "", age: "" }]);

  const setRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      role,
      ...emptyRoleExtras,
    }));
    if (role !== "parent") {
      setChildren([{ name: "", age: "" }]);
    }
  };

  const addChild = () => setChildren([...children, { name: "", age: "" }]);
  const removeChild = (i: number) => {
    if (children.length > 1) setChildren(children.filter((_, idx) => idx !== i));
  };
  const updateChild = (i: number, f: keyof Child, v: string) => {
    const u = [...children];
    u[i] = { ...u[i], [f]: v };
    setChildren(u);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.info("[RequestAccess] Submit triggered");
    if (isBusy || isSending || submitted) return;

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedRole = form.role.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedLocation = form.location.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail || !trimmedRole || !trimmedPhone || !trimmedLocation) {
      setSubmitError("Please complete all required fields before submitting.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    const filledChildren = children.filter((c) => c.name.trim());
    const formForValidate: FormState =
      trimmedRole === "parent"
        ? {
            ...form,
            children_count: String(Math.max(filledChildren.length, 0)),
          }
        : form;

    const dynamic = validateDynamicFields(formForValidate);
    if (dynamic.ok === false) {
      setSubmitError(dynamic.error);
      return;
    }

    let extras: Record<string, string | number> = { ...dynamic.extras };
    if (trimmedRole === "parent") {
      filledChildren.forEach((c, i) => {
        extras[`child_${i + 1}`] = `${c.name.trim()} (age ${c.age || "?"})`;
      });
    }

    const composedReason = composeReasonForPayload(form, extras);

    setIsBusy(true);
    setIsSending(true);
    setSubmitError("");

    window.setTimeout(() => {
      setSubmitted(true);
      setIsBusy(false);
      setIsSending(false);

      void createAccessRequest({
        name: form.name,
        email: form.email,
        role: form.role,
        message: composedReason,
      })
        .then((result) => {
          console.info("[RequestAccess] Submit success (background)", {
            baseUrl: getApiBaseUrl(),
            endpoint: ACCESS_REQUEST_ENDPOINT,
            url: result.url,
            payload: result.payload,
            status: result.status,
            responseBody: result.responseBody,
          });
        })
        .catch((error) => {
          console.error("[RequestAccess] Submit error (background, user already on success UI)", {
            endpoint: ACCESS_REQUEST_ENDPOINT,
            error,
          });
        });
    }, 120);
  };

  const inputCls =
    "w-full px-4 py-3.5 rounded-xl border border-[hsl(38,30%,82%)] bg-[hsl(40,50%,97%)] text-foreground placeholder:text-muted-foreground/50 text-base min-h-[52px] transition-all duration-300 focus:outline-none focus:border-[hsl(32,80%,62%)] focus:shadow-[0_0_0_3px_hsl(32,80%,62%,0.15)] disabled:opacity-60";

  const countryCodes = [
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+44", label: "🇬🇧 +44" },
    { value: "+33", label: "🇫🇷 +33" },
    { value: "+49", label: "🇩🇪 +49" },
    { value: "+971", label: "🇦🇪 +971" },
    { value: "+966", label: "🇸🇦 +966" },
    { value: "+91", label: "🇮🇳 +91" },
    { value: "+86", label: "🇨🇳 +86" },
    { value: "+81", label: "🇯🇵 +81" },
    { value: "+61", label: "🇦🇺 +61" },
    { value: "+55", label: "🇧🇷 +55" },
    { value: "+234", label: "🇳🇬 +234" },
    { value: "+254", label: "🇰🇪 +254" },
    { value: "+27", label: "🇿🇦 +27" },
    { value: "+20", label: "🇪🇬 +20" },
    { value: "+212", label: "🇲🇦 +212" },
    { value: "+962", label: "🇯🇴 +962" },
    { value: "+961", label: "🇱🇧 +961" },
  ];

  const roleOptions = [
    { value: "parent", label: "Parent / Guardian" },
    { value: "ngo", label: "NGO Representative" },
    { value: "hospital", label: "Hospital / Healthcare" },
    { value: "psychologist", label: "Psychologist / Therapist" },
    { value: "donor", label: "Donor / Supporter" },
    { value: "other", label: "Other" },
  ];

  const role = form.role;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(168deg, hsl(42,60%,96%) 0%, hsl(36,45%,92%) 50%, hsl(30,35%,89%) 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingShape className="w-72 h-72 opacity-[0.08] bg-[hsl(32,80%,62%)] -top-24 -right-24 animate-float blur-3xl" />
        <FloatingShape className="w-56 h-56 opacity-[0.06] bg-soft-blue top-1/3 -left-20 animate-float-slow blur-3xl" />
        <FloatingShape className="w-60 h-60 opacity-[0.07] bg-soft-pink bottom-16 right-8 animate-float blur-3xl" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[hsl(32,80%,62%)] rounded-full animate-twinkle opacity-30"
            style={{ top: `${15 + Math.random() * 70}%`, left: `${10 + Math.random() * 80}%`, animationDelay: `${i * 0.6}s` }}
          />
        ))}
      </div>

      <div className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: "hsla(42,60%,96%,0.8)", borderColor: "hsl(38,30%,88%)" }}>
        <div className="container mx-auto px-5 py-3 flex items-center gap-3">
          <button
            type="button"
            aria-label="Back to home"
            onClick={() => navigate("/")}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted/40 transition-colors"
          >
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <img src={tamtamLogo} alt="TamTam" className="h-9 w-9 rounded-lg object-contain" />
          <span className="font-heading font-extrabold text-lg text-primary">TamTam</span>
        </div>
      </div>

      <div className="container mx-auto px-5 py-8 md:py-14 max-w-xl relative z-10">
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[hsl(32,80%,62%,0.12)] text-[hsl(32,60%,40%)] px-4 py-2 rounded-full text-xs font-bold tracking-wide">
            <Sparkles size={14} /> Invitation Only
          </div>
          <h1 className="text-3xl md:text-[44px] font-extrabold text-foreground leading-tight">
            Join the TamTam
            <br />
            Family 💛
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            We keep TamTam invitation-only to ensure every child is safe and supported.
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {[
            { icon: Shield, label: "Safe", bg: "hsl(210,80%,94%)", color: "hsl(210,70%,45%)" },
            { icon: Heart, label: "Loved", bg: "hsl(340,70%,94%)", color: "hsl(340,60%,50%)" },
            { icon: Users, label: "Trusted", bg: "hsl(150,55%,92%)", color: "hsl(150,50%,38%)" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{ background: b.bg, color: b.color }}
            >
              <b.icon size={13} /> {b.label}
            </div>
          ))}
        </div>

        {submitted ? (
          <div
            className="text-center py-14 backdrop-blur-md rounded-3xl shadow-lg space-y-4"
            style={{ background: "hsla(0,0%,100%,0.8)", border: "1px solid hsl(38,30%,85%)" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "linear-gradient(135deg, hsl(42,90%,88%), hsl(32,80%,78%))" }}
            >
              <span className="text-4xl">💛</span>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">Request Received!</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
              We&apos;ll review your request and send you an invitation link if approved. Usually 1–2 business days.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 text-primary-foreground px-8 py-3 rounded-full font-bold text-sm min-h-[48px] shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, hsl(32,75%,55%), hsl(28,80%,50%))" }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6"
            style={{
              background: "hsla(0,0%,100%,0.8)",
              border: "1px solid hsl(38,30%,85%)",
              boxShadow: "0 8px 40px -12px hsla(32,40%,40%,0.1), 0 2px 8px -2px hsla(32,40%,40%,0.06)",
              borderRadius: "24px",
            }}
          >
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold" style={{ color: "hsl(220,30%,18%)" }}>
                About You
              </h2>
              <p className="text-xs text-muted-foreground">Tell us who you are so we can welcome you properly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                  Full Name <span className="text-[hsl(32,80%,62%)]">*</span>
                </label>
                <input
                  required
                  disabled={isBusy}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                  Email <span className="text-[hsl(32,80%,62%)]">*</span>
                </label>
                <input
                  required
                  type="email"
                  disabled={isBusy}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                Phone Number <span className="text-[hsl(32,80%,62%)]">*</span>
              </label>
              <div className="flex gap-2">
                <CustomSelect
                  narrow
                  value={form.countryCode}
                  onChange={(v) => setForm({ ...form, countryCode: v })}
                  options={countryCodes}
                  placeholder="+1"
                />
                <input
                  required
                  type="tel"
                  disabled={isBusy}
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`${inputCls} flex-1 min-w-0`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                  Location <span className="text-[hsl(32,80%,62%)]">*</span>
                </label>
                <input
                  required
                  disabled={isBusy}
                  placeholder="City, Country"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                  I am a… <span className="text-[hsl(32,80%,62%)]">*</span>
                </label>
                <CustomSelect
                  value={form.role}
                  onChange={(v) => setRole(v)}
                  options={roleOptions}
                  placeholder="Select your role"
                />
              </div>
            </div>

            {role === "ngo" && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                    Organization name <span className="text-[hsl(32,80%,62%)]">*</span>
                  </label>
                  <input
                    required
                    disabled={isBusy}
                    placeholder="Your NGO or organization"
                    value={form.organization_name}
                    onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                    Your position <span className="text-[hsl(32,80%,62%)]">*</span>
                  </label>
                  <input
                    required
                    disabled={isBusy}
                    placeholder="e.g. Program Director"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                    Children supported (approx.) <span className="text-[hsl(32,80%,62%)]">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    disabled={isBusy}
                    placeholder="e.g. 150"
                    value={form.children_supported_count}
                    onChange={(e) => setForm({ ...form, children_supported_count: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </>
            )}

            {role === "hospital" && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                    Hospital / facility name <span className="text-[hsl(32,80%,62%)]">*</span>
                  </label>
                  <input
                    required
                    disabled={isBusy}
                    placeholder="Name of hospital or clinic"
                    value={form.hospital_name}
                    onChange={(e) => setForm({ ...form, hospital_name: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                    Your position <span className="text-[hsl(32,80%,62%)]">*</span>
                  </label>
                  <input
                    required
                    disabled={isBusy}
                    placeholder="e.g. Child Life Specialist"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                    Approximate patient count <span className="text-[hsl(32,80%,62%)]">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    disabled={isBusy}
                    placeholder="e.g. 500"
                    value={form.patients_count}
                    onChange={(e) => setForm({ ...form, patients_count: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </>
            )}

            {role === "psychologist" && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                    Practice or organization name <span className="text-[hsl(32,80%,62%)]">*</span>
                  </label>
                  <input
                    required
                    disabled={isBusy}
                    placeholder="Private practice or employer"
                    value={form.organization_name}
                    onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                    Patients / clients (approx.) <span className="text-[hsl(32,80%,62%)]">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    disabled={isBusy}
                    placeholder="e.g. 30"
                    value={form.patients_count}
                    onChange={(e) => setForm({ ...form, patients_count: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </>
            )}

            {role === "donor" && (
              <div>
                <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                  Organization <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <input
                  disabled={isBusy}
                  placeholder="Company or foundation, if any"
                  value={form.organization_name}
                  onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                  className={inputCls}
                />
              </div>
            )}

            {role === "other" && (
              <div>
                <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                  Describe your role <span className="text-[hsl(32,80%,62%)]">*</span>
                </label>
                <textarea
                  required
                  disabled={isBusy}
                  placeholder="Tell us who you are and why you are requesting access"
                  value={form.custom_role_details}
                  onChange={(e) => setForm({ ...form, custom_role_details: e.target.value })}
                  rows={3}
                  className={`${inputCls} resize-none min-h-[90px]`}
                />
              </div>
            )}

            {role === "parent" && (
              <>
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px" style={{ background: "hsl(38,30%,85%)" }} />
                  <span className="text-[11px] font-bold tracking-wider" style={{ color: "hsl(32,60%,45%)" }}>
                    Your Children
                  </span>
                  <div className="flex-1 h-px" style={{ background: "hsl(38,30%,85%)" }} />
                </div>

                <div
                  className="rounded-2xl p-4 space-y-3"
                  style={{
                    background: "linear-gradient(135deg, hsl(42,55%,95%), hsl(36,45%,93%))",
                    border: "1px solid hsl(38,35%,88%)",
                  }}
                >
                  {children.map((child, i) => (
                    <div key={i} className="flex gap-2 items-center rounded-xl p-2" style={{ background: "hsla(0,0%,100%,0.7)" }}>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-primary-foreground flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, hsl(32,80%,65%), hsl(28,75%,55%))" }}
                      >
                        {i + 1}
                      </div>
                      <input
                        disabled={isBusy}
                        placeholder="Child's name"
                        value={child.name}
                        onChange={(e) => updateChild(i, "name", e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-lg border border-[hsl(38,30%,85%)] bg-[hsl(40,50%,98%)] text-foreground placeholder:text-muted-foreground/40 text-sm min-h-[42px] transition-all duration-300 focus:outline-none focus:border-[hsl(32,80%,62%)] focus:shadow-[0_0_0_3px_hsl(32,80%,62%,0.12)]"
                      />
                      <input
                        type="number"
                        min={0}
                        max={18}
                        disabled={isBusy}
                        placeholder="Age"
                        value={child.age}
                        onChange={(e) => updateChild(i, "age", e.target.value)}
                        className="w-[65px] px-2 py-2.5 rounded-lg border border-[hsl(38,30%,85%)] bg-[hsl(40,50%,98%)] text-foreground placeholder:text-muted-foreground/40 text-sm min-h-[42px] text-center transition-all duration-300 focus:outline-none focus:border-[hsl(32,80%,62%)] focus:shadow-[0_0_0_3px_hsl(32,80%,62%,0.12)] flex-shrink-0"
                      />
                      {children.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Remove child ${i + 1}`}
                          disabled={isBusy}
                          onClick={() => removeChild(i)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={addChild}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold transition-all duration-200"
                    style={{ borderColor: "hsl(32,50%,75%)", color: "hsl(32,60%,45%)" }}
                  >
                    <Plus size={15} /> Add Another Child
                  </button>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold mb-2 tracking-wide" style={{ color: "hsl(30,15%,50%)" }}>
                Why do you want to join? <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                disabled={isBusy}
                placeholder="Tell us a bit about yourself…"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className={`${inputCls} resize-none min-h-[90px]`}
              />
            </div>

            {submitError && (
              <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isBusy || isSending}
              className="w-full text-primary-foreground py-4 rounded-2xl font-bold text-base active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 min-h-[52px] hover:shadow-xl disabled:opacity-60 disabled:pointer-events-none"
              style={{
                background: "linear-gradient(135deg, hsl(32,75%,55%), hsl(28,80%,48%))",
                boxShadow: "0 6px 24px -4px hsla(32,80%,45%,0.35)",
              }}
            >
              {isSending ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send size={18} /> Request Invitation
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed">
              By requesting access you agree to our community guidelines.
              <br />
              We review every request to keep TamTam safe.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestAccess;
