import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { css } from "../lib/index.js";

describe("css", () => {
  it("should expand basic properties to the tailwind equivalent classes", () => {
    const className = css`
      font-size: 1rem;
      padding-left: 10%;
      background: var(--green-500);
      color: var(--white);

      &:hover {
        background: var(--green-600);
      }

      @media (--dark) {
        background: var(--green-300);
        color: var(--black);

        &:hover {
          background: var(--green-400);
        }
      }
    `;
    const classes = new Set(className.split(" "));
    strictEqual(classes.has("text-[1rem]"), true);
    strictEqual(classes.has("pl-[10%]"), true);
    strictEqual(classes.has("bg-green-500"), true);
    strictEqual(classes.has("text-white"), true);
    strictEqual(classes.has("hover:bg-green-600"), true);
    strictEqual(classes.has("dark:bg-green-300"), true);
    strictEqual(classes.has("dark:text-black"), true);
    strictEqual(classes.has("dark:hover:bg-green-400"), true);
  });
});
