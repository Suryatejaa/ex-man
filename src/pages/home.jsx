import { Link } from "react-router-dom";

import React from "react";

export default function Home() {

 return (

  <>

   <div>

    <h2>Hello, <br />Please Login before dive into Dashboard</h2>

    <Link to="/login">

     <button>

      SignIn

     </button>

    </Link>

    <Link to="/signup">

     <button>

      SignUp

     </button>

    </Link>

   </div>

  </>

 );

}

