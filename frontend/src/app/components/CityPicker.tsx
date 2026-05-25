import { useState, type FormEvent } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface CityPickerProps {
  initialCity?: string | null;
  onSubmit: (city: string) => Promise<void> | void;
  submitLabel?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CityPicker({
  initialCity,
  onSubmit,
  submitLabel = 'Зберегти',
  placeholder = 'Київ',
  disabled,
}: CityPickerProps) {
  const [value, setValue] = useState(initialCity ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Введіть назву міста');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося зберегти');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <MapPin className="w-4 h-4 text-purple-400" />
        Ваше місто
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || submitting}
        className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 disabled:opacity-50"
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={disabled || submitting}
        className="flex items-center justify-center gap-2 rounded-xl bg-purple-500 hover:bg-purple-400 transition-colors py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {submitLabel}
      </button>
    </form>
  );
}

export default CityPicker;
