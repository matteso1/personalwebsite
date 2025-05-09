// src/Test.jsx
import React from 'react';

const Test = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
      <div className="max-w-md p-8 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-400 mb-4">Tailwind Test</h1>
        <p className="mb-4">
          This is a simple test component to check if Tailwind CSS is working correctly.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default Test;