export type TProductType =
	'софт-скилл' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скилл'

export type TPaymentType = 'online' | 'offline'

export interface IProduct {
	id: string;
	type: TProductType;
	title: string;
	description: string;
	image: string;
	price: number | null;
	isInCart: boolean;
}

export type TContactsForm = {
	email: string;
	phone: string;

	validateContacts(): boolean;
}

export type TPaymentForm = {
	address: string;
	payment: TPaymentType;

	validatePayment(): boolean;
}

export interface IOrderForm extends TContactsForm, TPaymentForm {}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;

	addToCart(id: string): void;
	removeFromCart(id: string): void;
	clearCart(): void;
	getCartCount(): number;
	getTotalCartAmount(): number;
	setCartItems(): void;
	setOrderField(field: keyof IOrderForm, value: string): void;
}

export interface IAppState {
	catalog: IProduct[];
	cart: IProduct[];
	order: IOrder | null;
	loading: boolean;
	formErrors: FormErrors;

	setStore(items: IProduct[]): void;
	resetOrder(): boolean;
	resetSelected(): void;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
