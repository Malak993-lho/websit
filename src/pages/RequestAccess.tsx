import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Shield, Heart, Users } from "lucide-react";
import tamtamLogo from "@/assets/tamtam-logo.jpeg";
import { getApiBaseUrl } from "@/lib/apiConfig";
import { ACCESS_REQUEST_ENDPOINT, createAccessRequest } from "@/services/accessRequests";

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
  role: string;
  message: string;
} & typeof emptyRoleExtras;

const initialForm: FormState = {
  name: "",
  email: "",
  role: "",
  message: "",
  ...emptyRoleExtras,
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
        error: "Please enter how many children you support (whole number, at least 1).",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<FormState>(initialForm);

  const setRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      role,
      ...emptyRoleExtras,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info("[RequestAccess] Submit triggered");
    if (isSubmitting) {
      return;
    }

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedRole = form.role.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail || !trimmedRole) {
      setSubmitError("Please complete all required fields before submitting.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    const dynamic = validateDynamicFields(form);
    if (!dynamic.ok) {
      setSubmitError(dynamic.error);
      return;
    }

    const composedReason = composeReasonForPayload(form, dynamic.extras);

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await createAccessRequest({
        name: form.name,
        email: form.email,
        role: form.role,
        message: composedReason,
      });
      console.info("[RequestAccess] Submit success", {
        baseUrl: getApiBaseUrl(),
        endpoint: ACCESS_REQUEST_ENDPOINT,
        payload: result.payload,
      });
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your request. Please try again.";
      console.error("[RequestAccess] Submit error", {
        baseUrl: getApiBaseUrl(),
        endpoint: ACCESS_REQUEST_ENDPOINT,
        error,
      });
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base min-h-[52px]";

  const role = form.role;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-5 py-3 flex items-center gap-3">
          <button
            aria-label="Back to home"
            onClick={() => navigate("/")}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <img src={tamtamLogo} alt="TamTam" className="h-10 w-10 rounded-lg object-contain" />
          <span className="font-heading font-extrabold text-xl text-primary">TamTam</span>
        </div>
      </div>

      <div className="container mx-auto px-5 py-10 md:py-16 max-w-2xl">
        {/* Hero text */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
            <Shield size={16} /> Invitation-Only Access
          </div>
          <h1 className="text-[32px] md:text-5xl font-extrabold text-foreground leading-tight">
            Join the TamTam Family 💛
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
            TamTam is available by invitation only to ensure a safe, trusted environment for every child.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { icon: Shield, label: "Safe & Secure" },
            { icon: Heart, label: "Built with Love" },
            { icon: Users, label: "Trusted Community" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2 bg-card rounded-full px-4 py-2 border border-border/50 text-sm font-medium text-muted-foreground">
              <b.icon size={16} className="text-primary" />
              {b.label}
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="text-center py-16 bg-card rounded-2xl shadow-sm border border-border/50 space-y-4">
            <div className="text-6xl">💛</div>
            <h2 className="text-2xl font-bold text-foreground">Request Received!</h2>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">
              We'll review your request and send you an invitation link if approved. This usually takes 1-2 business days.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-base min-h-[48px]"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-5 md:p-8 shadow-sm border border-border/50 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name *</label>
              <input
                required
                disabled={isSubmitting}
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email *</label>
              <input
                required
                type="email"
                disabled={isSubmitting}
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">I am a... *</label>
              <select
                required
                disabled={isSubmitting}
                aria-label="Your role"
                value={form.role}
                onChange={(e) => setRole(e.target.value)}
                className={inputClass}
              >
                <option value="">Select your role</option>
                <option value="parent">Parent / Guardian</option>
                <option value="ngo">NGO Representative</option>
                <option value="hospital">Hospital / Healthcare Provider</option>
                <option value="psychologist">Psychologist / Therapist</option>
                <option value="donor">Donor / Supporter</option>
                <option value="other">Other</option>
              </select>
            </div>

            {role === "parent" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Number of children *</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  required
                  disabled={isSubmitting}
                  placeholder="e.g. 2"
                  value={form.children_count}
                  onChange={(e) => setForm({ ...form, children_count: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}

            {role === "ngo" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Organization name *</label>
                  <input
                    required
                    disabled={isSubmitting}
                    placeholder="Your NGO or organization"
                    value={form.organization_name}
                    onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Your position *</label>
                  <input
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. Program Director"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Children supported (approx.) *</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. 150"
                    value={form.children_supported_count}
                    onChange={(e) => setForm({ ...form, children_supported_count: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </>
            )}

            {role === "hospital" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Hospital / facility name *</label>
                  <input
                    required
                    disabled={isSubmitting}
                    placeholder="Name of hospital or clinic"
                    value={form.hospital_name}
                    onChange={(e) => setForm({ ...form, hospital_name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Your position *</label>
                  <input
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. Child Life Specialist"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Approximate patient count *</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. 500"
                    value={form.patients_count}
                    onChange={(e) => setForm({ ...form, patients_count: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </>
            )}

            {role === "psychologist" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Practice or organization name *</label>
                  <input
                    required
                    disabled={isSubmitting}
                    placeholder="Private practice or employer"
                    value={form.organization_name}
                    onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Patients / clients (approx.) *</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. 30"
                    value={form.patients_count}
                    onChange={(e) => setForm({ ...form, patients_count: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </>
            )}

            {role === "donor" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Organization (optional)</label>
                <input
                  disabled={isSubmitting}
                  placeholder="Company or foundation, if any"
                  value={form.organization_name}
                  onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}

            {role === "other" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Describe your role *</label>
                <textarea
                  required
                  disabled={isSubmitting}
                  placeholder="Tell us who you are and why you are requesting access"
                  value={form.custom_role_details}
                  onChange={(e) => setForm({ ...form, custom_role_details: e.target.value })}
                  rows={3}
                  className={`${inputClass} resize-none min-h-[100px]`}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Why do you want to join? (optional)</label>
              <textarea
                disabled={isSubmitting}
                placeholder="Tell us a bit about yourself..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none min-h-[100px]`}
              />
            </div>
            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-base active:opacity-80 transition-opacity flex items-center justify-center gap-2 min-h-[52px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {isSubmitting ? "Submitting..." : "Request Invitation"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              By requesting access, you agree to our community guidelines. We review every request to keep TamTam safe.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestAccess;
