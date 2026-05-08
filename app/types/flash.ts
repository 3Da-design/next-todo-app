export type FlashType = "success" | "error";

export type FlashMessageContextType = {
  message: string,
  type: FlashType,
  visible: boolean,
  showMessage: (message: string, type: FlashType) => void,
  hideMessage: () => void
}