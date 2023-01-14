import cssProperties from "./css-properties.js";

/** @type {import("./css").css} */
export function css(template, ...args) {
  let css = "";
  const final = template.length - 1;
  for (let i = 0; i < final; i++) {
    css += template[i];
    css += String(args[i]);
  }
  css += template[final];

  // property = token[1];
  // value = token[2];
  // unit = token[3];
  // variable = token[4];
  // wordValue = token[5];
  // scoped = token[6];
  // query = token[7];
  // close = token[8];
  const cssRegex =
    /([a-zA-Z][a-zA-Z0-9\-]+)\s*\:|([0-9]+(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax));|var\s*\(([a-zA-Z0-9\-]+)\)\s*;|&\:([a-zA-Z]+)\s*\{|@media\s?\(([a-zA-Z\-]+)\)\s?\{|(\})/gm;
  let token;
  let tailwind = new Set();

  let modifiers = [],
    property,
    value,
    unit,
    variable;

  while ((token = cssRegex.exec(css))) {
    if (property) {
      value = token[2];
      unit = token[3];
      variable = token[4];
      if (!value && !variable) {
        throw new Error("Invalid CSS property value " + token[0]);
      }

      if (!cssProperties[property].tailwind) {
        throw new Error(
          "Don't know how to convert " + property + " to tailwind yet"
        );
      }

      let className = "";
      for (const modifier of modifiers) {
        className += modifier.value + ":";
      }
      className += cssProperties[property].tailwind;
      if (value) {
        className += `[${value}]`;
      } else if (variable) {
        className += variable.replace(/^--/, "");
      }

      tailwind.add(className);

      property = null;
      continue;
    }

    if (token[1]) {
      property = token[1];
      if (!cssProperties[property]) {
        throw new Error("Invalid CSS property " + property);
      }
      continue;
    }

    if (token[5]) {
      modifiers.push({
        type: "scope",
        value: token[5].replace(/^--/, ""),
      });
      continue;
    }

    if (token[6]) {
      modifiers.push({
        type: "media",
        value: token[6].replace(/^--/, ""),
      });
      continue;
    }

    if (token[7]) {
      modifiers.pop();
      continue;
    }
  }

  return Array.from(tailwind).join(" ");
}
