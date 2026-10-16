import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Ciné App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-peach-50 text-terracotta flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-tangerine text-white flex items-center justify-center font-bold text-xl mb-4 shadow-glow-tangerine">
            C
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">Notice</h1>
          <p className="text-sm text-terracotta/80 font-sans max-w-md mb-4 leading-relaxed">
            The page encountered an unexpected state. Please click below to reset.
          </p>
          {this.state.error && (
            import.meta.env.DEV ? (
              <div className="mb-6 p-4 rounded-xl bg-peach-200/80 border border-tangerine/30 max-w-lg text-left overflow-auto">
                <span className="font-bold text-xs text-tangerine-800 block mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </span>
                <pre className="text-[10px] text-terracotta/75 font-mono whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-xl bg-peach-200/80 border border-tangerine/30 max-w-lg text-center">
                <p className="text-xs text-terracotta/80 font-sans">
                  An unexpected error occurred. Please refresh or return to the home page.
                </p>
              </div>
            )
          )}
          <button
            onClick={() => {
              window.location.hash = '#/';
              window.location.reload();
            }}
            className="px-6 py-3 rounded-full bg-tangerine hover:bg-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine transition-all"
          >
            Return To Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
