import React, { useState } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import Start from './Start';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  
  return (
    <div>
      <Nav />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
