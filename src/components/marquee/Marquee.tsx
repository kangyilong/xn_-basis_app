import React from 'react';
// @ts-ignore
import {MarqueeVertical} from 'react-native-marquee-ab';

interface Props {
  textList: Array<any>;
  width: number;
  height: number;
  bgContainerStyle?: object;
  textStyle?: object;
  onTextClick?: Function;
}
export default function Marquee(props: Props) {
  const {
    textList,
    width,
    height,
    bgContainerStyle,
    textStyle,
    onTextClick,
  } = props;
  return (
    <MarqueeVertical
      textList={textList}
      width={width}
      height={height}
      direction={'up'}
      duration={800}
      speed={60}
      numberOfLines={1}
      bgContainerStyle={
        bgContainerStyle ? bgContainerStyle : {backgroundColor: 'transparent'}
      }
      textStyle={textStyle ? textStyle : {fontSize: 16, color: '#333'}}
      onTextClick={(item: any) => {
        onTextClick && onTextClick(item);
      }}
    />
  );
}
