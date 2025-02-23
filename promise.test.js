const MyPromise = require(".");

describe("测试用例", () => {
	test("test resolve", () => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
		});
		expect(myPromise.status).toBe("fulfilled");
		expect(myPromise.value).toBe(1);
	});

	test("test reject", () => {
		const myPromise = new MyPromise((resolve, reject) => {
			reject(1);
		});
		expect(myPromise.status).toBe("rejected");
		expect(myPromise.value).toBe(1);
	});

	test("test resolve twice", () => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
			resolve(2);
		});
		expect(myPromise.status).toBe("fulfilled");
		expect(myPromise.value).toBe(1);
	});

	test("test resolve and reject at the same time", () => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
			reject(2);
		});
		expect(myPromise.status).toBe("fulfilled");
		expect(myPromise.value).toBe(1);
	});
});
