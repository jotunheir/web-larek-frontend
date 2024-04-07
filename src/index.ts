import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';

import { EventEmitter } from './components/base/events';

import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Success } from './components/common/Success';

import { AppData } from './components/AppData';
import { Card } from './components/Card';
import { PaymentForm } from './components/Payment';
import { ContactsForm } from './components/Contacts';
import { IOrder, IContactsForm, IItem, CatalogChangeEvent } from './types';

import { cloneTemplate, ensureElement } from './utils/utils';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardsListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppData({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const paymentForm = new PaymentForm (cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm (cloneTemplate(contactsFormTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map(item => {
		const card = new Card('card', cloneTemplate(cardsListTemplate), {
			onClick: () => events.emit('card:selected', item)
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price
		});
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			email:'',
			phone: '',
			valid: false,
			errors: []
		})
	})
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	paymentForm.valid = !address && !payment;
	contactsForm.valid = !email && !phone;
	paymentForm.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
	contactsForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on( /^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {  appData.setContacts(data.field, data.value);
	});

events.on(/^order\..*:change/, (data: { value: string }) => { appData.setAddress(data.value);
});

events.on('order:open', () => {
	modal.render({
		content: paymentForm.render({
			payment: 'cash',
			address: '',
			valid: false,
			errors: []
		})
	})
})

events.on('paymentMethod:changed', (payment: HTMLButtonElement) => {
	paymentForm.setPaymentButton(payment.name);
	appData.setPaymentMethod(payment.name);
})

events.on('contacts:submit', () => {
	appData.setOrderData();
	api.sendOrder(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearOrder();
				}}, appData.getTotal()
			);

			modal.render({
				content: success.render({})
			});

			appData.clearOrder();
		})
		.catch(err => {
			console.error(err);
		})
});

events.on('card:selected', (item: IItem) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IItem) => {
	const card = new Card('card', cloneTemplate(cardTemplate), {
		onClick: () => events.emit('card:addedToBasket', item)
	});

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		})
	});

	if(appData.isItemSelected(item)) {
		card.setButtonState();
		card.setSelected();
	}
});

events.on('card:addedToBasket', (item: IItem) => {
	appData.addItem(item);
	modal.close();
});

events.on('card:removeFromBasket', (item: IItem) => {
	appData.removeItem(item.id);
	modal.render({
		content: basket.render({
			items: appData.basket,
			total: appData.getTotal()
		})
	});
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			items: appData.basket,
			total: appData.getTotal()
		})
	});
});

events.on('itemsListBasket: changed', (basketList: IItem[]) => {
	page.counter = Object.keys(basketList).length;
	appData.basket = basketList;
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api.getItems()
	.then(appData.setCatalog.bind(appData))
	.catch(console.error);