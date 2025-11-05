import { configureStore } from "@reduxjs/toolkit";
import shipmentReducer from "./Slice/shipmentSlice.js";
import invoiceReducer from "./Slice/invoiceSlice.js";
import clientReducer from "./Slice/clientSlice.js";
const store = configureStore({
  reducer: {
    shipment:shipmentReducer,
    invoice:invoiceReducer,
    client:clientReducer,

  },
});
export default store;