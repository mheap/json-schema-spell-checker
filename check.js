const strip = require("remark-plain-text");
const remark = require("remark");

const spellcheck = require("markdown-spellcheck").default;
const check = async (item, options) => {
  return new Promise((resolve, reject) => {
    remark()
      .use(strip)
      .process(item.value, (error, result) => {
        if (error) {
          reject(error);
        }
        const errors = spellcheck.spell(result.contents, options);
        resolve({ errors, plain: result.contents.trim(), ...item });
      });
  });
};

module.exports = check;
