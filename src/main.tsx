import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createHashRouter } from 'react-router-dom'
const Root = React.lazy(() => import("./routes/root"));
const ErrorPage = React.lazy(() => import("./error-page"));
const Contact = React.lazy(() => import("./routes/contact"));
const Layout = React.lazy(() => import("./components/layout"));


const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [{}],
      },
      {
        path: "/contacts/:id",
        element: <Contact />,
        errorElement: <ErrorPage />,
        children: [{}],
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
