# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Документация
## Типы данных  
### Типизация API
````
type ApiListResponse<Type> = {
total: number,
items: Type[]
};

type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

interface ILarekAPI {
getItems: () => Promise<IItem[]>;
getItem: (id: string) => Promise<IItem>;
sendOrder: (order: IOrder) => Promise<OrderResult>;
}
````
### Типизация страницы приложения
````
interface IPage {
counter: number;
catalog: HTMLElement[];
locked: boolean;
}
````
### Типизация класса EventEmitter
````
type EventName = string | RegExp;

type Subscriber = Function;

type EmitterEvent = {
eventName: string,
data: unknown
};
````
### Типизация класса Modal
````
interface IModalData {
content: HTMLElement;
}
````
### Типизация корзины товаров
````
interface IBasketView {
items: IItem[];
total: number;
}

interface IBasketItemView {
counter: number;
title: string;
price: number;
}
````
### Типизация кароточки товара
````
interface ICard extends Omit<IItem, 'id'> {}

interface ICardActions {
onClick: (event: MouseEvent) => void;
}
````
### Типизация изменения каталога товаров
````
type CatalogChangeEvent = {
catalog: IItem[]
};
````
### Типизация сущности товара
````
interface IItem {
id: string;
category: string;
title: string;
image: string;
description?: string;
price: number | null;
}
````
### Типизация форм приложения
Общее состояние, форма данных оплаты, форма контактов и общая форма заказа
````
interface IFormState {
valid: boolean;
errors: string[];
}

interface IPaymentForm {
payment: string;
address: string;
}

interface IContactsForm {
email: string;
phone: string;
}

interface IOrderForm extends IPaymentForm, IContactsForm {}
type FormErrors = Partial<Record<keyof IOrder, string>>;
````

### Типизация заказа
Используется интерфейс общей формы заказа
````
interface IOrder extends IOrderForm{
items: string[];
total: number;
}

type OrderResult = Pick<IOrder, 'total'>;
````

### Типизация успешного заказа
````
interface ISuccess {
totalPrice: number;
}

interface ISuccessActions {
onClick: () => void;
}
````

### Типизация общего состояния приложения
````
interface IAppData {
catalog: IItem[];
basket: string[];
order: IOrder | null;
}
````

## Архитектура
В приложении используется `MVP`-архитектура - это шаблон, разделяющий приложение на три компонента: `Model` (данные), `View` (UI) и `Presenter` (бизнес-логика). 
  
Ведущий действует как мост между моделью и представлением, облегчая двустороннюю связь и контролируя поток данных между ними.
## Базовые классы
### Класс `Component<T>`
Базовый компонент, предоставляющий инструментарий для работы с DOM в дочерних компонентах

Конструктор
````
    protected constructor(protected readonly container: HTMLElement) {}
````

Методы: 
- `toggleClass` - переключает классы
- `setText` - устанавливает текстовое содержимое
- `setDisable` - изменяет статус блокировки
- `setHidden` - скрывает элемент
- `setVisible` - показывает элемент
- `setImage` - устанавливает изображение с алтернативным текстом
- `render` - возвращает корневой DOM-элемент

### Класс `Model<T>`
Базовая модель, чтобы можно было отличить ее от простых объектов с данными

Конструктор
````
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }
````

Методы:
- `emitChanges` - сообщает всем, что модель поменялась

### Класс `Api`
Предоставляет инструментарий для работы с серверными данными

Конструктор
````
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }
````

Методы:
- `get` - реализует GET-запросы к серверу
- `post` - реализует POST/PUT/DELETE-запросы к серверу

### Класс `EventEmitter`
Предоставляет инструментарий для работы с серверными данными

Конструктор
````
    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }
````

Методы:
- `on` - устанавливает обработчик на событие
- `off` - снимает обработчик с события
- `emit` - инициирует событие с данными
- `onAll` - подписывает на все события
- `offAll` - отписывает от всех событий
- `trigger` - делает коллбек-триггер, генерирующий событие при вызове

## Сервисные классы
### Класс `LarekApi`
Реализует работу с серверными данными проекта "Веб-ларек"

Конструктор
````
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    };
````

