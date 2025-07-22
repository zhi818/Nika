import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router'

import App from './App.tsx'
import PlayerPage from './pages/Player'
import MergePage from './pages/Merge'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/player',
    element: <PlayerPage />,
  },
  {
    path: '/merge',
    element: <MergePage />,
  }
])

createRoot(document.body).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
