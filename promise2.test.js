const MyPromise = require(".");

describe("test catch and finally", () => {
	test("test catch in fulfilled promise", async () => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
		});

		const spyOnCatch = jest.fn(() => {
			// 该断言不会被执行
			expect(res).toBe(1);
		});

		const res = await myPromise.catch(() => {});
		expect(spyOnCatch).not.toHaveBeenCalled();
		expect(res).toBe(1);
		// 判断断言执行的数量为2
		expect.assertions(2);
	});

	test("test catch in rejected promise", async () => {
		const myPromise = new MyPromise((resolve, reject) => {
			reject(1);
		});

		const spyOnCatch = jest.fn((res) => {
			// 该断言会被执行
			expect(res).toBe(1);
			return "ERROR";
		});

		const res = await myPromise.catch(spyOnCatch);
		expect(spyOnCatch).toHaveBeenCalled();
		expect(res).toBe("ERROR");
		// 判断断言执行的数量为3
		expect.assertions(3);
	});

	test("test finally in fulfilled promise", async () => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
		});

		const spyOnFinally = jest.fn();

		const res = await myPromise.finally(spyOnFinally);
		expect(spyOnFinally).toHaveBeenCalled();
		expect(res).toBe(1);
	});

	test("test finally in rejected promise", async () => {
		const myPromise = new MyPromise((resolve, reject) => {
			reject(1);
		});
		const spyOnFinally = jest.fn();
		const res = await myPromise.then().finally(spyOnFinally);
		expect(spyOnFinally).toHaveBeenCalled();
		expect(res).toBe(1);
	});
});
