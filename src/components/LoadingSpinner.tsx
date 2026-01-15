import { Loader2 } from 'lucide-react';
import { Logo } from './Logo';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/20 via-white to-blue-50/10">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" showText={true} className="opacity-80" />
        </div>
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
}
