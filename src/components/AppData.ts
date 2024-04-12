import { Model } from './base/Model';
import { IItem, IAppData, IOrder, FormErrors, IContactsForm } from '../types';

export class ProductItem extends Model<IItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export class AppData extends Model<IAppData> {
	catalog: IItem[] = [];
	basket: IItem[] = [];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	formErrors: FormErrors = {};

	setCatalog(items: IItem[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: IItem) {
		this.emitChanges('preview:changed', item);
	}

	addItem(item: IItem): void {
		this.basket.push(item);
		this.emitChanges('itemsListBasket: changed', this.basket);
	}

	removeItem(id: string): void {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.emitChanges('itemsListBasket: changed', this.basket);
	}

	getTotal(): number {
		return this.basket.reduce((acc, curr) => acc + curr.price, 0);
	}

	setAddress(value: string): void {
		this.order.address = value;
		this.validatePaymentForm();
	}

	setPaymentMethod(value: string): void {
		this.order.payment = value;
		this.validatePaymentForm();
	}

	setContacts(field: keyof IContactsForm, value: string) {
		this.order[field] = value;
		this.validateContactsForm();
	}

	validatePaymentForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать метод оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderData(): void {
		this.order.items = [];
		this.basket.forEach((item) => {
			if (item.price !== null) {
				this.order.items.push(item.id);
			}
		});

		this.order.total = this.getTotal();
	}

	clearOrderForm(): void {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
	}

	clearOrder(): void {
		this.basket = [];
		this.emitChanges('itemsListBasket: changed', this.basket);
		this.clearOrderForm();
	}

	isItemSelected(item: IItem): boolean {
		return this.basket.includes(item);
	}
}
