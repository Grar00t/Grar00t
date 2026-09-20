import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light' | 'system';

const MODES: Array<{ value: ThemeMode; label: string; glyph: string }> = [
  { value: 'dark', label: 'Dark', glyph: '●' },
  { value: 'light', label: 'Light', glyph: '○' },
  { value: 'system', label: 'Auto', glyph: '◐' }
];

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'dark' || value === 'light' || value === 'system';
}

function readStoredTheme(): ThemeMode {
  try {
    const current = localStorage.getItem('theme-mode');
    const legacy = localStorage.getItem('theme');
    return isThemeMode(current) ? current : isThemeMode(legacy) ? legacy : 'system';
  } catch {
    return 'system';
  }
}

function resolveTheme(mode: ThemeMode) {
  if (mode !== 'system') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode, persist = true) {
  const resolved = resolveTheme(mode);
  const root = document.documentElement;

  root.dataset.themeMode = mode;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;

  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute('content', resolved === 'dark' ? '#07090d' : '#faf9f6');

  if (persist) {
    try {
      localStorage.setItem('theme-mode', mode);
    } catch {
      // Storage may be unavailable in privacy-restricted contexts. The active theme still applies.
    }
  }
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const initial = readStoredTheme();

    setMode(initial);
    applyTheme(initial, false);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemThemeChange = () => {
      if (document.documentElement.dataset.themeMode === 'system') {
        applyTheme('system', false);
      }
    };

    media.addEventListener('change', onSystemThemeChange);
    return () => media.removeEventListener('change', onSystemThemeChange);
  }, []);

  const choose = (next: ThemeMode) => {
    setMode(next);
    applyTheme(next);
  };

  return (
    <div className="theme-switch" role="group" aria-label="Color theme">
      {MODES.map((option) => (
        <button
          key={option.value}
          type="button"
          className="theme-option"
          data-mode={option.value}
          aria-label={`Use ${option.label.toLowerCase()} theme`}
          aria-pressed={mode === option.value}
          title={`${option.label} theme`}
          onClick={() => choose(option.value)}
        >
          <span className="theme-glyph" aria-hidden="true">{option.glyph}</span>
          <span className="theme-label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
