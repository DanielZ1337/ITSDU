import axios from "axios";
import { ipcMain } from "electron";
import Store from "electron-store";

export type ItslearningStore = {
	IsFronterUpgradedSite: boolean;
	IsParentAppEnabled: boolean;
	OrgApiBaseUrl: string;
	CustomerId: number;
	Title: string;
	ShortName: string;
	CultureName: string;
	BaseUrl: string;
	IsPersonalRestApiEnabled: boolean;
	ShowCustomerInDropdownList: boolean;
	CountryCode: string;
	StateCode: string;
	Segment: number;
};

const defaultStore: ItslearningStore = {
	IsFronterUpgradedSite: false,
	IsParentAppEnabled: false,
	OrgApiBaseUrl: "https://eu1migra.itslearning.com",
	CustomerId: 900937,
	Title: "SDU Syddansk Universitet",
	ShortName: "SDU",
	CultureName: "da-DK",
	BaseUrl: "https://sdu.itslearning.com",
	IsPersonalRestApiEnabled: true,
	ShowCustomerInDropdownList: true,
	CountryCode: "DK",
	StateCode: "",
	Segment: 0,
};

export const initializeItslearningPreload = () => {
	try {
		ipcMain.removeHandler("itslearning:setOrganisation");
	} catch (error) {
		console.error(error);
	}
	ipcMain.handle(
		"itslearning:setOrganisation",
		async (event, customerId: number) => {
			await ItslearningService.getInstance().setCustomerById(customerId);
		},
	);
};

export class ItslearningService {
	private static instance: ItslearningService;
	private store = new Store<ItslearningStore>({
		watch: true,
		name: "itsdu-itslearning-store",
		defaults: defaultStore,
	});

	private constructor() {}

	static getInstance(): ItslearningService {
		if (!ItslearningService.instance) {
			ItslearningService.instance = new ItslearningService();
		}
		return ItslearningService.instance;
	}

	async setCustomerById(customerId: number) {
		const API_URL = new URL(
			`https://sdu.itslearning.com/restapi/sites/${customerId}/v1`,
		);

		const response = await axios.get(API_URL.toString());

		const store = response.data as ItslearningStore;

		this.store.store = store;
	}

	getStore(): ItslearningStore {
		return this.store.store;
	}

	setStore(store: ItslearningStore) {
		this.store.store = store;
	}

	getBaseUrl() {
		return this.store.store.BaseUrl;
	}

	getOrgApiBaseUrl() {
		return this.store.store.OrgApiBaseUrl;
	}

	getCustomerId() {
		return this.store.store.CustomerId;
	}

	getTitle() {
		return this.store.store.Title;
	}

	getShortName() {
		return this.store.store.ShortName;
	}

	getCultureName() {
		return this.store.store.CultureName;
	}

	getCountryCode() {
		return this.store.store.CountryCode;
	}

	getStateCode() {
		return this.store.store.StateCode;
	}

	getSegment() {
		return this.store.store.Segment;
	}

	getIsFronterUpgradedSite() {
		return this.store.store.IsFronterUpgradedSite;
	}

	getIsParentAppEnabled() {
		return this.store.store.IsParentAppEnabled;
	}

	getIsPersonalRestApiEnabled() {
		return this.store.store.IsPersonalRestApiEnabled;
	}

	getShowCustomerInDropdownList() {
		return this.store.store.ShowCustomerInDropdownList;
	}

	clearStore() {
		this.store.clear();
	}

	getStoreKeys() {
		return this.store.store;
	}

	setStoreKeys(store: ItslearningStore) {
		this.store.store = store;
	}

	setBaseUrl(baseUrl: string) {
		this.store.store.BaseUrl = baseUrl;
	}

	setOrgApiBaseUrl(orgApiBaseUrl: string) {
		this.store.store.OrgApiBaseUrl = orgApiBaseUrl;
	}

	setCustomerId(customerId: number) {
		this.store.store.CustomerId = customerId;
	}

	setTitle(title: string) {
		this.store.store.Title = title;
	}

	setShortName(shortName: string) {
		this.store.store.ShortName = shortName;
	}

	setCultureName(cultureName: string) {
		this.store.store.CultureName = cultureName;
	}

	setCountryCode(countryCode: string) {
		this.store.store.CountryCode = countryCode;
	}

	setStateCode(stateCode: string) {
		this.store.store.StateCode = stateCode;
	}

	setSegment(segment: number) {
		this.store.store.Segment = segment;
	}

	setIsFronterUpgradedSite(isFronterUpgradedSite: boolean) {
		this.store.store.IsFronterUpgradedSite = isFronterUpgradedSite;
	}

	setIsParentAppEnabled(isParentAppEnabled: boolean) {
		this.store.store.IsParentAppEnabled = isParentAppEnabled;
	}

	setIsPersonalRestApiEnabled(isPersonalRestApiEnabled: boolean) {
		this.store.store.IsPersonalRestApiEnabled = isPersonalRestApiEnabled;
	}

	setShowCustomerInDropdownList(showCustomerInDropdownList: boolean) {
		this.store.store.ShowCustomerInDropdownList = showCustomerInDropdownList;
	}
}
