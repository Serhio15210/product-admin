import {createRouter, RouterProvider} from "@tanstack/react-router";
import {routeTree} from "./routeTree.gen.ts";

import 'bootstrap/dist/css/bootstrap.min.css';

const router = createRouter({routeTree});

function App() {
    return (

        <RouterProvider router={router}/>

    );
}

export default App;