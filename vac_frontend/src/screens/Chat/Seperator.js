import React from 'react';
import { View, StyleSheet } from 'react-native';

import commonStyles, { COLORS } from '../../styles/MyStyles';

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    backgroundColor: COLORS.border,
    height: StyleSheet.hairlineWidth,
  },
});

export default Separator;