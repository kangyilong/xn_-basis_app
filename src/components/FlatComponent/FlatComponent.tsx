import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, Text, RefreshControl, Dimensions} from 'react-native';
import NoData from '@components/noData/NoData';
import Loading from '@components/loading/Loading';
import {themeColor} from '@methods/config';

const {height} = Dimensions.get('window');
const HM = height / 667;

interface Props {
  getFlatQuery?: Function; // 分页查接口
  dealWithFn: Function; // 处理每一条的数据
  initializeCallbackFn?: Function; // 执行完前提后请求，例：请求完系统参数后
  queryCallbackFn?: Function; // 查询成功后的回调
  refreshCallbackFn?: Function; // 下拉刷新的回调
  renderItem: Function;
  params?: any;
  isChangeParams?: boolean; // 是否重新请求
  refreshControlTitle?: string;
  initData?: Array<any>; // 初始数据源
  style?: any;
  isDeal?: boolean; // 是否使用dealWithFn方法处理数据
  noText?: string;
  imgSrc?: string; // 暂无数据的图片
  emptyTop?: number;
  isResetLoading?: boolean;
  backListName?: string; // 取分页查中的哪个字段，默认list
  horizontal?: boolean;
  numColumns?: number;
}

export default function FlatComponent(props: Props) {
  const {
    getFlatQuery,
    dealWithFn,
    initializeCallbackFn,
    queryCallbackFn,
    refreshCallbackFn,
    renderItem,
    params = {},
    isChangeParams = false,
    refreshControlTitle = '',
    initData = [],
    style = {},
    isDeal = true,
    noText = '暂无记录',
    imgSrc = '',
    emptyTop = 90,
    isResetLoading = true,
    backListName = 'list',
    horizontal = false,
    numColumns = 1,
  } = props;
  const [isFirst, setIsFirst] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isReset, setIsReset] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoadOk, setIsLoadOk] = useState(false);
  const [config, setConfig] = useState(params);
  const [flatData, setFlatData] = useState(initData);
  const _onRefreshing = useCallback(() => {
    setIsRefreshing(true);
    setIsReset(true);
    setConfig({
      ...config,
      pageNum: 1,
    });
    refreshCallbackFn && refreshCallbackFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);
  const _upEndReached = useCallback(() => {
    if (isLoadOk && !isEnd) {
      setIsLoading(true);
      setIsLoadOk(false);
      setIsReset(false);
      setConfig({
        ...config,
        pageNum: ++config.pageNum,
      });
    }
  }, [isEnd, isLoadOk, config]);
  const _getFlatData = useCallback(() => {
    getFlatQuery &&
      getFlatQuery(config, isShowLoading).then(async (data: any) => {
        if (data.pages < config.pageNum) {
          if (config.pageNum < 2 && data[backListName].length === 0) {
            setFlatData([]);
          }
          setIsEnd(true);
        } else {
          setIsEnd(false);
          const arr = [],
            list = data[backListName];
          if (isDeal) {
            for (let i = 0, len = list.length; i < len; i++) {
              arr.push(await dealWithFn(list[i]));
            }
          }
          const ll = isReset
            ? isDeal
              ? arr
              : list
            : isDeal
            ? [...flatData, ...arr]
            : [...flatData, ...list];
          setFlatData(ll);
          queryCallbackFn && queryCallbackFn(ll);
        }
        setIsReset(false);
        setIsLoading(false);
        setIsLoadOk(true);
        setIsRefreshing(false);
        setIsShowLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReset, flatData, config, isShowLoading]);
  useEffect(() => {
    if (!isFirst) {
      setIsReset(true);
      setIsRefreshing(true);
      setConfig({
        ...params,
        pageNum: 1,
      });
      isResetLoading && setIsShowLoading(true);
    } else {
      setIsFirst(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChangeParams]);
  useEffect(() => {
    if (typeof initializeCallbackFn === 'function') {
      initializeCallbackFn().then(() => {
        _getFlatData();
      });
    } else {
      _getFlatData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);
  return (
    <FlatList
      style={{flex: 1, minHeight: 300 + emptyTop, ...style}}
      horizontal={horizontal}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <NoData noText={noText} imgSrc={imgSrc} paddingTop={emptyTop * HM} />
      }
      data={flatData}
      renderItem={({item}) => renderItem(item)}
      refreshControl={
        <RefreshControl
          title={refreshControlTitle}
          refreshing={isRefreshing}
          onRefresh={() => {
            _onRefreshing();
          }}
          colors={[themeColor]}
          tintColor={themeColor}
        />
      }
      refreshing={isRefreshing}
      onEndReached={() => {
        _upEndReached();
      }}
      onEndReachedThreshold={0.2}
      ListFooterComponent={() =>
        isLoading ? (
          <Loading
            title="正努力加载中..."
            style={{paddingTop: 10, marginBottom: 50}}
          />
        ) : (isEnd && flatData.length > 0) || flatData.length === 1 ? (
          <Text
            style={{
              marginBottom: 50,
              marginTop: 25,
              textAlign: 'center',
              fontSize: 14,
              color: themeColor,
            }}
          />
        ) : null
      }
    />
  );
}
/*
isLoading
                ? <Loading title='正努力加载中...' style={{paddingTop: 10, marginBottom: 50}}/>
                : ((isEnd && flatData.length > 0) || flatData.length === 1)
                ? <Text
                    style={{
                        marginBottom: 50,
                        marginTop: 25,
                        textAlign: 'center',
                        fontSize: 14,
                        color: themeColor
                    }}>我也是有底线的~~
                </Text>
                : null
* */
