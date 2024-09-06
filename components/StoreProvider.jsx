'use client';
import { Provider } from 'react-redux';
import store from '@/app/Store/store';

const StoreProvider = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
)

export default StoreProvider;