import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Crypto} from '../models/crypto';
import {socket} from '../App';

export const HomeScreen = ({navigation}: {navigation: any}) => {
  const [cryptoList, setCryptoList] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    socket.on('crypto', data => {
      setCryptoList(data);
    });
    setIsLoaded(true);
  }, []);

  const openCryptoDetails = (id: string) => {
    navigation.navigate('Detail', {id: id});
  };

  const renderItem = ({item}: {item: Crypto}) => {
    return (
      <Pressable
        style={styles.crypto}
        onPress={() => openCryptoDetails(item.id)}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{Math.round(item.price * 1000) / 1000}</Text>
      </Pressable>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {isLoaded && (
          <FlatList
            data={cryptoList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272d42',
  },
  crypto: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#000',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  name: {
    color: '#fff',
    fontSize: 24,
  },
  price: {
    color: '#ffab00',
    fontSize: 24,
  },
});
