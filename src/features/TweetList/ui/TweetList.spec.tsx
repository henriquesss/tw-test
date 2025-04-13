import React from 'react';
import {render, fireEvent, RenderAPI} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {TweetList} from './TweetList';
import {fetchUserTweets} from './../../../features/TweetList/state/tweets.thunk';
import {loadMoreTweets} from './../../../features/TweetList/state/tweets.slice';
import {ITweet, RootState} from './../../../types';

jest.mock('./../../../features/TweetList/state/tweets.thunk', () => ({
  fetchUserTweets: jest.fn(),
}));

jest.mock('./../../../features/TweetList/state/tweets.slice', () => ({
  loadMoreTweets: jest.fn(),
}));

jest.mock('react-native-gesture-handler', () => {
  const {View} = require('react-native');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: require('react-native').FlatList,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});
jest.mock('./../../../features/Tweet/ui/Tweet', () => {
  const {View, Text} = require('react-native');
  return {
    Tweet: ({tweet}: {tweet: ITweet}) => (
      <View testID="tweet-wrapper">
        <Text>{tweet.content || ''}</Text>
      </View>
    ),
  };
});

// Configure mock store with types
type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;
const mockStore = configureStore<RootState, DispatchExts>([thunk]);

describe('TweetList Component', () => {
  let store: ReturnType<typeof mockStore>;

  // Updated mock tweets to match the new data structure
  const mockTweets: ITweet[] = [
    {
      key: 1,
      content: 'Tweet 1',
      images: [{url: 'https://example.com/image1.jpg'}],
      sender: {
        username: 'user1',
        nick: 'User One',
        avatar: 'https://example.com/avatar1.jpg',
      },
      comments: [
        {
          content: 'Comment 1',
          sender: {
            username: 'commenter1',
            nick: 'Commenter One',
            avatar: 'https://example.com/commenter1.jpg',
          },
        },
      ],
    },
    {
      key: 2,
      content: 'Tweet 2',
      sender: {
        username: 'user2',
        nick: 'User Two',
        avatar: 'https://example.com/avatar2.jpg',
      },
    },
    {
      key: 3,
      content: 'Tweet 3',
      images: [
        {url: 'https://example.com/image3-1.jpg'},
        {url: 'https://example.com/image3-2.jpg'},
      ],
      sender: {
        username: 'user3',
        nick: 'User Three',
        avatar: 'https://example.com/avatar3.jpg',
      },
      comments: [],
    },
    {
      key: 4,
      // No content field to test optional fields
      sender: {
        username: 'user4',
        nick: 'User Four',
        avatar: 'https://example.com/avatar4.jpg',
      },
    },
    {
      key: 5,
      content: 'Tweet 5 with many images',
      images: Array(9)
        .fill(0)
        .map((_, i) => ({url: `https://example.com/image5-${i + 1}.jpg`})),
      sender: {
        username: 'user5',
        nick: 'User Five',
        avatar: 'https://example.com/avatar5.jpg',
      },
    },
    {
      key: 6,
      content: 'Tweet 6',
      sender: {
        username: 'user6',
        nick: 'User Six',
        avatar: 'https://example.com/avatar6.jpg',
      },
      comments: [
        {
          content: 'Comment 1 on Tweet 6',
          sender: {
            username: 'commenter1',
            nick: 'Commenter One',
            avatar: 'https://example.com/commenter1.jpg',
          },
        },
        {
          content: 'Comment 2 on Tweet 6',
          sender: {
            username: 'commenter2',
            nick: 'Commenter Two',
            avatar: 'https://example.com/commenter2.jpg',
          },
        },
      ],
    },
    {
      key: 7,
      content: 'Tweet 7',
      sender: {
        username: 'user7',
        nick: 'User Seven',
        avatar: 'https://example.com/avatar7.jpg',
      },
    },
  ];

  beforeEach(() => {
    // Create the mock store with our tweet data
    store = mockStore({
      tweets: {
        data: mockTweets,
        displayedData: mockTweets.slice(0, 5),
        loading: false,
        error: null,
      },
    } as RootState);

    (fetchUserTweets as unknown as jest.Mock).mockReturnValue({
      type: 'tweets/fetchUserTweets',
    });
    (loadMoreTweets as unknown as jest.Mock).mockReturnValue({
      type: 'tweets/loadMoreTweets',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when loading and no tweets', () => {
    store = mockStore({
      tweets: {
        data: [],
        displayedData: [],
        loading: true,
        error: null,
      },
    } as unknown as RootState);

    const {getByTestId}: RenderAPI = render(
      <Provider store={store}>
        <TweetList />
      </Provider>,
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders error message when there is an error', () => {
    store = mockStore({
      tweets: {
        data: [],
        displayedData: [],
        loading: false,
        error: 'Failed to fetch tweets',
      },
    } as unknown as RootState);

    const {getByText}: RenderAPI = render(
      <Provider store={store}>
        <TweetList />
      </Provider>,
    );

    expect(getByText('Error: Failed to fetch tweets')).toBeTruthy();
  });

  it('renders tweets correctly', () => {
    const {getAllByTestId}: RenderAPI = render(
      <Provider store={store}>
        <TweetList />
      </Provider>,
    );

    const tweetItems = getAllByTestId('tweet-item');

    expect(tweetItems.length).toBe(5); // Initially shows 5 tweets
  });

  it('dispatches fetchUserTweets on component mount', () => {
    render(
      <Provider store={store}>
        <TweetList />
      </Provider>,
    );

    expect(fetchUserTweets).toHaveBeenCalledWith('');
  });

  it('dispatches loadMoreTweets when reaching the end of the list', async () => {
    const {getByTestId}: RenderAPI = render(
      <Provider store={store}>
        <TweetList />
      </Provider>,
    );

    // Simulate reaching the end of the list
    const flatList = getByTestId('flat-list');
    fireEvent(flatList, 'onEndReached');

    expect(loadMoreTweets).toHaveBeenCalled();
  });
});
