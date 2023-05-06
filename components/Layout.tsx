import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {children}
      </main>
    </div>
  );
};

export default Layout;
