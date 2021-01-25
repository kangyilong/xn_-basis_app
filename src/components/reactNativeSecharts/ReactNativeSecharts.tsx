import * as React from 'react';
import {
    View,
} from 'react-native';
// @ts-ignore
import {Echarts, echarts} from 'react-native-secharts';

interface Props {
    option: any,
    height: number,
    width: number
}
export default function ReactNativeSecharts(props: Props) {
    const {option, height, width} = props;
    return (
        <View>
            <Echarts option={option} height={height} width={width}/>
        </View>
    )
}