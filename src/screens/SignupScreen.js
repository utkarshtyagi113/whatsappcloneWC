import React,{useState} from 'react'
import { View, Text, Image, StyleSheet, Dimensions, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';  
import firestore from '@react-native-firebase/firestore';

export default function SignupScreen({navigation}) {
    const [email,setEmail]= useState('')
    const [name,setName]= useState('')  
    const [password,setPassword]= useState('')
    const [image,setImage] = useState(null)
    const [shownext,setShowNext]= useState(false)
    const [loading,setLoading] = useState(false)
    
    if(loading){
       return <ActivityIndicator size="large" color="#00ff00" />
    }

    const userSignup = async () => {
      setLoading(true)
      if(!email || !password || !image ||!name){
            alert('please add fields')
            return
      }    
      try{  
      const result = await auth().createUserWithEmailAndPassword(email,password)
      firestore().collection('users').doc(result.user.uid).set({
        name: name,
        email: result.user.email,
        uid: result.user.uid,
        pic: image,
      })
      setLoading(false)
    }catch(err){
      alert('something went wrong')
    }
    } 

    const pickImageAndUpload = () => {
      launchImageLibrary({quality: 0.5}, (fileobj) => {
        //console.log(fileobj)
       const uploadTask = storage().ref().child(`/userprofile/${Date.now()}`).putFile(fileobj.assets[0].uri)
       uploadTask.on('state_changed', 
       (snapshot) => {

         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         if(progress==100) alert('image uploaded')
    
       }, 
       (error) => {
          alert('error uploading image')  
       }, 
       () => {
         // Handle successful uploads on complete
         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
         uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
           setImage(downloadURL)
         });
       }
       ); 
      })
    } 

    return (
        <KeyboardAvoidingView behavior='position'>
          <View style={styles.box1}>
            <Text style={styles.text}>Welcome To Whatsapp 5.0</Text>
            <Image style={styles.img} source={require('../assets/wa.png')} />
          </View>  
            <View style={styles.box2}>
              {!shownext &&
               <>
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
               </>
              }
               
              {shownext ?
              <>
              <TextInput 
                label= 'Name'
                value={name}
                mode='outlined'
                onChangeText={(text) => setName(text)}
              />

              <Button 
               mode='contained'
               onPress={() => pickImageAndUpload()}>
                  Select profile pic
              </Button>
              <Button 
               mode='contained'
               disabled={image?false:true}
               onPress={() => userSignup()}>
                  Signup
              </Button>
              </>
              :
              <Button 
               mode='contained'
               onPress={() => setShowNext(true)}>
                  Next
              </Button>
            }
            <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{textAlign: 'center'}}>Already have an account ?</Text></TouchableOpacity>
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