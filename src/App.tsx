// src/App.tsx
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Hero from './components/shared/Hero';
import Chat from './components/chat/Chat';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { socket } from './lib/socket';
import ThemeProvider from './components/ThemeProvider';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Hero />
  }, {
    path: '/chat',
    element: <Chat />
  }
])


const App: React.FC = () => {

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      {/* <RouterProvider router={appRouter} /> */}
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;