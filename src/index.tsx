import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Layout from './Layout';
import Home from './components/Home';
import Chat from './components/Chat';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { store } from './redux/Store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/chat",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Chat />
      }
    ]
  }
])


//second method
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path='/' element={<Layout />} >
//       <Route path='' element={<Home />} />
//       <Route 
//       // loader={}  // for calling api
//       path='' 
//       element={<Home />} 
//       />
//     </Route>
//   )
// )

const persistor = persistStore(store);

root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        {/* <App /> */}
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
