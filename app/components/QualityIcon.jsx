import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function QualityIcon({ className = '', quality = 'excellent' }) {
  if (quality === 'excellent') return <CheckCircle className={className + ' text-emerald-600'} />;
  if (quality === 'good') return <CheckCircle className={className + ' text-blue-600'} />;
  if (quality === 'fair') return <Info className={className + ' text-orange-600'} />;
  return <AlertCircle className={className + ' text-red-600'} />;
}
