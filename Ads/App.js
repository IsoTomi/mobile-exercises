import React from 'react';
import { AppLoading } from 'expo';
import { Container, Header, Content, Text, Footer, Card, CardItem, Button } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'expo-ads-admob';

const BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";
const REWARDED_ID = "ca-app-pub-3940256099942544/5224354917";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      rewards: 0,
    };
  }

  showInterstitial = async () => {
    try {
      await AdMobInterstitial.requestAdAsync()
      await AdMobInterstitial.showAdAsync()
    } catch (error) {
      console.error(error)
    }
  }

  showRewarded = async () => {
    try {
      await AdMobRewarded.requestAdAsync()
      await AdMobRewarded.showAdAsync()
    } catch (error) {
      console.error(error)
    }
  }

  async componentDidMount() {
    AdMobInterstitial.setAdUnitID(INTERSTITIAL_ID);
    AdMobRewarded.setAdUnitID(REWARDED_ID);
    AdMobRewarded.addEventListener("rewardedVideoDidRewardUser", () => {
        let reward = this.state.rewards + 10;
        this.setState({rewards: reward});
      }
    );
    
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Container>
        <Content>
          <Card transparent style={{marginTop: 20, alignItems: 'center'}}>
            <CardItem >
              <Button 
                style={{flex: 1, justifyContent: 'center'}}
                onPress={this.showInterstitial}>
                  <Text>Show a interstitial</Text>
              </Button>
            </CardItem>
            <CardItem>
              <Button 
                style={{flex: 1, justifyContent: 'center'}}
                onPress={this.showRewarded}>
                  <Text>Show a rewarded video</Text></Button>
            </CardItem>
            <CardItem>
              <Text>Rewarded count: {this.state.rewards}</Text>
            </CardItem>
          </Card>
        </Content>
        <Footer>
        <AdMobBanner
          bannerSize="banner"
          adUnitID={BANNER_ID} />
        </Footer>
        
      </Container>
    );
  }
}
