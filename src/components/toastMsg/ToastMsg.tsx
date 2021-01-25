import * as React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {connect} from 'react-redux';

const {height} = Dimensions.get('window');

function mapStateToProps(state: any) {
  return {
    toastMsg: state.showToastMsg.toastMsg,
  };
}

interface Props {
  toastMsg: string;
}
function ToastMsg(props: Props) {
  const {toastMsg} = props;
  if (!toastMsg) {
    return null;
  }
  /*
        <Image
                source={TOAST_WARNING}
                style={styles.toast_img}
            />
    * */
  return (
    <View style={styles.toast}>
      <View style={styles.toast_box}>
        <Text style={styles.toast_txt}>{toastMsg}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    zIndex: 99,
    left: 0,
    top: height / 4,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast_box: {
    maxWidth: 186,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  toast_img: {
    marginRight: 8,
    width: 16,
    height: 16,
    marginTop: 5,
  },
  toast_txt: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
});

export default connect(mapStateToProps)(ToastMsg);
