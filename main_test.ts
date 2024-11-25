import { assertEquals } from "@std/assert";

function multiply_nums(num1: number, num2: number) {
  return num1 * num2;
}

Deno.test(function addTest() {
  const multiMathc = multiply_nums(2, 3) + multiply_nums(4, 5);
  assertEquals(multiMathc, 5);
});
