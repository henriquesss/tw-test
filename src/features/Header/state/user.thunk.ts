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
          status: response.status,
        });
      }
      /*
      The API returns the profile image as 'profile-image', but we
      need to use 'profileImage' like the IUser interface.
      */
      const {'profile-image': profileImage, ...rest} = response.data;
      const transformedData = {...rest, profileImage};

      return transformedData as IUser;
    } catch (e) {
      const error = e as AxiosError;
      return thunkAPI.rejectWithValue({
        message: error.message || 'An error occurred',
        status: error.response?.status,
      });
    }
  },
);
