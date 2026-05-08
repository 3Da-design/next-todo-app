'use client';

import { useFlashMessage } from '../context/FlashMessageContext';
import { FlashType } from '../types/flash';

export default function FlashMessage() {
  const { message, type, visible } = useFlashMessage();

  if (!visible) return null;

  const typeClass: Record<FlashType, string> = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700"
  }

  return (
    <div
      className={`${typeClass[type]} px-4 py-3 rounded text-center`}
      role="alert"
    >
      {message}
    </div>
  )
}