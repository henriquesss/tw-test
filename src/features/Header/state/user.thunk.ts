import {createAsyncThunk} from '@reduxjs/toolkit';

import {getRequest} from '../../../network/Network';
import {IUser} from '../../../types';
import {AxiosError} from 'axios';

export const fetchUser = createAsyncThunk(
  'user',
  async (username: string, thunkAPI) => {
    try {
      const response = await getRequest(`${username}.json`);
      if (response.status !== 200) {
        return thunkAPI.rejectWithValue({
          message: `Request error: ${response.status} code`,
          status: response.status
        });
      }
      return response.data as IUser;
    } catch (e) {
      const error = e as AxiosError;
      return thunkAPI.rejectWithValue({
        message: error.message || 'An error occurred',
        status: error.response?.status
      });
    }
  },
);
