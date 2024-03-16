/**
 * Extracts values of a specified key from an array of objects and returns them as an array of strings.
 *
 * @param {Array<Object>} items - The array of objects to extract values from.
 * @param {string} key - The key whose values are to be extracted.
 * @returns {Array<string>} - An array of strings representing the values of the specified key.
 */
function extractObjValuesToStringArray(
	items: Array<Record<string, any>>,
	key: string
): Array<string> {
	return items.map((item) => {
		const value = item[key];
		// Ensure the value is returned as a string
		return value !== null && value !== undefined ? String(value) : "";
	});
}

export default extractObjValuesToStringArray;
