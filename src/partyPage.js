import React from "react";
import { Outlet, Link, useLoaderData } from "react-router-dom";

const PartyPage = () => {
  const { contacts } = useLoaderData();

  return <div>partyPage</div>;
};

export default PartyPage;
