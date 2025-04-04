import {  ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';

import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

import "./src/styles/global.css"
import { Home } from './src/screens/Home';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }
  return (
   <SafeAreaView className='flex-1 bg-background'>
    <Home />
    <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent/>
   </SafeAreaView>
  );
}


