import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import MapView, { Callout, Marker } from 'react-native-maps';

export default function CustomMarker({ coordinate, title, image }) {
//   return (
//     <Marker coordinate={{
//         latitude: 10.7765588,
//         longitude: 106.6904755,
//     }}>
//         <View style={styles.markerContainer}>
//             <Image source={image} style={styles.markerImage} />
//         </View>
//         <Callout tooltip>
//           <View>
//             <Text>{title}</Text>
//           </View>
//         </Callout>
//       </Marker>
//   )
  return (
    <Marker coordinate={coordinate}>
      <View style={styles.markerContainer}>
        <Image source={image} style={styles.markerImage} />
      </View>
      <Callout tooltip>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutText}>{title}</Text>
        </View>
      </Callout>
    </Marker>
  )
}

const styles = StyleSheet.create({
    markerImage: {
      width: '100%', 
      height: '100%', 
    },
    markerContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        // position: 'absolute',
        // top: 120,
        borderColor: '#FF0',
        borderWidth: 4,
        backgroundColor: 'blue',
        overflow: 'hidden'
    }
  });