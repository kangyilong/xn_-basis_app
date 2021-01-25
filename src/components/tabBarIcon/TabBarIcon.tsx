import React from 'react';
import {Image} from 'react-native';

export default function TabBarIcon({source, style = {}}: any) {
    return <Image
        source={source}
        style={style}
    />
}