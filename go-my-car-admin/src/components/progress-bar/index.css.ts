import { globalStyle } from "@vanilla-extract/css";

// globalStyle("#nprogress .bar", {
//   background: "hsl(var(--primary))", // Uses Tailwind's `--primary` variable
//   boxShadow: `0 0 2px hsl(var(--primary))`,
// });

// globalStyle("#nprogress .peg", {
//   boxShadow: `0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))`,
// });

globalStyle("#nprogress .bar", {
  background: "white", // White progress bar
  boxShadow: "0 0 2px white", // White glow effect
});

globalStyle("#nprogress .peg", {
  boxShadow: "0 0 10px white, 0 0 5px white", // White peg effect
});
