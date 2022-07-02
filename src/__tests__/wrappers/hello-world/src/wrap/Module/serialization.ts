import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Option,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import * as Types from "..";

export class Args_sayHello {
}

export function deserializesayHelloArgs(argsBuf: ArrayBuffer): Args_sayHello {
  const context: Context = new Context("Deserializing module-type: sayHello");

  return {
  };
}

export function serializesayHelloResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: sayHello");
  const sizer = new WriteSizer(sizerContext);
  writesayHelloResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: sayHello");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesayHelloResult(encoder, result);
  return buffer;
}

export function writesayHelloResult(writer: Write, result: string): void {
  writer.context().push("sayHello", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}
