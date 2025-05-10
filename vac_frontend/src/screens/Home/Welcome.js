// const BUDDHA_ASCII = `
//                    _ooOoo_
//                   o8888888o
//                   88" . "88
//                   (| -_- |)
//                   O\  =  /O
//                ____/`---'\____
//              .'  \\|     |//  `.
//             /  \\|||  :  |||//  \
//            /  _||||| -:- |||||-  \
//            |   | \\\  -  /// |   |
//            | \_|  ''\---/''  |   |
//            \  .-\__  `-`  ___/-. /
//          ___`. .'  /--.--\  `. . __
//       ."" '<  `.___\_<|>_/___.'  >'"".
//      | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//      \  \ `-.   \_ __\ /__ _/   .-` /  /
// ======`-.____`-.___\_____/___.-`____.-'======
//                    `=---='
// `;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW } from '../../styles/MyStyles';

const BUDDHA_ASCII = `
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/\`---'\____
             .'  \\||     ||//  \`.
            /  \\|||  :  |||//  \\
           /  _||||| -:- |||||-  \\
           |   | \\\\\\  -  /// |   |
           | \\_|  ''\\---/''  |   |
           \\  .-\\__  \`-´  ___/-. /
         ___\`. .'  /--.--\\  \`. . __
      ."" '<  \`.___\\_<|>_/___.'  >'"".
     | | :  \`- \\ \`.;\`\\ _ /\`;.\`/ - \` : | |
     \\  \\ \`-.   \\_ __\\ /__ _/   .-\` /  /
======\`-.____\`-.___\\_____/___.- \`____.- '======
                   \`=---='
`;

const BLESSING_TEXT = `
🙏God Bless🙏   🙏Never Crash🙏
`;

const Welcome = () => {
    const nav = useNavigation();
    const [progress, setProgress] = useState(1);
    const animatedWidth = useState(new Animated.Value(0))[0];
    const fadeAnim = useState(new Animated.Value(0))[0];
    const pulseAnim = useState(new Animated.Value(1))[0];

    const { width } = Dimensions.get('window');
    const barWidth = width * 0.8;

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    nav.navigate('Landing');
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        Animated.timing(animatedWidth, {
            toValue: barWidth,
            duration: 6000,
            useNativeDriver: false,
        }).start();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        return () => clearInterval(interval);
    }, [animatedWidth, barWidth, fadeAnim, pulseAnim]);

    return (
        <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.container}
        >
            <Animated.View style={[styles.asciiContainer, { opacity: fadeAnim }]}>
                <Text style={styles.asciiText}>{BUDDHA_ASCII}</Text>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.blessingText}>{BLESSING_TEXT}</Text>
            </Animated.View>
            <View style={[styles.loadingBarContainer, { width: barWidth }]}>
                <Animated.View
                    style={[
                        styles.loadingBar,
                        {
                            width: animatedWidth,
                        },
                    ]}
                >
                    <LinearGradient
                        colors={['#0f0', '#00ff99']}
                        style={styles.gradientBar}
                    />
                </Animated.View>
            </View>
            <Text style={styles.progressText}>💉{progress}%</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.medium,
    },
    asciiContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    asciiText: {
        fontFamily: 'Courier New',
        fontSize: 10,
        color: COLORS.white,
        textAlign: 'center',
        lineHeight: 12,
        textAlignVertical: 'center',
    },
    blessingText: {
        fontFamily: 'Courier New',
        fontSize: 14,
        color: COLORS.white,
        textAlign: 'center',
        marginVertical: SPACING.medium,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    loadingBarContainer: {
        height: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: BORDER_RADIUS.medium,
        overflow: 'hidden',
        ...SHADOW,
    },
    loadingBar: {
        height: '100%',
        borderRadius: BORDER_RADIUS.medium,
    },
    gradientBar: {
        flex: 1,
        borderRadius: BORDER_RADIUS.medium,
    },
    progressText: {
        fontFamily: 'Courier New',
        fontSize: FONT_SIZE.medium,
        color: COLORS.white,
        marginTop: SPACING.small,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
});

export default Welcome;