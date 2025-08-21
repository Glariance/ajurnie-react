// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";


import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51Nd0KLKaoaF772yM3ryaI78M1gJJoo2LUyeXg96LP9q8EpBUsLqT3okViD3WBf577HSc0ahY4DSGiAYWaxlGs7hf00XKan03rf"); // <-- your Stripe publishable key


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </BrowserRouter>
  </React.StrictMode>
);
