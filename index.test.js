const checker = require(".");

const json = [
  {
    title: "Speling mistake here",
    nested: {
      title: "Not in the nested"
    }
  },
  {
    title: "No spelling mistake",
    nested: {
      title: "But ther is one in nested"
    }
  }
];

test("checker run one", async () => {
  const actual = await checker(json, ["title"]);
  expect(actual).toEqual([
    {
      errors: [{ index: 0, word: "Speling" }],
      path: "$[0].title",
      value: "Speling mistake here",
      plain: "Speling mistake here"
    },
    {
      errors: [{ index: 4, word: "ther" }],
      path: "$[1].nested.title",
      value: "But ther is one in nested",
      plain: "But ther is one in nested"
    }
  ]);
});
