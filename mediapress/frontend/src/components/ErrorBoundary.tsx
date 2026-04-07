import { Component } from 'react';
import type { ReactNode } from 'react';

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center p-8">
          <div className="bg-white border border-red-200 rounded-2xl p-6 max-w-lg w-full shadow-sm">
            <h1 className="text-red-500 text-xl font-bold mb-2">Lỗi render</h1>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">{this.state.error?.message}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
