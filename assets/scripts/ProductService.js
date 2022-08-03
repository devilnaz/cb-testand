export default class ProductService {

    getProductsSmall() {
		return fetch('./products-small.json').then(res => res.json()).then(d => d.data);
	}

	getProducts() {
		return fetch('./products.json').then(res => res.json()).then(d => d.data);
    }

    getProductsWithOrdersSmall() {
		return fetch('./products-orders-small.json').then(res => res.json()).then(d => d.data);
	}
}