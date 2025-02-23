const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
	status = "pending";
	value = undefined;
	onFulfilledCallbacks = [];
	onRejectedCallbacks = [];
	constructor(executor) {
		executor(this.resolve.bind(this), this.reject.bind(this));
		return this;
	}

	resolve(value) {
		if (this.status === PENDING) {
			this.status = FULFILLED;
			this.value = value;

			this.onFulfilledCallbacks.forEach((callback) => {
				callback(value);
			});
		}
	}

	reject(reason) {
		if (this.status === PENDING) {
			this.status = REJECTED;
			this.value = reason;

			this.onRejectedCallbacks.forEach((callback) => {
				callback(reason);
			});
		}
	}

	then(onFulfilled, onRejected) {
		onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
		onRejected =
			typeof onRejected === "function"
				? onRejected
				: (reason) => {
						throw reason;
				  };
		return new MyPromise((resolve, reject) => {
			const handleResolve = () => {
				queueMicrotask(() => {
					try {
						const res = onFulfilled(this.value);
						this.handlePromise(res, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			};

			const handleReject = () => {
				queueMicrotask(() => {
					try {
						const res = onRejected(this.value);
						this.handlePromise(res, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			};
			if (this.status === PENDING) {
				this.onFulfilledCallbacks.push(() => {
					handleResolve();
				});

				this.onRejectedCallbacks.push(() => {
					handleReject();
				});
			} else if (this.status === FULFILLED) {
				handleResolve();
			} else if (this.status === REJECTED) {
				handleReject();
			}
		});
	}

	handlePromise(x, resolve, reject) {
		if (x instanceof MyPromise) {
			x.then(
				(res) => {
					return this.handlePromise(res, resolve, reject);
				},
				(err) => {
					reject(err);
				}
			);
		} else {
			resolve(x);
		}
	}

	catch(onRejected) {
		return this.then(null, onRejected);
	}

	finally(onFinally) {
		onFinally = (res) => {
			onFinally();
			return res;
		};
		return this.then(onFinally, onFinally);
	}
}

module.exports = MyPromise;
