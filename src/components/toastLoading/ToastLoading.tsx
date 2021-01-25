import * as React from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {themeColor} from '@methods/config';

const {width, height} = Dimensions.get('window');

function mapStateToProps(state: any) {
  return {
    isShowLoading: state.showToastMsg.isShowLoading,
  };
}

interface Props {
  isShowLoading: boolean;
}
function ToastLoading(props: Props) {
  const isShowLoading = props.isShowLoading;
  if (!isShowLoading) {
    return null;
  }
  return (
    <View style={styled.loadBox}>
      <ActivityIndicator size="large" color={themeColor} animating={true} />
    </View>
  );
}

const styled = StyleSheet.create({
  loadBox: {
    position: 'absolute',
    top: height / 3 - 30,
    right: width / 2 - 20,
  },
  loadText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
});
export default connect(mapStateToProps)(ToastLoading);
