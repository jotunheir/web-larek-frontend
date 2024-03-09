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
- src/styles/styles.scss — корневой файл стилей
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
## Документация
### Типы данных

```
Типизация категорий товаров

export type TProductType =
'софт-скилл' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скилл'
```
```
Типизация способов оплаты: онлайн и при получении

export type TPaymentType = 'online' | 'offline'
```
```
Типизация сущности товара: уникальный ID-номер, тип из TProductType, название, 
описание, изображение, цена и показатель нахождения в корзине

export interface IProduct {
id: string;
type: TProductType;
title: string;
description: string;
image: string;
price: number | null;
isInCart: boolean;
}
```
```
Типизация формы контактов: электронная почта и номер телефона

export type TContactsForm = {
email: string;
phone: string;
}
```
```
Типизация формы заказа: адрес доставки и способ оплаты из TPaymentType

export type TPaymentForm = {
address: string;
payment: TPaymentType;
}
```
```
Общая типизация формы заказа

export interface IOrderForm extends TContactsForm, TPaymentForm {}
```
```
Типизация заказа (расширение IOrderForm): массив выбранных товаров по уникальным 
ID и общая стоимость корзины

export interface IOrder extends IOrderForm {
items: string[];
total: number;
}
```
```
Типизация общего состояния приложения

export interface IAppState {

	- Общий каталог магазина, корзина, заказ, состояние загрузки 
	и типизация форм
	
	catalog: IProduct[];
	cart: IProduct[];
	order: IOrder | null;
	loading: boolean;
	formErrors: FormErrors;

	- Методы корзины: добавление и удаление товара, полное очищение корзины
	
	addToCart(value: IProduct): void;
	removeFromCart(id: string): void;
	clearCart(): void;

	- Геттеры корзины: счетчик товаров в корзине и подсчет полной 
	стоимости корзины
	
	getCartCount(): number;
	getTotalCartAmount(): number;

	- Сеттеры корзины: установка товаров в корзину и установка данных в поля 
	формы заказа
	
	setCartItems(): void;
	setOrderField(field: keyof IOrderForm, value: string): void;

	- Методы валидации формы заказа
	
	validateContacts(): boolean;
	validateOrder(): boolean;

	- Методы установки товаров в магазин, очистки заказа и выбранных товаров
	после покупки
	
	setStore(items: IProduct[]): void;
	resetOrder(): boolean;
	resetSelected(): void;
}
```
```
Типизация валидации форм

export type FormErrors = Partial<Record<keyof IOrder, string>>;
```