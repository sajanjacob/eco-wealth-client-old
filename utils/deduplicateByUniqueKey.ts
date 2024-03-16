/**
 * Removes duplicate objects from an array based on a specific key.
 *
 * @param {Array<Object>} items - The array of objects to deduplicate.
 * @param {string} uniqueKey - The key used to determine uniqueness.
 * @param {Function} [callback] - An optional callback to execute with the deduplicated array.
 * @returns {Array<Object>} - The deduplicated array.
 */
function deduplicateByUniqueKey(
	items: Array<Record<string, any>>,
	uniqueKey: string,
	callback?: (deduplicatedItems: Array<Record<string, any>>) => void
): Array<Record<string, any>> {
	// Use a Map to maintain uniqueness based on the uniqueKey provided
	const uniqueItemsMap = new Map();

	items.forEach((item) => {
		const keyValue = item[uniqueKey];
		if (!uniqueItemsMap.has(keyValue)) {
			uniqueItemsMap.set(keyValue, item);
		}
	});

	// Convert the Map back to an array
	const deduplicatedItems = Array.from(uniqueItemsMap.values());

	// If a callback is provided, execute it with the deduplicated array
	if (callback) {
		callback(deduplicatedItems);
	}

	return deduplicatedItems;
}

export default deduplicateByUniqueKey;
