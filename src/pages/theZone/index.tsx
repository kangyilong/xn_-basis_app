import React from 'react';
import {StackActions, NavigationActions} from 'react-navigation';
import {
    View,
    ScrollView,
    Dimensions,
    RefreshControl
} from 'react-native';
import ZoneHeader from './component/zoneHeader';
import ZoneScroll from './component/zoneScroll';
import Loading from '@components/loading/Loading';
import NavigatorUtil from "@methods/NavigatorUtil";
import {agentActivity} from "@methods/api/theZone";
import {themeColor} from "@methods/config";
import {getMsg, saveMsg} from "@methods/util";

const {height} = Dimensions.get('window');
const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({
            routeName: 'TabsBtnNavigation'
        })
    ]
});

interface Props {
    navigation: any
}
export default class TheZone extends React.PureComponent<Props, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            isRefresh: false,
            refreshing: false,
            agentAmount: {},
            pageNum: 1,
        };
    }
    _navListener: any = null;
    _scrollRef: any = null;
    isScroll = true;
    _interout: any = null;
    onPackageScroll = (ev: any) => {
        ev.persist();
        if (this.isScroll) {
            if (this._interout) {
                clearTimeout(this._interout);
            }
            this._interout = setTimeout(() => {
                const {contentOffset} = ev.nativeEvent;
                let {pageNum} = this.state;
                if (contentOffset.y > (height / 2) * pageNum) {
                    this.isScroll = false;
                    this.setState({
                        pageNum: ++pageNum,
                    });
                }
            }, 300);
        }
    };
    _onRefresh = () => {
        this.isScroll = true;
        this.setState(
            {
                refreshing: true,
                pageNum: 1
            },
            () => {
                this.getAgentActivity();
            }
        );
    };
    getAgentActivity = () => {
        agentActivity().then((d: any) => {
            if (d.status !== '2') {
                NavigatorUtil.goPage('Authentication', {origin: 'zq'});
            }else {
                this.setState({
                    isRefresh: false,
                    isLoading: false,
                    refreshing: false,
                    agentAmount: d
                });
            }
        });
    };
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', async (ev: any) => {
            const isZone = await getMsg('isZone');
            const {lastState} = ev;
            if (!lastState && !isZone) {
                return this.props.navigation.dispatch(resetAction);
            }
            this.setState({
                isRefresh: true
            }, this.getAgentActivity);
        });
    }
    componentWillUnmount() {
        this._navListener && this._navListener.remove();
    }
    render() {
        const {navigation} = this.props;
        const {isLoading, agentAmount, pageNum, refreshing, isRefresh} = this.state;
        return <ScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            ref={(el) => (this._scrollRef = el)}
            onScroll={this.onPackageScroll}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            refreshControl={
                <RefreshControl
                    tintColor={themeColor}
                    colors={[themeColor]}
                    refreshing={refreshing}
                    onRefresh={this._onRefresh}
                />
            }
        >
            <View style={isLoading ? {display: 'none'} : {flex: 1}}>
                <ZoneHeader navigation={navigation} agentAmount={agentAmount}/>
                <ZoneScroll
                    navigation={navigation}
                    pageNum={pageNum}
                    refreshing={refreshing}
                    isRefresh={isRefresh}
                    resetPageNum={() => {
                        this.setState({
                            pageNum: 1,
                        });
                    }}
                    refreshOk={(isOk: boolean) => {
                        this.isScroll = isOk;
                    }}
                    scrollTopFn={() => {
                        this._scrollRef.scrollTo({x: 0, y: 0, animated: true});
                    }}
                />
            </View>
            <View style={isLoading ? {flex: 1} : {display: 'none'}}>
                <Loading
                    title={''}
                    size={'large'}
                />
            </View>
        </ScrollView>;
    }
}