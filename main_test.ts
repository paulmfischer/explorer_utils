import { assertEquals } from "@std/assert";
import { add } from "./main.ts";

Deno.test(function addTest() {
  const multiMathc = add(2, 3) + add(4, 5);
  assertEquals(add(2, 3), 5);
});
