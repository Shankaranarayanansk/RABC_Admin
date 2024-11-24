import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message }) => (
  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
    <AlertTriangle size={20} />
    <span>{message}</span>
  </div>
);

export default ErrorMessage;