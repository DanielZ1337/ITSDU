import { CustomPDFContext } from "@/contexts/custom-pdf-context";
import { useContext } from "react";

export const useCustomPDFContext = () => {
  const context = useContext(CustomPDFContext);
  if (!context) {
    throw new Error("CustomPDFContext must be used within a CustomPDFProvider");
  }
  return context;
};
