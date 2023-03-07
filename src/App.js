import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import 'semantic-ui-css/semantic.min.css'
import './App.css';
import ErrorPage from './error-page';

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Root from './routes/root';
import { Container } from 'semantic-ui-react'
import { AuthProvider } from './context/auth';
import SinglePost from './pages/SinglePost';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "post/:postId",
        element: <SinglePost/>
      }
    ]
  }
]);

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Container>
          <RouterProvider router={router} />
        </Container>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
