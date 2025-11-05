import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://cargoserver.onrender.com/createFullEntry";
const edit_url = "https://cargoserver.onrender.com/updateFullEntry";
const ALL_SHIPMENTS_URL = "https://cargoserver.onrender.com/shipments";
const delete_api=`https://cargoserver.onrender.com/deleteFullEntry`
// Async thunk using Axios GET
export const fetchShipments = createAsyncThunk(
  "shipments/fetchShipments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(ALL_SHIPMENTS_URL);
      // console.log(response);
      
      return response.data;
    } catch (error) {
      // Handle structured Axios error
      return rejectWithValue(error.response?.data || "Failed to fetch shipments");
    }
  }
);
// Async thunk using Axios POST
export const addShipment = createAsyncThunk(
  "shipments/addShipment",
  async (newShipment, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, newShipment);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add shipment");
    }
  }
);
export const editShipment = createAsyncThunk(
  "shipments/editShipment",
  async ({ id, client, shipment, invoice }) => {
    const response = await axios.put(
      `${edit_url}/${id}`,
      { client, shipment, invoice },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }
);



export const deleteShipment = createAsyncThunk(
  "shipments/deleteShipment",
  async (ids, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${delete_api}/${ids.shipmentId}`,
        {
          data: ids, 
          headers: { "Content-Type": "application/json" },
        }
      );
      return ids.shipmentId;
    } catch (error) {
      console.error("Delete Error:", error.message);
      return rejectWithValue(error.response?.data || "Failed to delete shipment");
    }
  }
);



const shipmentSlice = createSlice({
  name: "shipments",
  initialState: {
    list: [],
    dummyList: [],
    loading: false,
    error: null,
  },

  reducers: {
     searchShipments:(state,action)=>{
            state.list=state.dummyList.filter(items=>items.id.includes(action.payload))
        }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        state.dummyList = action.payload || [];
        // console.log("Shipments fetched:", state.list);
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching shipments";
        console.error(" Shipment Fetch Error:", state.error);
      })
      .addCase(addShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        state.dummyList.push(action.payload);
        // console.log("Shipment added:", action.payload);
      })  
      .addCase(addShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error adding shipment";
        console.error(" Shipment Add Error:", state.error);
      })
      .addCase(editShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(editShipment.fulfilled, (state, action) => {
        state.loading = false;  
        const index = state.list.findIndex((ship) => ship.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
          state.dummyList[index] = action.payload;
        }
        console.log("Shipment edited:", action.payload);
      })
      .addCase(editShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error editing shipment";
        console.error(" Shipment Edit Error:", state.error);
      });
  },
});
export const{searchShipments}=shipmentSlice.actions
export default shipmentSlice.reducer;
