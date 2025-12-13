import React from 'react';

const Dialog = ({ message, isType = "normal", onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className={`text-4xl mb-4 ${isType === "error" ? "text-red-500" : "text-green-500"}`}>
            {isType === "error" ? "⚠️" : "✅"}
          </div>
          <p className="text-gray-800 text-lg mb-6">{message}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
