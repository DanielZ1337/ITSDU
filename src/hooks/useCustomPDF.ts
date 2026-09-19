import { useContext } from "react";
import { CustomPDFContext } from "@/contexts/custom-pdf-context";

export const useCustomPDFContext = () => {
	const context = useContext(CustomPDFContext);
	if (!context) {
		throw new Error("CustomPDFContext must be used within a CustomPDFProvider");
	}
	return context;
};
