import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from "@mantine/core";
import Home from '@/screens/home';
import '@/index.css';

/**
 * Application routes configuration
 * Currently only has the home route
 */
const paths = [
  {
    path: '/',
    element: <Home />,
  },
];

/**
 * Create the browser router with our routes
 */
const BrowserRouter = createBrowserRouter(paths);

/**
 * App Component
 * 
 * The root component of the application
 * Sets up providers for UI (Mantine) and routing
 * 
 * @returns {JSX.Element} - Rendered component
 */
const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={BrowserRouter} />
    </MantineProvider>
  );
};

export default App;