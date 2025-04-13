import React, {ReactElement, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';

import {BasicStyle, ITweet, RootState} from './../../../types';
import {Tweet} from './../../../features/Tweet/ui/Tweet';
import {useAppDispatch, useAppSelector} from './../../../hooks';
import {fetchUserTweets} from './../../../features/TweetList/state/tweets.thunk';
import {loadMoreTweets} from './../../../features/TweetList/state/tweets.slice';

interface ITweetListProps {
  tweets: Array<ITweet>;
}

function TweetListComponent({tweets}: ITweetListProps): ReactElement {
  const [refreshing, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const {displayedData, loading, error} = useAppSelector(
    (state: RootState) => state.tweets,
  );

  useEffect(() => {
    dispatch(fetchUserTweets(''));
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(loadMoreTweets());
  };

  const handleRefresh = () => {
    setLoading(true);
    dispatch(fetchUserTweets(''));
    setLoading(false);
  };

  if (loading && displayedData.length === 0) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        testID="loading-indicator"
      />
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        testID="flat-list"
        data={displayedData}
        renderItem={({item, index}: {item: ITweet; index: number}) => (
          <View testID="tweet-item">
            <Tweet key={index} tweet={item} />
          </View>
        )}
        keyExtractor={(_item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            testID="refresh-control"
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        maxToRenderPerBatch={5}
        initialNumToRender={5}
      />
    </View>
  );
}

const mapStateToProps = (state: RootState) =>
  ({
    tweets: state.tweets.data,
  } as ITweetListProps);

export const TweetList = connect(mapStateToProps)(TweetListComponent);

const styles: Partial<BasicStyle> = StyleSheet.create<Partial<BasicStyle>>({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
