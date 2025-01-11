import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface GroceryItem {
	name: string;
	quantity: number;
	unit: string;
}

interface GroceryList {
	items: GroceryItem[];
}

type PriceList = { [key: string]: number };

const PRICE_LIST: PriceList = {
	milk: 1.5,
	eggs: 3.0,
	bread: 2.0,
	apples: 3.5,
	bananas: 2.2,
	tomatoes: 2.8,
	onions: 1.0,
	potatoes: 1.5,
	carrots: 2.0,
	lettuce: 1.8,
	cucumber: 1.2,
	yogurt: 1.5,
	cheese: 3.0,
	coffee: 5.0,
	tea: 4.2,
	pasta: 1.6,
	rice: 2.5
};

class GroceryItem {
	name: string;
	quantity: number;
	unit: string;
	price: number;

	constructor(name: string, quantity: number, unit: string, price: number) {
		this.name = name;
		this.quantity = quantity;
		this.unit = unit;
		this.price = price;
	}

	calculateTotal() {
		return this.quantity * this.price;
	}

	toString() {
		return `${this.name} - ${this.quantity} ${
			this.unit
		} - $${this.calculateTotal()}\n`;
	}
}

class GroceryList {
	items: GroceryItem[] = [];
	total: number;

	constructor() {
		this.items = [];
		this.total = 0;
	}

	addItem(item: GroceryItem) {
		this.items.push(item);
		this.total += item.calculateTotal();
	}

	toString() {
		let output = 'Grocery List:\n--------------------\n';

		this.items.forEach((item) => {
			output += item.toString();
		});
		output += `--------------------\n
        Total: $${this.total}`;

		return output;
	}
}

class GroceryListBuilder {
	groceryList: GroceryList;

	constructor() {
		this.groceryList = new GroceryList();
	}

	addItem(name: string, qty: number, unit: string) {
		const price = PRICE_LIST[name.toLowerCase()];

		const item = new GroceryItem(name, qty, unit, price);

		this.groceryList.addItem(item);

		return this;
	}

	build() {
		return this.groceryList;
	}
}

class FileHandler {
	static readGroceryFile(filename: string): GroceryList | void {
		try {
			const filePath = path.join(__dirname, '..', filename);
			const data = fs.readFileSync(filePath, 'utf-8');
			return JSON.parse(data);
		} catch (error) {
			console.log(error);
		}
	}
	static writeGroceryFile(filename: string, data: string) {
		try {
			const filePath = path.join(__dirname, '..', filename);
			fs.writeFileSync(filePath, data, 'utf-8');
		} catch (error) {
			console.log(error);
		}
	}
}

class GroceryProcessor {
	inputFile: string;
	outputFile: string;

	constructor(inputFile: string, outputFile: string) {
		this.inputFile = inputFile;
		this.outputFile = outputFile;
	}

	process() {
		try {
			const data = FileHandler.readGroceryFile(this.inputFile);
			const builder = new GroceryListBuilder();

			data?.items.forEach((item) => {
				builder.addItem(item.name, item.quantity, item.unit);
			});

			const groceryList = builder.build();

			FileHandler.writeGroceryFile(groceryList.toString(), this.outputFile);

			return groceryList.toString();
		} catch (error) {
			console.log(error);
		}
	}
}

const list = new GroceryProcessor('grocery_list.json', 'shopping_receipt.txt');

console.log(list.process());
