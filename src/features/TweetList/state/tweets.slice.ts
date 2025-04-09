import {ActionReducerMapBuilder, createSlice} from '@reduxjs/toolkit';
import {ITweet, RequestStatus} from '../../../types';
import {fetchUserTweets} from './tweets.thunk';

interface ITweetsState {
  data: Array<ITweet>;
  displayedData: Array<ITweet>;
  page: number;
  loading: boolean;
  error: string | null;
  status: RequestStatus;
}

const initialState: ITweetsState = {
  data: [],
  displayedData: [],
  page: 1,
  loading: false,
  error: null,
  status: RequestStatus.IDLE,
};

const tweetsSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    loadMoreTweets: (state) => {
      const tweetsPerPage = 5;
      const nextPage = state.page + 1;
      const endIndex = nextPage * tweetsPerPage;
      
      // Only update if we actually have more tweets to show
      if (state.displayedData.length < state.data.length) {
        state.displayedData = state.data.slice(0, endIndex);
        state.page = nextPage;
        console.log(`Updated to page ${nextPage}, showing ${state.displayedData.length} tweets`);
      }
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<ITweetsState>) => {
    builder.addCase(fetchUserTweets.pending, nextState => {
      // nextState.data = [];
      nextState.loading = true;
      nextState.error = null;
      nextState.status = RequestStatus.PENDING;
    });
    builder.addCase(fetchUserTweets.fulfilled, (nextState, action) => {
      nextState.loading = false;
      nextState.data = action.payload;
      nextState.displayedData = action.payload.slice(0, 5);
      nextState.page = 1;
      nextState.status = RequestStatus.SUCCESSFULL;
    });
    builder.addCase(fetchUserTweets.rejected, nextState => {
      nextState.loading = false;
      nextState.error = 'Failed to fetch tweets';
      nextState.status = RequestStatus.FAILED;
    });
  },
});

export const { loadMoreTweets } = tweetsSlice.actions;
export default tweetsSlice.reducer;
