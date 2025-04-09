import {createAsyncThunk} from '@reduxjs/toolkit';

import {getRequest} from '../../../network/Network';
import {ITweet} from '../../../types';
import {AxiosError} from 'axios';

export const fetchUserTweets = createAsyncThunk(
  'userTweets',
  async (username: string, thunkAPI) => {
    try {
      const response = await getRequest("tweets.json");
      let tweets: Array<ITweet> = [];

      if (username !== "") {
        tweets = response.data.filter(
          (tweet: ITweet) => tweet.sender?.username === username,
        );
      } else {
        tweets = response.data;
      }

      if (tweets.length === 0) {
        return thunkAPI.rejectWithValue({
          message: `No tweets found for user: ${username}`,
          status: response.status
        });
      }

      if (response.status !== 200) {
        return thunkAPI.rejectWithValue({
          message: `Request error: ${response.status} code`,
          status: response.status
        });
      }
      return tweets as Array<ITweet>;
    } catch (e) {
      const error = e as AxiosError;
      return thunkAPI.rejectWithValue({
        message: error.message || 'An error occurred',
        status: error.response?.status
      });
    }
  },
);
