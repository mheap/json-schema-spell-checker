const check = require("./check");

test("no spelling errors (plain)", async () => {
  const item = { value: "This doesn't have any spelling errors" };
  const actual = await check(item);
  expect(actual.errors).toEqual([]);
});

test("no spelling errors (markdown)", async () => {
  const item = { value: "This doesn't have *any* spelling errors" };
  const actual = await check(item);
  expect(actual.errors).toEqual([]);
});

test("spelling errors (plain)", async () => {
  const item = { value: "This *has* a speling error" };
  const actual = await check(item);
  expect(actual.value).toEqual(item.value);
  expect(actual.errors).toEqual([{ index: 13, word: "speling" }]);
});

test("spelling errors (markdown)", async () => {
  const item = { value: "This *has* a speling error" };
  const actual = await check(item);
  expect(actual.value).toEqual(item.value);
  expect(actual.errors).toEqual([{ index: 13, word: "speling" }]);
});
