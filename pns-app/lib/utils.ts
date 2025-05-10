import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { keccak256, encodePacked } from "viem";

const PARENT_NODE_DOT =
  "0x3fce7d1364a893e213bc4212792b517ffc88f5b13b86c8ef9c8d390c3a1370ce";
const PARENT_NODE_JAM =
  "0x6f142072f4756fbc7aaa14293ad39fafc39e33b39953c16205e8c1e0b04791bd";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate bytes32 hash of name
export function nameToHash(name: string, tld: string) {
  // const nameHash = keccak256(encodePacked(["string"], [name]));

  const currentNode = keccak256(encodePacked(["string"], [name]));
  // Example data and types
  const types = ["bytes32", "bytes32"];

  let values: string[];

  if (tld === "DOT") {
    values = [PARENT_NODE_DOT, currentNode];
  }

  else if (tld === "JAM") {
    values = [PARENT_NODE_JAM, currentNode];
  }

  else {
    return null;
  }

  // Encode and hash
  const encoded = encodePacked(types, values);
  const myNameHash = keccak256(encoded);
  return myNameHash;
}
