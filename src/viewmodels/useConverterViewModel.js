
import { useState, useEffect } from 'react';

import {
  getCurrencies,
  getExchangeRate,
} from '../models/currencyModel';

export default function useConverterViewModel() {
  // Dados digitados e selecionados pelo usuário
  const [amount, setAmount] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');

  // Estados da aplicação
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Carrega as moedas quando o aplicativo inicia
  useEffect(() => {
    async function loadCurrencies() {
      try {
        const data = await getCurrencies();

        setCurrencies(data);

        // Confirma se as moedas iniciais estão disponíveis
        if (!data.some((currency) => currency.code === 'USD')) {
          setFromCurrency(data[0]?.code || '');
        }

        if (!data.some((currency) => currency.code === 'BRL')) {
          setToCurrency(data[1]?.code || data[0]?.code || '');
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar as moedas.');
      }
    }

    loadCurrencies();
  }, []);

  // Realiza a conversão
  async function handleConvert() {
    setError('');
    setResult(null);

    // Verifica se o campo foi preenchido
    const cleanedAmount = amount.trim();

    if (!cleanedAmount) {
      setError('Digite um valor para converter.');
      return;
    }

    // Aceita vírgula ou ponto como separador decimal,
    // mas não permite os dois na mesma entrada.
    if (!/^\d+([,.]\d+)?$/.test(cleanedAmount)) {
      setError('Digite um valor numérico válido. Exemplo: 10,50.');
      return;
    }

    const numericAmount = Number(
      cleanedAmount.replace(',', '.')
    );

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('O valor precisa ser maior que zero.');
      return;
    }

    if (!fromCurrency || !toCurrency) {
      setError('Selecione as moedas de origem e destino.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setError('Escolha moedas diferentes para converter.');
      return;
    }

    try {
      setLoading(true);

      // Consulta a taxa através do Model
      const exchange = await getExchangeRate(
        fromCurrency,
        toCurrency
      );

      // Calcula o resultado usando a taxa real
      const convertedAmount = numericAmount * exchange.rate;

      setResult({
        amount: numericAmount,
        from: exchange.base,
        to: exchange.quote,
        rate: exchange.rate,
        converted: convertedAmount,
        date: exchange.date,
      });
    } catch (err) {
      setError(
        err.message || 'Não foi possível realizar a conversão.'
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    amount,
    setAmount,
    currencies,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    onConvert: handleConvert,
    loading,
    error,
    result,
  };
}
