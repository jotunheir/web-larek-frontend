import { IOrder, OrderResult, IItem, ILarekAPI, ApiListResponse } from '../types';
import { Api } from './base/api';

export class LarekAPI extends Api implements ILarekAPI {

    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    };

    getItems(): Promise<IItem[]> {
        return this.get('/product').then(
          (data: ApiListResponse<IItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    };

    getItem(id: string): Promise<IItem> {
        return this.get(`/product/${id}`).then(
          (item: IItem) => ({
              ...item,
              image: this.cdn + item.image,
          })
        );
    };

    sendOrder(order: IOrder): Promise<OrderResult> {
        return this.post('/order', order).then(
          (data: OrderResult) => data
        );
    }
}