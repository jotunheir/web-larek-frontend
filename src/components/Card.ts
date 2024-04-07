import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { ICard, ICardActions } from '../types';
import { itemCategoryList } from '../utils/constants';


export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add('card__category' + itemCategoryList[value]);
    }

    set price(value: number) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) {
                this.setButtonState();
                this.setText(this._button, 'Нельзя купить');
            }
        } else {
            this.setText(this._price, value + ' синапсов');
        }
    }

    get price() {
        return Number(this._price.textContent)
    }

    setButtonState() {
        this._button.setAttribute('disabled', '');
    }

    setSelected() {
        this.setText(this._button, 'Уже в корзине');
    }
}