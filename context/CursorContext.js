"use client";
import { createContext, useContext, useState } from 'react';

const CursorContext = createContext();

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

export const CursorProvider = ({ children }) => {
  const [cursorVariant, setCursorVariant] = useState("default");
  
  const textEnter = () => setCursorVariant("text");
  const buttonEnter = () => setCursorVariant("button");
  const cardEnter = () => setCursorVariant("card");
  const leave = () => setCursorVariant("default");
  
  return (
    <CursorContext.Provider value={{ 
      cursorVariant, 
      textEnter, 
      buttonEnter, 
      cardEnter, 
      leave 
    }}>
      {children}
    </CursorContext.Provider>
  );
};