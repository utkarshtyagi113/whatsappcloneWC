import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen'
import auth from '@react-native-firebase/auth' 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ChatScreen from './src/screens/ChatScreen';
import firestore from '@react-native-firebase/firestore'
import AccountScreen from './src/screens/AccountScreen';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'green',  
  },
}; 

const Stack = createStackNavigator();

const Navigation = () => {
  const [user,setUser] = useState('')
  useEffect(() => {
    const unregister =  auth().onAuthStateChanged(userExist=>{
      if(userExist){
       
        firestore().collection('users')
        .doc(userExist.uid)
        .update({
          status:"online"
        })
        setUser(userExist)


      } 
 
      else setUser("")
    })

    return ()=>{
      unregister()
    } 
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTintColor: 'green'}}> 
        {user? 
        <>
        <Stack.Screen name="Home"  options={{title: 'WhatsApp'}} >
          {props => <HomeScreen {...props}  user={user} />} 
        </Stack.Screen>
        <Stack.Screen name="Chat"  options={({ route }) => ({ title: <View><Text>{route.params.name}</Text><Text>{route.params.status}</Text></View> })} >
          {props => <ChatScreen {...props} user={user}/>}
        </Stack.Screen>
        <Stack.Screen name="Account" >
          {props => <AccountScreen {...props} user={user}/>}
        </Stack.Screen>  
        </>
        :
        <>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown: false}} />
        </>
        } 

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  return(
    <>
     <PaperProvider theme={theme}> 
       <StatusBar barStyle='light-content' backgroundColor='green' />
       <View style={styles.container}>
         <Navigation />
       </View>
     </PaperProvider>
    </>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
  },

});

export default App;