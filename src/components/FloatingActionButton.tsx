import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  to: string;
  title: string;
  icon?: React.ElementType;
}

export function FloatingActionButton({ 
  to, 
  title, 
  icon: Icon = Plus 
}: FloatingActionButtonProps) {
  return (
    <Link
      to={to}
      className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      title={title}
    >
      <Icon className="w-6 h-6" />
    </Link>
  );
}