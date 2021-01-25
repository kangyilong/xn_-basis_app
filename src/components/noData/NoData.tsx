import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {NO_DATA, NO_DATA_GRAY} from '@methods/requireImage';

interface Props {
  imgSrc?: any;
  noText?: string;
  paddingTop?: number;
  isGray?: Boolean;
  noPage?: Boolean;
}
export default function NoData(props: Props) {
  const {paddingTop, isGray, imgSrc} = props;
  return (
    <View style={paddingTop ? {paddingTop: paddingTop} : styles.no_data}>
      <View style={styles.image_box}>
        <Image
          style={styles.image}
          source={imgSrc ? imgSrc : isGray ? NO_DATA_GRAY : NO_DATA}
        />
      </View>
      {props.noText && (
        <View style={styles.no_box}>
          <Text style={styles.no_txt}>{props.noText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  no_data: {
    paddingTop: 30,
    alignItems: 'center',
  },
  image_box: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 107,
  },
  no_box: {
    marginTop: 15,
  },
  no_txt: {
    color: '#999999',
    fontSize: 14,
    textAlign: 'center',
  },
});
