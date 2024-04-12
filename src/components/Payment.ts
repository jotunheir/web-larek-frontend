import { Form } from './common/Form';
import { IEvents, IPaymentForm } from '../types';

export class PaymentForm extends Form<IPaymentForm> {
	protected _buttonsPayment: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttonsPayment = Array.from(
			container.querySelectorAll('.button_alt')
		);
		this._buttonsPayment.forEach((button) => {
			button.addEventListener('click', () => {
				events.emit('paymentMethod:changed', button);
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	setPaymentButton(name: string): void {
		this._buttonsPayment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
}
