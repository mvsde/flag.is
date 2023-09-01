export function isArrayInArray(a, b) {
	if (a.length === 0) {
		return true;
	}

	return a.every((item) => b.includes(item));
}
