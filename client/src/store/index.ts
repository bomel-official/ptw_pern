import {configureStore} from '@reduxjs/toolkit'
import {playToWinApi} from './playtowin/playtowin.api'
import {setupListeners} from '@reduxjs/toolkit/query'

export const store = configureStore({
    reducer: {
        [playToWinApi.reducerPath]: playToWinApi.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(playToWinApi.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>