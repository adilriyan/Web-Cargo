import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://cargoserver.onrender.com/clients";

//  Fetch Clients (GET)
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch clients");
    }
  }
);

const clientSlice = createSlice({
  name: "clients",
  initialState: {
    list: [],
    dummyList: [],
    loading: false,
    error: null,
  },
  reducers: {
     searchclients:(state,action)=>{
            state.list=state.dummyList.filter(items=>items.name.toLowerCase().includes(action.payload))
        }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        state.dummyList = action.payload || [];
        // console.log("Clients fetched:", state.dummyList);
        
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching clients";
      });
  },
});
 export const{searchclients}=clientSlice.actions
export default clientSlice.reducer;
