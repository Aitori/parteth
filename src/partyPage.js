import React, { useEffect, useState } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { Button, Input } from "@nextui-org/react";
import "./partyPage.css";
import { useAccount } from "wagmi";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { getAttestation, getAttestationsForSchema } from "./utils/easUtils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSigner } from "./ethers";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import { Navbar, NavbarBrand } from "@nextui-org/react";
import "react-datepicker/dist/react-datepicker.css";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

const eas = new EAS(EASContractAddress);
const PartyPage = () => {
  const { party } = useLoaderData();
  const { address, isDisconnected, isConnected } = useAccount();
  const signer = useSigner();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dd, onDd] = useState(new Date());
  const [creator, setCreator] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    ff();
    async function ff() {
      const tf = await getAttestationsForSchema();
      const gg = tf.map((e) => {
        const parsed = JSON.parse(e.decodedDataJson);
        return {
          party: parsed[0].value.value,
          name: parsed[1].value.value,
          description: parsed[2].value.value,
          location: parsed[3].value.value,
          date: parsed[4].value.value,
          attester: e.attester,
        };
      });
      const ll = gg.find((e) => {
        return e.party === parseInt(party);
      });
      if (ll) {
        setTitle(ll.name);
        setDescription(ll.description);
        setLocation(ll.location);
        const gggg = new Date(parseInt(ll.date.hex, 16));
        onDd(gggg);
        setCreator(ll.attester);
      }
    }
  }, [party]);
  return (
    <div className="ppage">
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">Attendstation</p>
        </NavbarBrand>
      </Navbar>
      <div className="px-8">
        <Input
          defaultValue=""
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Name your party"
          className="w-1/2 mb-4"
          radius="none"
          isDisabled={creator}
        />
        <Input
          defaultValue=""
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Tell others what the party is about"
          radius="none"
          className="w-1/2 mb-4"
          isDisabled={creator}
        />
        <Input
          defaultValue=""
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          placeholder="Where"
          radius="none"
          className="w-1/2 mb-4"
          isDisabled={creator}
        />
        <div className="mb-4">
          <DatePicker
            selected={dd}
            onChange={(date) => onDd(date)}
            disabled={creator}
          />
        </div>
        {success ? (
          <div>Successfully rsvped</div>
        ) : isConnected ? (
          creator !== "" ? (
            <Button
              onClick={async () => {
                if (!isConnected) {
                } else {
                  const schemaEncoder = new SchemaEncoder(
                    "bool rsvp,string party"
                  );
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
                  const uid = await tx.wait();
                  const attestation = await getAttestation(uid);
                  setSuccess(true);
                }
              }}
            >
              Accept RSVP
            </Button>
          ) : (
            <Button
              onClick={async () => {
                if (!isConnected) {
                } else {
                  const schemaEncoder = new SchemaEncoder(
                    "uint32 partyId,string name,string description,string location,uint64 time"
                  );
                  const encoded = schemaEncoder.encodeData([
                    {
                      name: "partyId",
                      type: "uint32",
                      value: Math.floor(Math.random() * 100000),
                    },
                    { name: "name", type: "string", value: title },
                    { name: "description", type: "string", value: description },
                    { name: "location", type: "string", value: location },
                    { name: "time", type: "uint64", value: dd.getTime() },
                  ]);
                  eas.connect(signer);
                  const createPartySchema =
                    "0xc78fc66a6e40b24a19ea1ef3789b2c67a040aeea32803679e3c2a1834915aace";
                  const tx = await eas.attest({
                    data: {
                      recipient: "0xaA387bcAFc8d9030D71dc072F0dF264782b8988B",
                      data: encoded,
                      refUID: ethers.constants.HashZero,
                      revocable: true,
                      expirationTime: 0,
                    },
                    schema: createPartySchema,
                  });
                  const uid = await tx.wait();
                  const attestation = await getAttestation(uid);
                  console.log(attestation);
                  const decodedjj = JSON.parse(attestation.decodedDataJson);
                  console.log(decodedjj);
                  navigate("/aa/" + decodedjj[0].value.value);
                }
              }}
            >
              Create
            </Button>
          )
        ) : (
          <ConnectButton />
        )}
      </div>
    </div>
  );
};

export default PartyPage;
