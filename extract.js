var { JSONPath } = require("jsonpath-plus");

/**
 * Extracts all titles and descriptions from a specification
 */
const extract = (document, fields = []) => {
  let path;
  if (typeof fields == "string") {
    path = fields;
  } else {
    path = `$..[${fields.join(",")}]`;
  }

  return JSONPath({ path, json: document, resultType: "all" }).map(
    ({ path, value }) => {
      return {
        path,
        value
      };
    }
  );
};

module.exports = extract;
