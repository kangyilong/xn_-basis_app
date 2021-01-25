import React, {useState, useEffect} from 'react';
import {View, Image, Dimensions, Linking} from 'react-native';
// @ts-ignore
// import BetterBanner from 'react-native-better-banner';
import BetterBanner from 'kcos-rn-swiper';
// @ts-ignore
import NavigatorUtil from '@methods/NavigatorUtil';
import {delImgQuality} from '@methods/util';

const {width} = Dimensions.get('window');

interface Props {
  swiperWidth?: number;
  swiperHeight: number;
  borderRadius?: number;
  indicatorWidth?: number;
  autoplayTimeout: number;
  swiperData: Array<any>;
  isButtons?: boolean;
  isDot?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  activeDot?: Function;
}
export default function SwiperComponent(props: Props) {
  const [bannerList, setBannerList] = useState([]);
  const {
    swiperWidth = width,
    borderRadius = 0,
    indicatorWidth = 6,
    swiperData = [],
    swiperHeight,
    autoplayTimeout,
    autoplay,
  } = props;
  useEffect(() => {
    const list: any = swiperData.map((item: any) => (
      <Image
        key={item.id}
        style={{width: swiperWidth, borderRadius, height: swiperHeight}}
        height={swiperHeight}
        source={
          item.source ? item.source : {uri: delImgQuality(item.pic.trim())}
        }
        resizeMode="cover"
      />
    ));
    setBannerList(list);
  }, [swiperData, swiperHeight, swiperWidth, borderRadius]);
  return (
    <View style={{height: swiperHeight}}>
      {bannerList.length > 0 && (
        <BetterBanner
          bannerHeight={swiperHeight}
          bannerComponents={bannerList}
          isSeamlessScroll={true}
          isAutoScroll={autoplay}
          scrollInterval={autoplayTimeout * 1000}
          indicatorWidth={indicatorWidth}
          onPress={(index: number, key: string) => {
            const item: any =
              swiperData.filter((it: any) => it.id === key)[0] || {};
            if (item.action === '1') {
              Linking.openURL(item.url);
            } else if (item.action === '2') {
              const ll = item.url.split('?');
              const cs = ll[1] || '';
              const params: any = {};
              if (cs) {
                cs.split('&').forEach((it: any) => {
                  const stl = it.split('=');
                  params[stl[0]] = stl[1];
                });
              }
              NavigatorUtil.goPage(ll[0], params);
            }
          }}
        />
      )}
    </View>
  );
}

/*
    <Swiper
                showsButtons={isButtons}
                autoplay={autoplay}
                loop={loop}
                autoplayTimeout={autoplayTimeout}
                removeClippedSubviews={false}
                showsPagination={isDot}
                dot={<View style={{
                    backgroundColor: '#ccc',
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    marginRight: 9,
                    marginTop: 9,
                    marginBottom: 0,
                }}/>}
                activeDot={activeDot ? activeDot() : <View style={{    //选中的圆点样式
                    backgroundColor: '#007aff',
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    marginRight: 9,
                    marginTop: 9,
                    marginBottom: 0,
                }}/>}
            >
                {
                    Array.isArray(swiperData) && swiperData.map((item, index) => (
                        <TouchableHighlight
                            key={index}
                            underlayColor="transparent"
                            activeOpacity={0.9}
                            onPress={() => {
                                if (item.action === '1') {
                                    Linking.openURL(item.url);
                                }else if (item.action === '2') {
                                    NavigatorUtil.goPage(item.url);
                                }
                            }}
                        >
                            <Image
                                style={styles.slide}
                                height={props.swiperHeight}
                                source={{uri: `${qiniuDomain}/${item.pic}`}}
                                resizeMode='cover'
                            />
                        </TouchableHighlight>
                    ))
                }
            </Swiper>
* */
