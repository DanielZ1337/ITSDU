import ReactDOM from "react-dom/client";
import "@/index.css";
import Providers from "@/components/providers";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { CommandLoading } from "cmdk";
import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
	useMemo,
} from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { Loader } from "./components/ui/loader";
import { cn } from "./lib/utils";

const ErrorPage = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<h1 className="text-4xl">Error</h1>
		</div>
	);
};

const router = createHashRouter([
	{
		element: <Login />,
		errorElement: <ErrorPage />,
		index: true,
	},
]);

const baseUrl = import.meta.env.DEV
	? "http://localhost:8080/"
	: "https://sdu.itslearning.com/";

function Login() {
	const [organisations, setOrganisations] =
		useState<OrganisationsResponse | null>(null);
	const [search, setSearch] = useState("");

	const isSiteFiltered = organisations?.EntityArray.filter((org) => org.IsSite);

	const filteredOrganisations = useCallback(() => {
		return isSiteFiltered?.filter((org) =>
			org.SiteName.toLowerCase().includes(search.toLowerCase()),
		);
	}, [isSiteFiltered, search])();

	const memoizedOrganisations = useMemo(() => {
		return filteredOrganisations;
	}, [filteredOrganisations]);

	const setSelectedOrganisation = (org: Organisation) => {
		window.itslearning.setOrganisation(org.CustomerId).then(() => {
			void window.itslearning.login();
		});
	};

	useEffect(() => {
		fetch(
			new URL(
				"/restapi/sites/all/organisations/v1?sitesFilter=itslearning",
				baseUrl,
			).toString(),
		)
			.then((res) => res.json())
			.then(setOrganisations);
	}, []);

	return (
		<div className="p-4 h-screen">
			<Command className="h-full border" loop shouldFilter={false}>
				<CommandInput
					autoFocus
					autoCapitalize=""
					autoComplete=""
					autoCorrect=""
					autoSave=""
					value={search}
					onValueChange={setSearch}
					placeholder="Search for an organisation"
				/>
				<CommandList
					className={cn(
						"min-h-96 h-screen max-h-full",
						!memoizedOrganisations &&
							"flex flex-col items-center justify-center",
					)}
				>
					<CommandEmpty>No results found.</CommandEmpty>
					{memoizedOrganisations && memoizedOrganisations.length > 0 && (
						<CommandGroup heading="Organisations">
							<div className="mt-2">
								{memoizedOrganisations?.map((org) => (
									<CommandItem
										key={org.CustomerId}
										onSelect={() => setSelectedOrganisation(org)}
									>
										{org.SiteName}
									</CommandItem>
								))}
							</div>
						</CommandGroup>
					)}
					{!memoizedOrganisations && (
						<CommandLoading>
							<Loader className="m-auto h-full" />
						</CommandLoading>
					)}
				</CommandList>
			</Command>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Providers>
			<RouterProvider
				fallbackElement={<ErrorPage />}
				future={{
					v7_startTransition: true,
				}}
				router={router}
			/>
		</Providers>
	</React.StrictMode>,
);

interface OrganisationsResponse {
	EntityArray: Organisation[];
	Total: number;
	CurrentPageIndex: number;
	PageSize: number;
}

interface Organisation {
	CustomerId: number;
	SiteName: string;
	SchoolName: string;
	IsSite: boolean;
}

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message);
});
