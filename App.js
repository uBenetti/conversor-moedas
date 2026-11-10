
import { StatusBar } from 'expo-status-bar';

import ConverterView from './src/views/ConverterView';
import useConverterViewModel from './src/viewmodels/useConverterViewModel';

export default function App() {
  const viewModel = useConverterViewModel();

  return (
    <>
      <StatusBar style="dark" />
      <ConverterView {...viewModel} />
    </>
  );
}
