import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '../consts/app-consts';
import RenderHtml from 'react-native-render-html';
import {CryptoProfileInit} from '../models/crypto';
import {CryptoMarketDataInit} from '../models/crypto';

export const DetailScreen = ({route}: {route: any}) => {
  const id = route.params.id;
  const {width} = useWindowDimensions();
  const [cryptoProfile, setCryptoProfile] = useState(CryptoProfileInit);
  const [cryptoMarketData, setCryptoMarketData] =
    useState(CryptoMarketDataInit);
  const [cryptoDataLoaded, setCryptoDataLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/cryptos/market-data/${id}`),
      axios.get(`${API_URL}/cryptos/profile/${id}`),
    ]).then(([resMarketData, resProfile]) => {
      setCryptoMarketData(resMarketData.data);
      setCryptoProfile(resProfile.data);
      setCryptoDataLoaded(true);
    });
  }, []);

  const convert = (price: number) => {
    return Math.round(price * 10) / 10;
  };

  return (
    <>
      {cryptoDataLoaded && (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{cryptoProfile.name}</Text>
              <Text style={styles.symbol}>{cryptoProfile.symbol}</Text>
              <Text style={styles.price}>
                {`$ ${convert(cryptoMarketData.market_data.price_usd)}`}
              </Text>
            </View>
            <View style={styles.headerTagLine}>
              <Text style={styles.line}>
                {cryptoProfile.profile.general.overview.tagline}
              </Text>
            </View>
          </View>
          <View style={styles.priceChanges}>
            <View style={styles.priceChangeRow}>
              <Text style={styles.line}>Percent Change 1h</Text>
              <Text style={styles.line}>
                {` % ${convert(
                  cryptoMarketData.market_data.percent_change_usd_last_1_hour,
                )}`}
              </Text>
            </View>
            <View style={styles.priceChangeRow}>
              <Text style={styles.line}>Percent Change 24h</Text>
              <Text style={styles.line}>
                {` % ${convert(
                  cryptoMarketData.market_data.percent_change_usd_last_24_hours,
                )}`}
              </Text>
            </View>
          </View>
          <ScrollView style={styles.cryptoInfo}>
            <View style={styles.cryptoInfoRow}>
              <Text style={styles.cryptoInfoTitle}>Overview</Text>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `<p style="color: #fff">${cryptoProfile.profile.general.overview.project_details}</p>`,
                }}
              />
            </View>
            <View style={styles.cryptoInfoRow}>
              <Text style={styles.cryptoInfoTitle}>Background</Text>

              <RenderHtml
                contentWidth={width}
                source={{
                  html: `<p style="color: #fff">${cryptoProfile.profile.general.background.background_details}</p>`,
                }}
              />
            </View>
          </ScrollView>
        </View>
      )}

      {!cryptoDataLoaded && (
        <View>
          <ActivityIndicator size="large" color="#ffab00" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#272d42',
    flex: 1,
    padding: 10,
  },
  header: {
    backgroundColor: '#000',
    height: 100,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTagLine: {
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 30,
    color: '#f7f7f7',
  },
  symbol: {
    fontSize: 20,
    padding: 5,
    backgroundColor: '#272d42',
    color: '#fff',
  },
  price: {
    fontSize: 28,
    width: 150,
    color: '#ffab00',
    textAlign: 'right',
  },
  line: {
    color: '#f7f7f7',
    fontSize: 16,
  },
  priceChanges: {
    backgroundColor: '#000',
    height: 70,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  priceChangeRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cryptoInfo: {
    backgroundColor: '#000',
    padding: 10,
    flex: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
  cryptoInfoTitle: {
    color: '#ffab00',
    fontSize: 22,
    marginBottom: 5,
  },
  cryptoInfoRow: {
    flex: 1,
    marginBottom: 25,
  },
});
