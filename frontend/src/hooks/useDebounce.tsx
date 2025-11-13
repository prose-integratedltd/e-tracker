/* 
export default function useDebounce<T>(value: T, delay: number = 700): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay);

		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}
 */
export default function debounce<T>(
	func: (arg: T) => void,
	wait: number = 700
) {
	let timeout: ReturnType<typeof setTimeout>;
	return (arg: T) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(arg), wait);
	};
}
