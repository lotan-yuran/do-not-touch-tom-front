import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { render as renderTesting, screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";

import { ScrollPad } from "./ScrollPad";

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
    render(<ScrollPad data={[...Array(1).keys()].map(i => ({ labelOne: i, labelTwo: "ה'" }))} />, container);
  });
  expect(container.textContent).toContain("0ה'");
  expect(container.querySelector("[id='button-0']")).toBeTruthy();
});

it("Checking if created buttons in the right amount", () => {
  act(() => {
    render(<ScrollPad data={[...Array(3).keys()].map(i => ({ labelOne: i, labelTwo: "ה'" }))} />, container);
  });
  expect(container.textContent).toContain("0ה'");
  expect(container.textContent).toContain("1ה'");
  expect(container.textContent).toContain("2ה'");
  expect(container.querySelector("[id='button-0']")).toBeTruthy();
  expect(container.querySelector("[id='button-1']")).toBeTruthy();
  expect(container.querySelector("[id='button-2']")).toBeTruthy();
  expect(container.querySelector("[id='button-3']")).toBeFalsy();
});

it("Checking if disabled button by props", () => {
  act(() => {
    render(
      <ScrollPad
        data={[...Array(3).keys()].map(i => ({ labelOne: i, labelTwo: "ה'", disabled: i === 1 }))}
      />,
      container
    );
  });
  expect(container.querySelector("[id='button-0']")).not.toBeDisabled();
  expect(container.querySelector("[id='button-1']")).toBeDisabled();
  expect(container.querySelector("[id='button-2']")).not.toBeDisabled();
});

it("Checking if button is clicked by props", () => {
  act(() => {
    render(
      <ScrollPad indexClicked={1} data={[...Array(3).keys()].map(i => ({ labelOne: i, labelTwo: "ה'" }))} />,
      container
    );
  });
  expect(container.querySelector("[id='button-0']:not([disabled]")).toHaveStyle({
    backgroundColor: "inherit"
  });
  expect(container.querySelector("[id='button-1']:not([disabled]")).not.toHaveStyle({
    backgroundColor: "inherit"
  });
  expect(container.querySelector("[id='button-2']:not([disabled]")).toHaveStyle({
    backgroundColor: "inherit"
  });
});

it("Checking if button is clicked by props", () => {
  const onClick = jest.fn();
  act(() => {
    render(
      <ScrollPad
        indexClicked={1}
        onClick={onClick}
        data={[...Array(3).keys()].map(i => ({ labelOne: i, labelTwo: "ה'" }))}
      />,
      container
    );
  });

  //get ahold of the button element, and trigger some clicks on it
  const button = document.querySelector("[id='button-2']");
  expect(button.style.backgroundColor).toBe("inherit");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onClick).toHaveBeenCalledTimes(1);
});
