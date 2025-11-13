export default function isValidNigerianPlateNumber(plate: string): boolean {
	// Trim and normalize
	const normalized = plate.trim().toUpperCase();

	const newFormat = /^[A-Z]{3}-\d{3}[A-Z]{2}$/;

	const oldFormat1 = /^[A-Z]{2}\d{3}[A-Z]{3}$/;
	const oldFormat2 = /^[A-Z]{3}\d{3,4}$/;

	return (
		newFormat.test(normalized) ||
		oldFormat1.test(normalized) ||
		oldFormat2.test(normalized)
	);
}