Методы:
- `getItems` - получает данные о каталоге товаров
- `getItem` - получает данные о конкретном товаре
- `sendOrder` - отправляет заказ

## Слой `Modal`
### Класс `AppData`
Модель общего состояния приложения

Методы:
- `setCatalog` - устанавливает каталог товаров
- `setPreview` - устанавливает превью товара
- `addItem` - добавляет товар в корзину
- `removeItem` - удаляет товар из корзины
- `getTotal` - общая стоимость корзины
- `setAddress` - устанавливает адрес покупателя
- `setPaymentMethod` - устанавливает способ оплаты
- `setContacts` - устанавливает контакты покупателя
- `validatePaymentForm` - валидация формы оплаты и доставки
- `validateContactsForm` - валидация формы контактов
- `setOrderData` - устанавливает полные данные о заказе
- `clearOrderForm` - очищает форму данных о заказе
- `clearOrder` - очищает заказ
- `isItemSelected` - проверяет, есть ли товар в корзине
## Слой `View`
### Класс `Card`
Вывод данных о товаре на страницу

Конструктор
````
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
````

Методы:
- `set id` - устанавливает уникальный id товара
- `set title` - устанавливает название товара
- `set description` - устанавливает описание товара
- `set image` - устанавливает изображение товара
- `set category` - устанавливает категорию товара
- `set/get price` - устанавливает/получает цену товара
- `setButtonState` - устанавливает состояние кнопки `Disabled`
- `setSelected` - устанавливает текст кнопки на `Уже в корзине`

### Класс `ContactsForm`
Реализует работу формы контактов в заказе

Конструктор
````
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
````

Методы:
- `set phone` - устанавливает номер телефона
- `set email` - устанавливает адрес электронной почты

### Класс `PaymentForm`
Реализует работу формы оплаты и доставки в заказе

Конструктор
````
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttonsPayment = Array.from(container.querySelectorAll('.button_alt'));
		this._buttonsPayment.forEach(button => {
			button.addEventListener('click', () => {
				events.emit('paymentMethod:changed', button);
			})
		});
	}
````

Методы:
- `set address` - устанавливает адрес покупателя
- `setPaymentButton` - устанавливает кнопку оплаты наличными/картой

### Класс `Page`
Реализует работу страницы всего приложения

Конструктор
````
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }
````

Методы:
- `set counter` - устанавливает счётчик товаров в корзине
- `set catalog` - устанавливает каталог товаров
- `set locked` - блокирует прокрутку страницы при открытом модальном окне

## Слой `Presenter`
Файл index.ts является главным модулем, который устанавливает связь между представлением и данными, реагируя на события с помощью подписки на брокер событий (экземпляр класса EventEmitter).

- `'items:changed'` - изменение списка товаров, вызывает перерисовку каталога на странице.
- `'order:submit'` - открытие модального окна для заполнения контактной информации при отправке заказа.
- `'formErrors:change'` - изменение ошибок в форме заказа, обновление статуса валидации и ошибок для формы оплаты и контактов.
- `'^contacts\..*:change'` - изменение полей контактной информации, обновление данных о контактах в приложении.
- `'^order\..*:change'` - изменение адреса заказа, обновление соответствующего поля в приложении.
- `'order:open'` - открытие модального окна для ввода данных оплаты.
- `'paymentMethod:changed'` - выбор метода оплаты, обновление класса кнопки выбора оплаты и метода оплаты в приложении.
- `'contacts:submit'` - отправка контактной информации, обработка данных заказа и отправка на сервер.
- `'card:selected'` - выбор карточки товара, устанавливается превью товара.
- `'preview:changed'` - изменение превью товара, отображение модального окна с информацией о товаре.
- `'card:addedToBasket'` - добавление товара в корзину, закрытие модального окна.
- `'card:removeFromBasket'` - удаление товара из корзины, обновление содержимого модального окна корзины.
- `'basket:open'` - открытие модального окна с содержимым корзины.
- `'itemsListBasket:changed'` - изменение списка товаров в корзине, обновление количества товаров на странице.
- `'modal:open'` - блокировка интерфейса страницы при открытии модального окна.
- `'modal:close'` - разблокировка интерфейса страницы при закрытии модального окна.

