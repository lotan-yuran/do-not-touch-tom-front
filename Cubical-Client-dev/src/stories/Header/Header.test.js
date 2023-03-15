import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

import { Header } from "./Header";

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

it("renders without crashing", () => {
  act(() => {
    render(<Header />, container);
  });
  expect(container.querySelector("div")).toBeTruthy();
});