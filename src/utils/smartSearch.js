export function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/['’ʻ`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatPhone9Digits(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 7) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
    5,
    7
  )} ${digits.slice(7, 9)}`;
}

export function smartSearchCargo(cargo, rawQuery) {
  const cleanQuery = normalizeText(rawQuery);
  if (!cleanQuery) return true;

  const haystack = normalizeText(
    [
      cargo.id,
      cargo.channelName,
      cargo.fromCountry,
      cargo.fromRegion,
      cargo.fromCity,
      cargo.toCountry,
      cargo.toRegion,
      cargo.toCity,
      cargo.cargoType,
      cargo.weight,
      cargo.transportType,
      cargo.price,
      cargo.status,
      cargo.phone,
    ].join(' ')
  );

  const tokens = cleanQuery.split(' ').filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}