import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useEffect, useState } from "react";
import {
	FieldErrors,
	useForm,
	UseFormHandleSubmit,
	UseFormRegister,
	UseFormSetValue,
} from "react-hook-form";
import { z } from "zod";

interface CustomPDFContextProps {
	numPages?: number;
	currPage: number;
	setNumPages: (value: React.SetStateAction<number | undefined>) => void;
	setCurrPage: (value: React.SetStateAction<number>) => void;
	handlePageSubmit: ({
		page,
	}: {
		page: string;
	}) => void;
	handlePageIncrease: () => void;
	handlePageDecrease: () => void;
	register: UseFormRegister<{
		page: string;
	}>;
	errors: FieldErrors<{
		page: string;
	}>;
	handleSubmit: UseFormHandleSubmit<{
		page: string;
	}>;
	setValue: UseFormSetValue<{
		page: string;
	}>;
}

export const CustomPDFContext = createContext<
	CustomPDFContextProps | undefined
>(undefined);

const DEFAULT_PAGE = 1;

export function CustomPDFProvider({ children }: { children: React.ReactNode }) {
	const [numPages, setNumPages] = useState<number>();
	const [currPage, setCurrPage] = useState<number>(DEFAULT_PAGE);

	const CustomPageValidator = z.object({
		page: z
			.string()
			.refine((num) => Number(num) > 0 && Number(num) <= numPages!),
	});

	type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<TCustomPageValidator>({
		defaultValues: {
			page: String(DEFAULT_PAGE),
		},
		resolver: zodResolver(CustomPageValidator),
	});

	const handlePageSubmit = ({ page }: TCustomPageValidator) => {
		setCurrPage(Number(page));
		setValue("page", String(page));
	};

	const handlePageIncrease = () => {
		if (currPage + 1 > numPages!) return;
		setCurrPage((prev) => (prev + 1 > numPages! ? numPages! : prev + 1));
		setValue("page", String(currPage + 1));
	};

	const handlePageDecrease = () => {
		if (currPage - 1 < 1) return;
		setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
		setValue("page", String(currPage - 1));
	};

	useEffect(() => {
		setValue("page", String(currPage));
	}, [currPage, setValue]);

	return (
		<CustomPDFContext.Provider
			value={{
				numPages,
				currPage,
				setNumPages,
				setCurrPage,
				handlePageSubmit,
				handlePageIncrease,
				handlePageDecrease,
				register,
				errors,
				handleSubmit,
				setValue,
			}}
		>
			{children}
		</CustomPDFContext.Provider>
	);
}
