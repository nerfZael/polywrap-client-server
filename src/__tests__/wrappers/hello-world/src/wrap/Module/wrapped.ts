import {
  sayHello
} from "../../index";
import {
  deserializesayHelloArgs,
  serializesayHelloResult
} from "./serialization";

export function sayHelloWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const result = sayHello();
  return serializesayHelloResult(result);
}
