import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

import { Button } from "./Button";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Renders without crashing", () => {
  act(() => {
    render(<Button>{"Test"}</Button>, container);
  });
  expect(container.textContent).toBe("Test");
});

it("Check that the props size changes the name of the className", () => {
  act(() => {
    render(<Button size="large">{"Test"}</Button>, container);
  });
  expect(container.innerHTML).toEqual(
    '<button id="button" type="button" class="button-base button-base--large">Test</button>'
  );
});
