import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X, Volume2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VoiceSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterModalToggle: () => void;
  onShowOnlySavedToggle?: (val: boolean) => void;
  onCategorySelect?: (cat: string) => void;
  placeholder?: string;
}

// Speech recognition interface declarations
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    item(index: number): {
      length: number;
      item(index: number): {
        transcript: string;
        confidence: number;
      };
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
    [index: number]: {
      length: number;
      item(index: number): {
        transcript: string;
        confidence: number;
      };
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
  };
}

/**
 * Intelligent voice command parser for wholesale electronics trading.
 * Handles commands like:
 * - "Buscar iPhone 16"
 * - "Busca MacBook M3"
 * - "Quiero ver Samsung S24"
 * - "Filtrar por Miami"
 * - "Limpiar búsqueda" o "Borrar filtro"
 * - "Solo ofertas guardadas"
 */
export function parseVoiceCommand(rawTranscript: string): {
  action: 'search' | 'clear' | 'showSaved' | 'showAll';
  query: string;
  feedbackText: string;
  category?: string;
} {
  const trimmed = rawTranscript.trim();
  const lower = trimmed.toLowerCase();

  // Clear / Reset command
  if (
    lower.includes('limpiar') || 
    lower.includes('borrar') || 
    lower.includes('quitar filtro') || 
    lower.includes('restablecer') ||
    lower === 'todos'
  ) {
    return {
      action: 'clear',
      query: '',
      feedbackText: 'Búsqueda limpiada',
    };
  }

  // Saved offers command
  if (
    lower.includes('solo guardado') || 
    lower.includes('ofertas guardadas') || 
    lower.includes('mis guardados') ||
    lower.includes('ver guardados') ||
    lower.includes('favoritos')
  ) {
    return {
      action: 'showSaved',
      query: '',
      feedbackText: 'Mostrando solo lotes guardados',
    };
  }

  // Common speech prefixes to strip so we get the pure product/location query
  let cleaned = trimmed;
  const commandPrefixes = [
    /^(por favor\s+)?(quiero\s+)?(buscar|busca|búscame|buscame)\s+(por\s+)?/i,
    /^(por favor\s+)?(quiero\s+)?(filtrar|filtra|filtrar\s+por|filtra\s+por)\s+/i,
    /^(por favor\s+)?(quiero\s+)?(encontrar|encuentra|encuéntrame|encuentrame)\s+/i,
    /^(por favor\s+)?(quiero\s+)?(mostrar|muestra|muéstrame|muestrame)\s+(lotes\s+de\s+|ofertas\s+de\s+|el\s+|la\s+|los\s+|las\s+)?/i,
    /^(por favor\s+)?(quiero\s+)?(ver|ver\s+lotes\s+de|lotes\s+de|ofertas\s+de|lote\s+de|stock\s+de)\s+/i,
    /^(dame\s+lotes\s+de|enséñame|enseñame|localiza|localizar)\s+/i,
  ];

  for (const prefix of commandPrefixes) {
    cleaned = cleaned.replace(prefix, '');
  }

  // Remove trailing punctuation from speech engine
  cleaned = cleaned.replace(/[.,!?;]+$/, '').trim();

  // Detect category keywords for extra assistance
  let category: string | undefined;
  if (/iphone/i.test(cleaned)) category = 'iPhone';
  else if (/samsung/i.test(cleaned)) category = 'Samsung';
  else if (/macbook/i.test(cleaned)) category = 'MacBook';

  return {
    action: 'search',
    query: cleaned || trimmed,
    feedbackText: `Buscando: "${cleaned || trimmed}"`,
    category,
  };
}

