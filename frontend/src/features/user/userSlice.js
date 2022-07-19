import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';


export const refreshTokens = createAsyncThunk('user/refreshTokens', async (options, thunkAPI) => {
    const { prevTokens } = options;

    try {
      const response = await fetch('http://127.0.0.1:8000/token/refresh/', {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
              'Authorization': `JWT ${prevTokens.access}`,
              'Content-Type': 'application/json',
              'accept': 'application/json'
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(prevTokens),
      });
      
      if (response.ok) {
          const newTokens = await response.json();
          return newTokens;
      }
      
      throw new Error(response.statusText);

    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue('rejected');
    }
})


export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loggedIn: localStorage.getItem('tokens') === null ? false : true,
    tokens: localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : {access: null, refresh: null},
    refreshTokensStatus: 'idle',
    error: null,
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
    },
    setTokens: (state, action) => {
      state.tokens = action.payload;
      localStorage.setItem('tokens', JSON.stringify(action.payload));
    }
  },
  extraReducers(builder) {
    builder
      .addCase(refreshTokens.pending, (state) => {
        state.refreshTokensStatus = 'loading';
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.refreshTokensStatus = 'succeeded'
        console.log("succeeded")
        console.log(action.payload)
        // Set tokens and logged in status
        localStorage.setItem('tokens', JSON.stringify(action.payload));
        state.tokens = action.payload;
        state.loggedIn = true;
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.refreshTokensStatus = 'failed';
        state.error = action.error.message;
        console.log("Failed to get tokens")
        console.log(action.error.message);
      })
  },
});

export const { setLoggedIn, setTokens } = userSlice.actions;

export const selectLoggedIn = (state) => state.user.loggedIn;
export const selectTokens = (state) => state.user.tokens;
export const selectRefreshTokensStatus = (state) => state.user.refreshTokensStatus;

export default userSlice.reducer;
