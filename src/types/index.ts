export type ApiListResponse<Type> = {
	total: number,
	items: Type[]
};
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export interface ILarekAPI {
	getItems: () => Promise<IItem[]>;
	getItem: (id: string) => Promise<IItem>;
	sendOrder: (order: IOrder) => Promise<OrderResult>;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
	eventName: string,
	data: unknown
};
export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IBasketView {
	items: IItem[];
	total: number;
}
export interface IBasketItemView {
	counter: number;
	title: string;
	price: number;
}

export interface ICard {
	description?: string;
	image?: string;
	title: string;
	category?: string;
	price: number | null;
}
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export type CatalogChangeEvent = {
	catalog: IItem[]
};

export interface IItem {
	id: string;
	category: string;
	title: string;
	image: string;
	description?: string;
	price: number | null;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}
export interface IPaymentForm {
	payment: string;
	address: string;
}
export interface IContactsForm {
	email: string;
	phone: string;
}
export interface IOrderForm extends IPaymentForm, IContactsForm {}
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrder extends IOrderForm{
	items: string[];
	total: number;
}

export type OrderResult = Pick<IOrder, 'total'>;

export interface ISuccess {
	totalPrice: number;
}
export interface ISuccessActions {
	onClick: () => void;
}

export interface IAppData {
	catalog: IItem[];
	basket: string[];
	order: IOrder | null;
}