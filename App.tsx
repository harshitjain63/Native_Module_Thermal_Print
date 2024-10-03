import {View, StyleSheet, Text, Alert, Button} from 'react-native';
import React from 'react';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {useNetInfo} from '@react-native-community/netinfo';
import ThermalPrinterModule from 'react-native-thermal-printer';

const App = () => {
  const [wifiAddress, setWifiAddress] = React.useState('');

  const netInfo = useNetInfo();
  const getWifiAddress = React.useCallback(() => {
    try {
      if (netInfo.details && 'ipAddress' in netInfo.details) {
        setWifiAddress(netInfo.details.ipAddress as string);
      } else {
        Alert.alert('Wifi Not Available');
      }
    } catch (error) {
      console.log(error);
    }
  }, [netInfo.details]);

  React.useEffect(() => {
    getWifiAddress();
  }, [getWifiAddress, netInfo.isConnected]);

  //One Signal Code

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  OneSignal.initialize('b51a4c39-d728-4338-b117-6435fd2b3137');

  OneSignal.Notifications.requestPermission(true);

  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  // Thermal Print

  const Network = async () => {
    ThermalPrinterModule.defaultConfig.ip = wifiAddress;
    ThermalPrinterModule.defaultConfig.port = 9100;
    ThermalPrinterModule.defaultConfig.autoCut = false;
    ThermalPrinterModule.defaultConfig.timeout = 20000;
    try {
      await ThermalPrinterModule.printTcp({payload: 'Print Something'});
    } catch (error) {
      console.log((error as any).message);
    }
  };

  const Bluetooth = async () => {
    try {
      await ThermalPrinterModule.printBluetooth({
        payload: 'Print Using Bluetooth',
      });
    } catch (err) {
      console.log((err as any).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>hello</Text>
      <Button title="Bluetooth" onPress={Bluetooth} />
      <Button title="Network" onPress={Network} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
});

export default App;
