import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { render, unmountComponentAtNode } from "react-dom";
import { render as renderTesting, screen } from "@testing-library/react";

import { DropList } from "./DropList";

let container = null;
const options = [
  { id: 1, name: "dev" },
  { id: 2, name: "test" },
  { id: 3, name: "prod" }
];

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
    render(<DropList options={options} value={2} />, container);
  });
  expect(container.textContent).toBe("test");
});

it("Checking if button is clicked by props", () => {
  const { queryByText } = renderTesting(<DropList options={options} value={2} />);

  let dev = queryByText(/dev/i);
  let test = queryByText(/test/i);
  let prod = queryByText(/prod/i);

  expect(dev).toBeNull();
  expect(test).toBeVisible();
  expect(prod).toBeNull();
  userEvent.click(test);

  dev = screen.getByText(/dev/i);
  test = screen.getAllByText(/test/i);
  prod = screen.getByText(/prod/i);

  expect(dev).toBeVisible();
  expect(test).toHaveLength(2);
  expect(prod).toBeVisible();
});
