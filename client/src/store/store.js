import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice'
import overviewReducer from './overview-slice'
import ordersReducer from './order-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    overview: overviewReducer,
    order: ordersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific thunk action types that cause the warning
        ignoredActions: [
          '/analytics/overview/pending',
          '/analytics/overview/fulfilled',
          '/analytics/overview/rejected',
          '/auth/check-auth/pending',
          '/auth/check-auth/fulfilled',
          '/auth/check-auth/rejected',
        ],
        // Optionally, ignore the whole "overview" key if needed:
        ignoredPaths: ['overview'],
      },
    }),
})


export default store