export const VoiceSearchBar: React.FC<VoiceSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterModalToggle,
  onShowOnlySavedToggle,
  onCategorySelect,
  placeholder = 'Buscar modelo, spec o ciudad...',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play pleasant subtle audio cue when speech recognition starts/finishes
  const playSoundCue = (type: 'start' | 'success' | 'error') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'start') {
        // High pitch pleasant pip
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        // Double pleasant confirmation chime
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else {
        // Gentle low bump
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio cue is optional, ignore if blocked by browser policy
    }
  };

  // Check speech recognition support on mount
  useEffect(() => {
    const SpeechRecClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecClass) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecClass) {
      setIsSupported(false);
      setShowVoiceHelp(true);
      setFeedbackNotice({
        text: 'El reconocimiento por voz nativo no está disponible en este navegador. Usa los comandos rápidos.',
        type: 'info',
      });
      setTimeout(() => setFeedbackNotice(null), 4000);
      return;
    }

    try {
      // Abort previous instance if any
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecClass();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-ES'; // Spanish primary with Latin America compatibility
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('');
        playSoundCue('start');
        setFeedbackNotice({
          text: 'Escuchando... Di por ejemplo: "Buscar iPhone 16"',
          type: 'info',
        });
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
        }

        if (finalTranscript) {
          handleVoiceResult(finalTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        playSoundCue('error');
        if (event.error === 'not-allowed') {
          setFeedbackNotice({
            text: 'Permiso de micrófono denegado. Permite el acceso al micrófono en la barra de navegación.',
            type: 'error',
          });
        } else if (event.error === 'no-speech') {
          setFeedbackNotice({
            text: 'No se detectó voz. Vuelve a pulsar el micrófono para hablar.',
            type: 'info',
          });
        } else {
          setFeedbackNotice({
            text: `Reconocimiento finalizado: ${event.error}`,
            type: 'info',
          });
        }
        setTimeout(() => setFeedbackNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setFeedbackNotice({
        text: 'Error al iniciar reconocimiento de voz. Intenta nuevamente.',
        type: 'error',
      });
      setTimeout(() => setFeedbackNotice(null), 3000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setInterimText('');
  };

  const handleVoiceResult = (transcript: string) => {
    playSoundCue('success');
    const parsed = parseVoiceCommand(transcript);

    if (parsed.action === 'clear') {
      onSearchChange('');
      if (onShowOnlySavedToggle) onShowOnlySavedToggle(false);
      if (onCategorySelect) onCategorySelect('all');
      setFeedbackNotice({
        text: '🧹 Filtros y búsqueda limpiados',
        type: 'success',
      });
    } else if (parsed.action === 'showSaved') {
      if (onShowOnlySavedToggle) onShowOnlySavedToggle(true);
      setFeedbackNotice({
        text: '🔖 Mostrando lotes guardados',
        type: 'success',
      });
    } else {
      onSearchChange(parsed.query);
      if (parsed.category && onCategorySelect) {
        onCategorySelect(parsed.category);
      }
      setFeedbackNotice({
        text: `🎯 ${parsed.feedbackText}`,
        type: 'success',
      });
    }

    setTimeout(() => {
      setFeedbackNotice(null);
    }, 3500);
  };

  // Quick simulated command for testing / devices without mic permission
  const handleSimulateVoiceCommand = (command: string) => {
    setInterimText(`"${command}"`);
    setTimeout(() => {
      handleVoiceResult(command);
      setShowVoiceHelp(false);
    }, 400);
  };

  return (
    <div className="space-y-2">
      {/* Search Input Bar */}
      <div className="flex items-center gap-2">
        <div className={`relative flex-1 rounded-xl transition-all duration-300 ${
          isListening 
            ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20' 
            : 'focus-within:ring-1 focus-within:ring-cyan-500'
        }`}>
          <Search className={`w-4 h-4 absolute left-3 top-2.5 transition-colors ${
            isListening ? 'text-emerald-400 animate-pulse' : 'text-slate-400'
          }`} />

          <input
            type="text"
            placeholder={isListening ? 'Escuchando tu voz...' : placeholder}
            value={isListening && interimText ? interimText : searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-9 pr-16 py-2 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
              isListening 
                ? 'border-emerald-500 bg-slate-900/90' 
                : 'border-slate-800 focus:border-cyan-500'
            }`}
          />

          {/* Right Action Buttons: Clear + Voice Search */}
          <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
            {searchQuery && !isListening && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Voice Search Button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/40'
                  : 'bg-slate-800/80 hover:bg-[#00B074]/20 text-slate-300 hover:text-[#00B074] border border-slate-700/60'
              }`}
              title={isListening ? 'Detener escucha' : 'Búsqueda por voz (Ej: "Buscar iPhone 16")'}
              aria-label="Búsqueda por voz"
            >
              {isListening ? (
                <div className="flex items-center gap-1">
                  {/* Waveform Equalizer Animation */}
                  <span className="flex items-center gap-0.5 h-3 px-0.5">
                    <span className="w-0.5 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDuration: '400ms' }} />
                    <span className="w-0.5 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDuration: '600ms', animationDelay: '100ms' }} />
                    <span className="w-0.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDuration: '500ms', animationDelay: '200ms' }} />
                  </span>
                  <MicOff className="w-3.5 h-3.5 text-red-400" />
                </div>
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}

              {/* Pulsing beacon if active */}
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Modal Toggle Button */}
        <button
          type="button"
          onClick={onFilterModalToggle}
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          title="Filtros avanzados"
        >
          <Volume2 className="w-4 h-4 hidden" />
          <span className="sr-only">Filtros</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </button>
      </div>

      {/* Voice Status & Visualizer Banner */}
      {isListening && (
        <div className="p-3 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/50 rounded-2xl shadow-xl space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                Micrófono Activo — Di tu búsqueda:
              </span>
            </div>
            <button
              onClick={stopListening}
              className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono italic">
              <span className="text-emerald-400">&gt;</span>
              <span>{interimText || 'Esperando comando verbal...'}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>

          {/* Quick Voice Command Examples */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1 flex-wrap">
            <span className="text-slate-500">Comandos admitidos:</span>
            <button
              type="button"
              onClick={() => handleSimulateVoiceCommand('Buscar iPhone 16')}
              className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/60"
            >
              "Buscar iPhone 16"
            </button>
            <button
              type="button"
              onClick={() => handleSimulateVoiceCommand('Buscar MacBook')}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              "Buscar MacBook"
            </button>
            <button
              type="button"
              onClick={() => handleSimulateVoiceCommand('Solo guardados')}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              "Solo guardados"
            </button>
            <button
              type="button"
              onClick={() => handleSimulateVoiceCommand('Limpiar')}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              "Limpiar"
            </button>
          </div>
        </div>
      )}

      {/* Voice Recognition Feedback Pill */}
      {feedbackNotice && !isListening && (
        <div
          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between shadow-md transition-all duration-300 ${
            feedbackNotice.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300'
              : feedbackNotice.type === 'error'
              ? 'bg-red-950/70 border-red-800/80 text-red-300'
              : 'bg-cyan-950/70 border-cyan-800/80 text-cyan-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : feedbackNotice.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="font-medium">{feedbackNotice.text}</span>
          </div>

          <button
            onClick={() => setFeedbackNotice(null)}
            className="text-slate-400 hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Help Chips Drawer */}
      {showVoiceHelp && !isListening && (
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Mic className="w-3.5 h-3.5" />
              Comandos de Voz Rápidos
            </span>
            <button onClick={() => setShowVoiceHelp(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Haz clic en un comando para probar el filtrado por voz:
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => handleSimulateVoiceCommand('Buscar iPhone 16')}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-left text-emerald-400 font-mono hover:border-emerald-500/50"
            >
              🗣️ "Buscar iPhone 16"
            </button>
            <button
              onClick={() => handleSimulateVoiceCommand('Buscar MacBook Pro')}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-left text-slate-300 font-mono hover:text-white"
            >
              🗣️ "Buscar MacBook Pro"
            </button>
            <button
              onClick={() => handleSimulateVoiceCommand('Buscar Samsung S24')}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-left text-slate-300 font-mono hover:text-white"
            >
              🗣️ "Buscar Samsung S24"
            </button>
            <button
              onClick={() => handleSimulateVoiceCommand('Limpiar')}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-left text-amber-400 font-mono hover:border-amber-500/50"
            >
              🗣️ "Limpiar filtro"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
