import React from "react";
import { useLoaderData } from "react-router-dom";
import { Button, Input } from "@nextui-org/react";
import "./partyPage.css";
import {
  useAccount,
  useNetwork,
} from "wagmi";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { getAttestation } from "./utils/easUtils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSigner } from "./ethers";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

const eas = new EAS(EASContractAddress);
const PartyPage = () => {
  const { party } = useLoaderData();
  const { address, isDisconnected, isConnected } = useAccount();
  const signer = useSigner();

  return (
    <div className="ppage">
      <Input defaultValue="" />
      <Input defaultValue="" />
      <Input defaultValue="" />
      <Input defaultValue="" />
      <Input defaultValue="" />
      {party}
      {isConnected ? (
        <Button
          onClick={async () => {
            if (!isConnected) {
            } else {
              const schemaEncoder = new SchemaEncoder("bool rsvp,string party");
              const encoded = schemaEncoder.encodeData([
                { name: "rsvp", type: "bool", value: true },
                { name: "party", type: "string", value: "woohoo" },
              ]);
              eas.connect(signer);

              const tx = await eas.attest({
                data: {
                  recipient: "0xaA387bcAFc8d9030D71dc072F0dF264782b8988B",
                  data: encoded,
                  refUID: ethers.constants.HashZero,
                  revocable: true,
                  expirationTime: 0,
                },
                schema:
                  "0xce80590efad0c8a91d4fdce8aaed39e7e934d6736351a4d62ea54101339983c9",
              });
              console.log("ff");
              const uid = await tx.wait();
              console.log("tt");
              const attestation = await getAttestation(uid);
              console.log(attestation);
            }
          }}
        />
      ) : (
        <ConnectButton />
      )}
    </div>
  );
};

export default PartyPage;
