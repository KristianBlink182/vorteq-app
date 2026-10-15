import React, { useState } from 'react';
import { 
  X, 
  Rocket, 
  Github, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Apple, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'web' | 'github'>('ios');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const gitCommands = `git init
git add .
git commit -m "feat: complete b2b trading platform with ios capacitor and codemagic pipeline"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main`;

  const capSyncCommand = `npm run cap:sync
npm run cap:open`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00B074]/30 to-blue-500/20 border border-[#00B074]/40 flex items-center justify-center text-[#00B074]">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">Subir a TestFlight & Producción</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00B074]/20 text-[#00B074] border border-[#00B074]/30">
                  Capacitor + Codemagic
                </span>
              </div>
              <p className="text-xs text-slate-400">Guía paso a paso para compilar tu app en iOS y la web</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 bg-slate-950/80 p-1.5 border-b border-slate-800 text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ios' 
                ? 'bg-[#00B074] text-white shadow font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>1. TestFlight (iOS)</span>
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'web' 
                ? 'bg-[#00B074] text-white shadow font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>2. Web Producción</span>
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'github' 
                ? 'bg-[#00B074] text-white shadow font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>3. Git / GitHub</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* TAB 1: TESTFLIGHT VIA CODEMAGIC */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200">
                  <span className="font-bold text-white">¡Estructura iOS y Codemagic ya configuradas!</span>
                  <p className="mt-0.5">El proyecto ya incluye el proyecto nativo Xcode en <code className="bg-emerald-900/60 px-1 py-0.5 rounded text-emerald-300">ios/App</code> y el archivo <code className="bg-emerald-900/60 px-1 py-0.5 rounded text-emerald-300">codemagic.yaml</code> optimizado.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2 font-bold text-white mb-1">
                    <span className="w-6 h-6 rounded-full bg-[#00B074]/20 text-[#00B074] flex items-center justify-center text-xs">A</span>
                    <span>1. Crear la App en App Store Connect</span>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc pl-5 mt-2">
                    <li>Entra a <span className="text-white font-mono">appstoreconnect.apple.com</span> &gt; <b>Mis Apps</b>.</li>
                    <li>Pulsa el botón <b>(+) Nueva app</b>.</li>
                    <li>Bundle ID: Selecciona o registra <span className="text-emerald-400 font-mono font-bold">com.vorteq.trade</span>.</li>
                    <li>Nombre: <span className="text-white">Vorteq B2B</span>.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2 font-bold text-white mb-1">
                    <span className="w-6 h-6 rounded-full bg-[#00B074]/20 text-[#00B074] flex items-center justify-center text-xs">B</span>
                    <span>2. Generar clave App Store Connect API</span>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc pl-5 mt-2">
                    <li>En App Store Connect, ve a <b>Usuarios y acceso</b> &gt; pestaña <b>Integraciones</b>.</li>
                    <li>Genera una clave con rol <b>Desarrollador</b> o <b>Admin</b>.</li>
                    <li>Copia el <b>Issuer ID</b>, <b>Key ID</b> y descarga el archivo <span className="text-amber-300 font-mono">AuthKey_XXXX.p8</span>.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2 font-bold text-white mb-1">
                    <span className="w-6 h-6 rounded-full bg-[#00B074]/20 text-[#00B074] flex items-center justify-center text-xs">C</span>
                    <span>3. Conectar en Codemagic y Lanzar Build</span>
                  </div>
                  <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-5 mt-2">
                    <li>Inicia sesión en <a href="https://codemagic.io" target="_blank" rel="noreferrer" className="text-emerald-400 underline">codemagic.io</a> con tu cuenta de GitHub.</li>
                    <li>En <b>Teams &gt; Integrations &gt; Apple Developer Portal</b>, añade tu clave p8 con su Key ID e Issuer ID.</li>
                    <li>Haz clic en <b>Add application</b> y selecciona tu repositorio de GitHub.</li>
                    <li>Codemagic detectará automáticamente el archivo <span className="text-emerald-400 font-mono font-bold">codemagic.yaml</span>.</li>
                    <li>Pulsa <b>Start new build</b> en la rama <span className="font-mono text-white">main</span>.</li>
                  </ol>
                  <div className="mt-3 p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-200">
                    Codemagic compilará el código, generará el archivo <span className="font-mono">.ipa</span> firmado y lo enviará automáticamente a TestFlight. En pocos minutos recibirás el email de Apple para probarlo en tu iPhone.
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      Probar en tu Mac localmente (Opcional):
                    </span>
                    <button
                      onClick={() => handleCopy(capSyncCommand, 'capsync')}
                      className="text-xs flex items-center gap-1 text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded"
                    >
                      {copiedCode === 'capsync' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === 'capsync' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 bg-black/60 rounded-lg text-emerald-400 text-xs font-mono overflow-x-auto">
                    {capSyncCommand}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEB PRODUCTION */}
          {activeTab === 'web' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl flex items-start gap-3">
                <Globe className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-200">
                  <span className="font-bold text-white">Despliegue Web en 1 Clic con HTTPS</span>
                  <p className="mt-0.5">Puedes tener tu versión web en vivo con dominio gratuito en Vercel, Netlify o Cloudflare Pages conectando tu GitHub.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00B074]" />
                      <span>Vercel (Recomendado)</span>
                    </div>
                    <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4">
                      <li>Entra a <span className="text-white">vercel.com</span> con tu GitHub.</li>
                      <li>Haz clic en <b>Add New... &gt; Project</b>.</li>
                      <li>Selecciona tu repositorio.</li>
                      <li>Vercel reconoce Vite automáticamente.</li>
                      <li>Haz clic en <b>Deploy</b>.</li>
                    </ol>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
                    Tiempo de despliegue: ~30 segundos.
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      <span>Netlify</span>
                    </div>
                    <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4">
                      <li>Entra a <span className="text-white">netlify.com</span>.</li>
                      <li>Selecciona <b>Import from Git</b> &gt; GitHub.</li>
                      <li>Build Command: <span className="font-mono text-white">npm run build</span></li>
                      <li>Publish Directory: <span className="font-mono text-white">dist</span></li>
                      <li>Haz clic en <b>Deploy site</b>.</li>
                    </ol>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
                    Soporte para dominios personalizados .com gratis.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-white">Configuración del Build Web:</span>
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500">Build Command:</span>
                    <div className="text-emerald-400 font-bold">npm run build</div>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500">Output Directory:</span>
                    <div className="text-emerald-400 font-bold">dist</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB SETUP */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Comandos para subir a GitHub</h4>
                  <p className="text-xs text-slate-400">Ejecuta estos comandos en la terminal de tu máquina:</p>
                </div>
                <button
                  onClick={() => handleCopy(gitCommands, 'git')}
                  className="text-xs flex items-center gap-1.5 bg-[#00B074] hover:bg-[#009e67] text-white px-3 py-1.5 rounded-lg font-bold transition-all"
                >
                  {copiedCode === 'git' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'git' ? '¡Copiado!' : 'Copiar Comandos'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed">
                  {gitCommands}
                </pre>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300">
                <b>Nota:</b> Reemplaza <code className="bg-amber-900/50 px-1 py-0.5 rounded text-amber-200">TU_USUARIO/TU_REPOSITORIO.git</code> con la URL real de tu repositorio en GitHub.
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00B074]" />
            <span>Archivo <span className="text-slate-300 font-mono">DEPLOYMENT_GUIDE.md</span> incluido en el repo</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
