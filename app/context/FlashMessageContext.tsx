'use client';

import { createContext, useContext, useState } from 'react';
import { FlashType, FlashMessageContextType } from '../types/flash';

const FlashMessageContext = createContext<FlashMessageContextType | undefined>(
  undefined
);

export const FlashMessageProvider = ({children}: {children: React.ReactNode}) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<FlashType>('success');
  const [visible, setVisible] = useState(false);

  const showMessage = (message: string, type: FlashType) => {
    setMessage(message);
    setType(type);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  }

  const hideMessage = () => setVisible(false);

  return (
    <FlashMessageContext.Provider value={{ message, type, visible, showMessage, hideMessage }}>
      {children}
    </FlashMessageContext.Provider>
  );
}

export const useFlashMessage = () => {
  const context = useContext(FlashMessageContext);
  if (!context) throw new Error("useFlashMessage must be used within FlashMessageProvider");
  return context;
}