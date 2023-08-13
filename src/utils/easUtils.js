import axios from "axios";

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
export const rsvpSchema =
  "0xce80590efad0c8a91d4fdce8aaed39e7e934d6736351a4d62ea54101339983c9";
export const baseURL = `https://sepolia.easscan.org`;
export const optimisUrl = `https://optimism.easscan.org`;

export async function getAttestation(uid) {
  const response = await axios.post(
    `${baseURL}/graphql`,
    {
      query:
        "query Query($where: AttestationWhereUniqueInput!) {\n  attestation(where: $where) {\n    id\n    attester\n    recipient\n    revocationTime\n    expirationTime\n    time\n    txid\n    decodedDataJson\n  }\n}",
      variables: {
        where: {
          id: uid,
        },
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response.data.data.attestation;
}

export async function getAttestationsForAddress(address) {
  const response = await axios.post(
    `${baseURL}/graphql`,
    {
      query:
        "query Attestations($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!]) {\n  attestations(where: $where, orderBy: $orderBy) {\n    attester\n    revocationTime\n    expirationTime\n    time\n    recipient\n    id\n    decodedDataJson\n  }\n}",

      variables: {
        where: {
          schemaId: {
            equals: rsvpSchema,
          },
          OR: [
            {
              attester: {
                equals: address,
              },
            },
            {
              recipient: {
                equals: address,
              },
            },
          ],
        },
        orderBy: [
          {
            time: "desc",
          },
        ],
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response.data.data.attestations;
}

export async function getAttestationsForSchema() {
  const response = await axios.post(
    `${baseURL}/graphql`,
    {
      query:
        "query Attestations($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!]) {\n  attestations(where: $where, orderBy: $orderBy) {\n    attester\n    revocationTime\n    expirationTime\n    time\n    recipient\n    id\n    decodedDataJson\n  }\n}",

      variables: {
        where: {
          schemaId: {
            equals:
              "0xc78fc66a6e40b24a19ea1ef3789b2c67a040aeea32803679e3c2a1834915aace",
          },
        },
        orderBy: [
          {
            time: "desc",
          },
        ],
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response.data.data.attestations;
}
