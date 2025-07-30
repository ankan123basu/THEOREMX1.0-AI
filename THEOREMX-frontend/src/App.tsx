import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { MathJaxContext } from 'better-react-mathjax';
import Home from '@/screens/home';
import '@/index.css';

const paths = [
    {
        path: '/',
        element: (
          <Home/>
        ),
    },
];

const BrowserRouter = createBrowserRouter(paths);

const App = () => {
    return (
    <MantineProvider>
      <MathJaxContext>
        <RouterProvider router={BrowserRouter}/>
      </MathJaxContext>
    </MantineProvider>
    )
};

export default App;