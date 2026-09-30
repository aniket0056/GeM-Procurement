import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Shield,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { RoleType } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUserRole } = useProcurement();

  const [email, setEmail] = useState('rajesh.kumar@mopng.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<RoleType>(currentUser.role || 'Procurement Officer');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentUserRole(selectedRole);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Ministry Header */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 border border-blue-500/30 flex items-center justify-center text-white shadow-md shadow-blue-900/40">
            <ShieldCheck className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white uppercase">
              GeM Compliance AI
            </h1>
            <p className="text-[10px] text-slate-400">
              Ministry of Petroleum & Natural Gas • Government of India
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="hidden sm:inline">Secure Gateway Online</span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl space-y-6">
          {/* Heading */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/40 border border-blue-700/50 text-blue-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Intelligent Procurement Compliance Verification
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              AI-assisted tender and vendor bid validation for transparent and efficient procurement.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Government Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="officer@mopng.gov.in"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Operational Role (RBAC)</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as RoleType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Procurement Officer">Procurement Officer (Senior Specialist)</option>
                <option value="Technical Evaluator">Technical Evaluator (Engineering Committee)</option>
                <option value="Financial Evaluator">Financial Evaluator (Finance Member)</option>
                <option value="Audit Officer">Audit Officer (Independent Oversight)</option>
                <option value="Administrator">Administrator (System Governance)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1 text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Remember credentials</span>
              </label>
              <span className="text-blue-400 font-semibold cursor-pointer hover:underline">
                2FA SAML Active
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Authenticating with e-Gov SSO...</span>
              ) : (
                <>
                  <span>Authenticate & Enter Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Badges */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 font-medium">
            <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
              <Shield className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
              <span>MeitY Tier-4</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
              <Lock className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <span>AES-256-GCM</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mx-auto mb-1" />
              <span>WORM Audit</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-slate-800/60 text-center text-[11px] text-slate-400 bg-slate-950/80 z-10">
        GeM Compliance AI • Ministry of Petroleum & Natural Gas • Decision Support Platform for Government Procurement
      </footer>
    </div>
  );
};
