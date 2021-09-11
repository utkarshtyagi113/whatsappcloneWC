import React,{useState} from 'react'
import { View, Text, Image, StyleSheet, Dimensions, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import auth from '@react-native-firebase/auth';  

export default function LoginScreen({navigation}) {
    const [email,setEmail]= useState('')  
    const [password,setPassword]= useState(null)
    const [loading,setLoading] = useState(false)
    
    if(loading){
       return <ActivityIndicator size="large" color="#00ff00" />
    }
    
    const userLogin = async () => {
      setLoading(true)
      if(!email || !password){
            alert('please add all the fields')
            return
      }    
      try{  
      const result = await auth().signInWithEmailAndPassword(email,password)
      setLoading(false)
    }catch(err){
      alert('something went wrong')
    }
    }

    return (
        <KeyboardAvoidingView behavior='position'>
          <View style={styles.box1}>
            <Text style={styles.text}>Welcome To Whatsapp 5.0</Text>
            <Image style={styles.img} source={require('../assets/wa.png')} />
            <View style={styles.box2}>
               <TextInput 
                label= 'Email'
                value={email}
                mode='outlined'
                onChangeText={(text) => setEmail(text)}
               />
               <TextInput 
                label= 'Password'
                value={password}
                mode='outlined'
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
               />
              
              <Button 
               mode='contained'
               onPress={() => userLogin()}>
                 Login
              </Button>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}><Text style={{textAlign: 'center'}}>Don't have an account ?</Text></TouchableOpacity>
            </View>
           </View>
       </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({

    text: {
      fontSize: 22,
      color: 'green',
      margin: 10,
    },

    img: {
      height: 200,
      width: 200,
    },

    box1: {
        alignItems: 'center',
    },

    box2: {
      width: Dimensions.get('window').width,
      height: '50%',
      padding: 10,
      justifyContent: 'space-evenly',
    }
  
  });