import React from 'react';
import {
  Text,
  Animated,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

interface Props {
  modalVisible: boolean;
  getCameraValue: Function;
  closeModal: Function;
}
class ScanScreen extends React.PureComponent<Props, any> {
  state = {
    moveAnim: new Animated.Value(0),
  };
  _AnimRef: any = null;
  componentDidMount() {
    this.startAnimation();
  }
  startAnimation = () => {
    const {moveAnim} = this.state;
    moveAnim.setValue(-200);
    this._AnimRef = Animated.timing(
      moveAnim,
      // @ts-ignore
      {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      },
    ).start(() => this.startAnimation());
  };
  //  识别二维码
  // @ts-ignore
  onBarCodeRead = (result) => {
    const {data} = result;
    this.props.getCameraValue(data);
  };

  render() {
    const {modalVisible, closeModal} = this.props;
    return (
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onBarCodeRead={this.onBarCodeRead}>
          <TouchableOpacity
            style={styles.rectangleContainer}
            activeOpacity={1}
            onPress={() => {
              this._AnimRef && this._AnimRef.stop();
              closeModal();
            }}>
            <TouchableOpacity
              style={styles.rectangle}
              activeOpacity={1}
              onPress={(ev) => {
                ev.stopPropagation();
              }}
            />
            <Animated.View
              style={[
                styles.border,
                {transform: [{translateY: this.state.moveAnim}]},
              ]}
            />
            <Text style={styles.rectangleText}>
              将二维码放入框内，即可自动扫描
            </Text>
          </TouchableOpacity>
        </RNCamera>
      </Modal>
    );
  }
}

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 200,
    width: 200,
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10,
  },
  border: {
    flex: 0,
    width: 200,
    height: 2,
    backgroundColor: '#00FF00',
  },
});
