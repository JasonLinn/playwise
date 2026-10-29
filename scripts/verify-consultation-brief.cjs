const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

// Execute the component's real event handlers with an isolated clipboard and
// textarea ref. This covers failure recovery without changing browser security.
const source = fs.readFileSync(
  "app/components/studio/ConsultationBrief.tsx",
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function fixture(writeText, initialText = "我經營小店，想整理取貨流程。") {
  const values = [];
  let cursor = 0;
  let focused = false;
  let selected = false;
  const createElement = (type, props) => ({ type, props });
  const module = { exports: {} };
  const context = {
    exports: module.exports,
    navigator: { clipboard: { writeText } },
    require: (id) => {
      if (id === "react/jsx-runtime")
        return { jsx: createElement, jsxs: createElement };
      if (id === "react")
        return {
          useState: (value) => {
            const slot = cursor++;
            values[slot] = value;
            return [
              value,
              (next) => {
                values[slot] = next;
              },
            ];
          },
          useRef: () => ({
            current: {
              focus: () => {
                focused = true;
              },
              select: () => {
                selected = true;
              },
            },
          }),
        };
      if (id.endsWith(".css")) return { default: {} };
      throw new Error(`Unexpected module ${id}`);
    },
  };
  vm.runInNewContext(compiled, context);
  const tree = module.exports.default({ id: "test-message", initialText });
  const all = [];
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(visit);
    all.push(node);
    visit(node.props?.children);
  }
  visit(tree);
  return {
    button: all.find((node) => node.type === "button"),
    textarea: all.find((node) => node.type === "textarea"),
    values,
    recovery: () => ({ focused, selected }),
  };
}

(async () => {
  let copied;
  const success = fixture(async (text) => {
    copied = text;
  });
  await success.button.props.onClick();
  assert.equal(copied, "我經營小店，想整理取貨流程。");
  assert.match(success.values[1], /^已複製/);
  const failure = fixture(async () => {
    throw new Error("Permission denied");
  });
  await failure.button.props.onClick();
  assert.deepEqual(failure.recovery(), { focused: true, selected: true });
  assert.match(failure.values[1], /上方內容/);
  assert.match(failure.values[1], /Ctrl／⌘ \+ C/);
  const unavailable = fixture(undefined);
  await unavailable.button.props.onClick();
  assert.equal(unavailable.recovery().selected, true);
  const empty = fixture(async () => {}, "   ");
  assert.equal(empty.button.props.disabled, true);
  success.textarea.props.onChange({ target: { value: "新的諮詢內容" } });
  assert.equal(success.values[0], "新的諮詢內容");
  assert.equal(success.values[1], "");
  console.log(
    "PASS: copy success, denied permission recovery, unavailable clipboard recovery, empty draft disabled, edit clears status",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
