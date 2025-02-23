const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
	status = "pending";
	value = undefined;

	constructor(executor) {
		executor(this.resolve.bind(this), this.reject.bind(this));
		return this;
	}

	resolve(value) {
		if (this.status === PENDING) {
			this.status = FULFILLED;
			this.value = value;
		}
	}

	reject(reason) {
		if (this.status === PENDING) {
			this.status = REJECTED;
			this.value = reason;
		}
	}
}

module.exports = MyPromise;
