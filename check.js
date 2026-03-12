import strip from "remark-plain-text";
import { remark } from "remark";
import mdSpellcheck from "markdown-spellcheck";

const spellcheck = mdSpellcheck.default;
const check = async (item, options) => {
  return new Promise((resolve, reject) => {
    remark()
      .use(strip)
      .process(item.value, (error, result) => {
        if (error) {
          reject(error);
        }
        const plain = result.value || result.toString();
        const errors = spellcheck.spell(plain, options);
        resolve({ errors, plain: plain.trim(), ...item });
      });
  });
};

export default check;
