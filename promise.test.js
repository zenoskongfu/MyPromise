const MyPromise = require(".");

describe("test promise status and value", () => {
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

	test("test pending", (done) => {
		jest.useFakeTimers();
		const onFulfilled = jest.fn();
		const onRejected = jest.fn();
		const myPromise = new MyPromise((resolve, reject) => {
			setTimeout(() => {
				resolve(1);
			}, 1000);
		}).then(onFulfilled, onRejected);

		expect(myPromise.status).toBe("pending");

		setTimeout(() => {
			expect(onFulfilled).toHaveBeenCalledWith(1);
			expect(onRejected).not.toHaveBeenCalled();
			done();
		}, 1000);

		jest.advanceTimersByTime(1000);

		jest.useRealTimers();
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

describe("test promise then", () => {
	test("test then on fulfilled promise", (done) => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
		});

		const spyOnFulfilled = jest.fn();
		const spyOnRejected = jest.fn();
		myPromise.then(spyOnFulfilled, spyOnRejected).then(() => {
			expect(spyOnFulfilled).toHaveBeenCalledWith(1);
			expect(spyOnRejected).not.toHaveBeenCalled();
			done();
		});
	});

	test("test then on rejected promise", (done) => {
		const myPromise = new MyPromise((resolve, reject) => {
			reject(1);
		});

		const spyOnFulfilled = jest.fn();
		const spyOnRejected = jest.fn();
		myPromise.then(spyOnFulfilled, spyOnRejected).then(() => {
			expect(spyOnFulfilled).not.toHaveBeenCalled();
			expect(spyOnRejected).toHaveBeenCalledWith(1);
			done();
		});
	});
});

describe("test return value of then", () => {
	test("test return value of then", (done) => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
		});

		const spyOnFulfilled = jest.fn((res) => {
			return res + 1;
		});
		const spyOnRejected = jest.fn();
		const newPromise = myPromise.then(spyOnFulfilled, spyOnRejected);

		newPromise.then(() => {
			expect(newPromise.status).toBe("fulfilled");
			expect(newPromise.value).toBe(2);
			done();
		});
	});

	test("test return fulfilled promise of then", (done) => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
		});

		const spyOnFulfilled = jest.fn((res) => {
			return new MyPromise((resolve, reject) => {
				resolve(res + 1);
			});
		});
		const spyOnRejected = jest.fn();
		const newPromise = myPromise.then(spyOnFulfilled, spyOnRejected);

		newPromise.then(() => {
			expect(newPromise.status).toBe("fulfilled");
			expect(newPromise.value).toBe(2);
			done();
		});
	});

	test("test return rejected promise of then", (done) => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
		});

		const spyOnFulfilled = jest.fn((res) => {
			return new MyPromise((resolve, reject) => {
				reject(res + 1);
			});
		});
		const spyOnRejected = jest.fn();
		const newPromise = myPromise.then(spyOnFulfilled, spyOnRejected);

		newPromise.then(
			() => {},
			() => {
				expect(newPromise.status).toBe("rejected");
				expect(newPromise.value).toBe(2);
				done();
			}
		);
	});
});

describe("test throw error in then", () => {
	test("test throw error in then", (done) => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
		});

		let newPromise = myPromise.then(
			(res) => {
				throw "error";
			},
			(err) => {
				console.log(err);
			}
		);

		newPromise.then(
			() => {},
			() => {
				expect(newPromise.status).toBe("rejected");
				expect(newPromise.value).toBe("error");
				done();
			}
		);
	});
});

describe("test async of then", (done) => {
	test("test async of then", async () => {
		const myPromise = new MyPromise((resolve, reject) => {
			resolve(1);
		});
		const fn1 = jest.fn();
		const fn2 = jest.fn();
		const fn3 = jest.fn();

		fn1();

		const newPromise = myPromise.then(
			() => {
				fn2();
			},
			() => {}
		);

		fn3();

		newPromise.then(() => {
			const order1 = fn1.mock.invocationCallOrder[0];
			const order2 = fn2.mock.invocationCallOrder[0];
			const order3 = fn3.mock.invocationCallOrder[0];

			expect(order1).toBeLessThan(order2);
			expect(order3).toBeLessThan(order2);
			done();
		});
	});
});
