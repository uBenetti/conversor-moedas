
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

export default function ConverterView({
  amount,
  setAmount,
  currencies,
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
  onConvert,
  onSwap,
  loading,
  error,
  result,
}) {
  function formatCurrency(value, currency) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(value);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Conversor de Moedas</Text>

      <Text style={styles.subtitle}>
        Consulte taxas de câmbio e converta valores entre diferentes moedas.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Valor para converter</Text>

        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Ex.: 100,00"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Moeda de origem</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={fromCurrency}
            onValueChange={setFromCurrency}
          >
            <Picker.Item label="Selecione uma moeda" value="" />

            {currencies.map((currency) => (
              <Picker.Item
                key={currency.code}
                label={`${currency.code} - ${currency.name}`}
                value={currency.code}
              />
            ))}
          </Picker>
        </View>

        <Pressable
          style={styles.swapButton}
          onPress={onSwap}
          disabled={!fromCurrency || !toCurrency || loading}
        >
          <Text style={styles.swapButtonText}>
            ⇅ Inverter moedas
          </Text>
        </Pressable>

        <Text style={styles.label}>Moeda de destino</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={toCurrency}
            onValueChange={setToCurrency}
          >
            <Picker.Item label="Selecione uma moeda" value="" />

            {currencies.map((currency) => (
              <Picker.Item
                key={currency.code}
                label={`${currency.code} - ${currency.name}`}
                value={currency.code}
              />
            ))}
          </Picker>
        </View>

        <Pressable
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={onConvert}
          disabled={loading || currencies.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Converter</Text>
          )}
        </Pressable>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
      </View>

      {result ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>
            Resultado da conversão
          </Text>

          <Text style={styles.originalValue}>
            {formatCurrency(result.amount, result.from)}
            {' → '}
            {result.to}
          </Text>

          <Text style={styles.resultValue}>
            {formatCurrency(result.converted, result.to)}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.information}>
            Taxa utilizada: 1 {result.from} ={' '}
            {result.rate.toLocaleString('pt-BR', {
              maximumFractionDigits: 6,
            })}{' '}
            {result.to}
          </Text>

          <Text style={styles.information}>
            Data de referência: {result.date}
          </Text>
        </View>
      ) : null}

      <Text style={styles.footer}>
        Taxas de referência fornecidas pela Frankfurter API.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F5F7',
    padding: 20,
    paddingTop: 45,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#202938',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#687386',
    lineHeight: 21,
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1E5EB',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#303B4B',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D5DAE1',
    borderRadius: 7,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#202938',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D5DAE1',
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 5,
  },
  swapButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#EAF0F8',
    borderRadius: 6,
  },
  swapButtonText: {
    color: '#2457A6',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    height: 48,
    backgroundColor: '#2457A6',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#C0392B',
    fontSize: 14,
    marginTop: 15,
    lineHeight: 20,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E2EF',
    borderRadius: 10,
    padding: 18,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#202938',
    marginBottom: 15,
  },
  originalValue: {
    fontSize: 14,
    color: '#687386',
  },
  resultValue: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#2457A6',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E5EB',
    marginVertical: 15,
  },
  information: {
    fontSize: 13,
    color: '#596579',
    marginBottom: 7,
  },
  footer: {
    textAlign: 'center',
    color: '#7B8492',
    fontSize: 12,
    marginTop: 25,
    marginBottom: 20,
  },
});
