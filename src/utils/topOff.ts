export default function topOff<T>(list: Array<T | null>, length: number) {
  const result = [...list];
  while (result.length < length) result.push(null);
  return result;
}
