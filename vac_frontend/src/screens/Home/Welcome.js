// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
// import { useNavigation } from "@react-navigation/native";

// // const BUDDHA_ASCII = `
// //                    _ooOoo_
// //                   o8888888o
// //                   88" . "88
// //                   (| -_- |)
// //                   O\  =  /O
// //                ____/`---'\____
// //              .'  \\|     |//  `.
// //             /  \\|||  :  |||//  \
// //            /  _||||| -:- |||||-  \
// //            |   | \\\  -  /// |   |
// //            | \_|  ''\---/''  |   |
// //            \  .-\__  `-`  ___/-. /
// //          ___`. .'  /--.--\  `. . __
// //       ."" '<  `.___\_<|>_/___.'  >'"".
// //      | | :  `- \`.;`\ _ /`;.`/ - ` : | |
// //      \  \ `-.   \_ __\ /__ _/   .-` /  /
// // ======`-.____`-.___\_____/___.-`____.-'======
// //                    `=---='
// // `;

// const BUDDHA_ASCII = `
//                    _ooOoo_
//                   o8888888o
//                   88" . "88
//                   (| -_- |)
//                   O\  =  /O
//                ____/\`---'\____
//              .'  \\||     ||//  \`.
//             /  \\|||  :  |||//  \\
//            /  _||||| -:- |||||-  \\
//            |   | \\\\\\  -  /// |   |
//            | \\_|  ''\\---/''  |   |
//            \\  .-\\__  \`-´  ___/-. /
//          ___\`. .'  /--.--\\  \`. . __
//       ."" '<  \`.___\\_<|>_/___.'  >'"".
//      | | :  \`- \\ \`.;\`\\ _ /\`;.\`/ - \` : | |
//      \\  \\ \`-.   \\_ __\\ /__ _/   .-\` /  /
// ======\`-.____\`-.___\\_____/___.- \`____.- '======
//                    \`=---='
// `;


// // Blessing text
// const BLESSING_TEXT = `
//        🙏God Bless🙏    🙏Never Crash🙏
// `;

// const Welcome = ({ }) => {
//     const nav = useNavigation();
//     const [progress, setProgress] = useState(1);
//     const animatedWidth = useState(new Animated.Value(0))[0];

//     // Screen dimensions for centering
//     const { width } = Dimensions.get('window');
//     const barWidth = width * 0.8;

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setProgress((prev) => {
//                 if (prev >= 100) {
//                     clearInterval(interval);
//                     nav.navigate('Landing');
//                     return 100;
//                 }
//                 return prev + 1;
//             });
//         }, 50);

//         Animated.timing(animatedWidth, {
//             toValue: barWidth,
//             duration: 5000,
//             useNativeDriver: false,
//         }).start();

//         return () => clearInterval(interval);
//     }, [animatedWidth, barWidth]);

//     return (
//         <View style={styles.container}>
//             <Text style={styles.asciiText}>{BUDDHA_ASCII}</Text>
//             <Text style={styles.blessingText}>{BLESSING_TEXT}</Text>
//             <View style={[styles.loadingBarContainer, { width: barWidth }]}>
//                 <Animated.View
//                     style={[
//                         styles.loadingBar,
//                         {
//                             width: animatedWidth,
//                         },
//                     ]}
//                 />
//             </View>
//             <Text style={styles.progressText}>{progress}%</Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#000',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     asciiText: {
//         fontFamily: 'Courier New',
//         fontSize: 10,
//         color: '#0f0',
//         textAlign: 'center',
//         lineHeight: 12,
//     },
//     blessingText: {
//         fontFamily: 'Courier New',
//         fontSize: 14,
//         color: '#0f0',
//         textAlign: 'center',
//         marginVertical: 20,
//     },
//     loadingBarContainer: {
//         height: 20,
//         backgroundColor: '#333',
//         borderRadius: 10,
//         overflow: 'hidden',
//     },
//     loadingBar: {
//         height: '100%',
//         backgroundColor: '#0f0',
//         borderRadius: 10,
//     },
//     progressText: {
//         fontFamily: 'Courier New',
//         fontSize: 16,
//         color: '#0f0',
//         marginTop: 10,
//     },
// });

// export default Welcome;