import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, ExternalLink, Copy, Check } from 'lucide-react';
import { DomainStatus, Theme } from '../types';

interface ServerFeedbackViewProps {
  theme: Theme;
}

export const ServerFeedbackView: React.FC<ServerFeedbackViewProps> = ({ theme }) => {
  const [domains, setDomains] = useState<DomainStatus[]>([]);
  const [verifierUrl, setVerifierUrl] = useState('https://streamveri.xyz/');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const fetchDomains = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sports/domains');
      if (res.ok) {
        const json = await res.json();
        if (json.domains) {
          setDomains(json.domains);
          if (json.verifierUrl) setVerifierUrl(json.verifierUrl);
        }
      }
    } catch (e) {
      console.error('Error fetching domains:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Overview Card */}
      <div
        className={`p-5 sm:p-6 rounded-lg border space-y-3 transition-colors ${
          isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded flex items-center justify-center font-bold text-xs border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-black'
              }`}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight">
                Estado de Servidores & Dominios Oficiales
              </h1>
              <p className="text-xs text-zinc-500">
                Verificador oficial sincronizado con <span className="font-mono">streamveri.xyz</span>
              </p>
            </div>
          </div>

          <button
            onClick={fetchDomains}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-colors disabled:opacity-50 ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Verificar Estado</span>
          </button>
        </div>

        <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Si el dominio principal experimenta caídas o bloqueos, el sistema redirige automáticamente
          las solicitudes a los servidores espejo disponibles para mantener la transmisión continua.
        </p>
      </div>

      {/* Domains Status List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {domains.map((dom) => {
          const isOnline = dom.status === 'online';

          return (
            <div
              key={dom.url}
              className={`p-4 rounded-lg border flex flex-col justify-between space-y-3 transition-colors ${
                isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                      dom.isPrimary
                        ? isDark
                          ? 'bg-zinc-800 text-white border-zinc-700'
                          : 'bg-zinc-200 text-black border-zinc-300'
                        : isDark
                        ? 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    {dom.isPrimary ? 'PRINCIPAL' : 'ESPEJO'}
                  </span>

                  <span
                    className={`font-mono text-[11px] font-bold ${
                      isOnline ? (isDark ? 'text-zinc-200' : 'text-zinc-800') : 'text-zinc-500'
                    }`}
                  >
                    {isOnline ? 'OPERATIVO' : 'NO DISPONIBLE'}
                  </span>
                </div>

                <div className="font-bold text-sm font-mono truncate">{dom.label}</div>

                <div className="text-[11px] font-mono text-zinc-500">
                  Respuesta: {dom.pingMs ? `${dom.pingMs} ms` : 'calculando...'}
                </div>
              </div>

              <div className="pt-2 border-t border-inherit flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(dom.url)}
                  className={`flex-1 py-1 px-2 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-black'
                  }`}
                >
                  {copiedUrl === dom.url ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                <a
                  href={dom.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-1.5 rounded border text-xs transition-colors ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-black'
                  }`}
                  title="Abrir dominio en nueva pestaña"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div
        className={`p-4 rounded-lg border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
        }`}
      >
        <div>
          <span className="font-bold block text-inherit">Verificador central en vivo:</span>
          <span>Puedes consultar la lista permanente en <strong className="font-mono">{verifierUrl}</strong></span>
        </div>

        <a
          href={verifierUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-semibold shrink-0 transition-colors ${
            isDark
              ? 'bg-white text-black border-white hover:bg-zinc-200'
              : 'bg-black text-white border-black hover:bg-zinc-800'
          }`}
        >
          <span>Abrir StreamVeri</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
