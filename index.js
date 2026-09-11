import './src/utils/safeWeakMap';
import React from 'react';
import { registerRootComponent } from 'expo';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';

function RootComponent() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

registerRootComponent(RootComponent);
