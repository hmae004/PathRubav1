import { StyleSheet,Text,TextInput,View ,Button,ScrollView,Image} from "react-native";

export default function AcceptDetailsScreen({ route }) {
    const { request } = route.params;
  
    return (
      <View style={styles.container}>
        <Text>Block: {request.block}</Text>
        <Text>Room: {request.room} </Text>
        <Text>Name: {request.name}</Text>
        <Text>Phone: {request.phone}</Text>
        <Text>Place: {request.place}</Text>
        <Text>Order: {request.order.join(', ')}</Text>
        <Text>Profit: {request.profit}</Text>
        <Button title="Accept"/>
      </View>
    );

  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00FFFF',
    },
  });
  