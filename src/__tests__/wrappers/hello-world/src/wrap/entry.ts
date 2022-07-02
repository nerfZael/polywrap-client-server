import {
  wrap_invoke_args,
  wrap_invoke,
  wrap_load_env,
  wrap_sanitize_env,
  wrap_abort,
  InvokeArgs
} from "@polywrap/wasm-as";

import {
  sayHelloWrapped
} from "./Module/wrapped";

export function _wrap_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = wrap_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "sayHello") {
    return wrap_invoke(args, sayHelloWrapped);
  }
  else {
    return wrap_invoke(args, null);
  }
}

export function wrapAbort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
  wrap_abort(
    msg ? msg : "",
    file ? file : "",
    line,
    column
  );
}
