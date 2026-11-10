
const API_URL = 'https://api.frankfurter.dev/v2';

export async function getCurrencies() {
  const response = await fetch(`${API_URL}/currencies`);

  if (!response.ok) {
    throw new Error('Não foi possível carregar a lista de moedas.');
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('A API retornou uma lista de moedas inválida.');
  }

  return data
    .filter((currency) => currency.code && currency.name)
    .sort((a, b) => a.code.localeCompare(b.code));
}

export async function getExchangeRate(from, to) {
  const response = await fetch(
    `${API_URL}/rate/${from}/${to}`
  );

  if (!response.ok) {
    throw new Error('Não foi possível consultar a taxa de câmbio.');
  }

  const data = await response.json();

  if (
    !data ||
    typeof data.rate !== 'number' ||
    !Number.isFinite(data.rate)
  ) {
    throw new Error('A API retornou uma taxa inválida.');
  }

  return {
    date: data.date,
    base: data.base,
    quote: data.quote,
    rate: data.rate,
  };
}
