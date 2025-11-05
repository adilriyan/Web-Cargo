import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://cargoserver.onrender.com/invoices";

// Fetch Invoices (GET)
export const fetchInvoices = createAsyncThunk(
  "invoices/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch invoices");
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    list: [],
    dummyList: [],
    loading: false,
    error: null,
  },
  reducers: {
     searchinvoices:(state,action)=>{
            state.list=state.dummyList.filter(items=>items.id.toLowerCase().includes(action.payload))
        }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        state.dummyList = action.payload || [];
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching invoices";
      });
  },
});
export const {searchinvoices}=invoiceSlice.actions
export default invoiceSlice.reducer;
