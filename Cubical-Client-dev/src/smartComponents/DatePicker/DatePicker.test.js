import "moment/locale/he";
import moment from "moment";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

import { DatePicker } from "./DatePicker";

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
    render(<DatePicker onChange={() => {}}/>, container);
  });
  expect(container.textContent).toContain("1");
  expect(container.textContent).toContain("לעבור להיום");
  expect(container.querySelector("[id='button']")).toBeTruthy();
  expect(container.querySelector("[id='button-0']")).toBeTruthy();
  expect(container.querySelector("[id='button-icon-left']")).toBeTruthy();
  expect(container.querySelector("[id='button-icon-right']")).toBeTruthy();
});

it("Checking if button of today is clicked", () => {
  act(() => {
    render(<DatePicker onChange={() => {}}/>, container);
  });
  expect(container.querySelector(`[id='button-${new Date().getDate() - 1}']`)).not.toHaveStyle({
    backgroundColor: "inherit"
  });
});

it("Checking if button of the current date is not clicked and not displayed button today because minDate is larger than the current date", () => {
  act(() => {
    render(<DatePicker onChange={() => {}} minDate={moment().add(1, "day")} />, container);
  });
  expect(container.querySelector("[id='button']")).not.toBeTruthy();
  expect(container.querySelector(`[id='button-${new Date().getDate() - 1}']`)).toBeTruthy();
  expect(container.querySelector(`[id='button-${new Date().getDate() - 1}']`)).toHaveStyle({
    backgroundColor: "inherit"
  });
  expect(container.querySelector(`[id='button-${new Date().getDate()}']`)).not.toHaveStyle({
    backgroundColor: "inherit"
  });
});

it("Checking if minDate is the current date", () => {
  act(() => {
    render(<DatePicker onChange={() => {}} minDate={new Date()} />, container);
  });
  // Testing is displayed button today
  expect(container.textContent).toContain("לעבור להיום");
  expect(container.querySelector("[id='button']")).toBeTruthy();
  // Testing is button icon right disabled and left now
  expect(container.querySelector("[id='button-icon-right']")).toBeDisabled();
  expect(container.querySelector("[id='button-icon-left']")).not.toBeDisabled();
  // Testing is date button whose value is equal to minDate not disabled and low date yes disabled
  expect(container.querySelector(`[id='button-${new Date().getDate() - 2}']`)).toBeDisabled();
  expect(container.querySelector(`[id='button-${new Date().getDate() - 1}']`)).not.toBeDisabled();
});

it("Checking if maxDate is the current date", () => {
  act(() => {
    render(<DatePicker onChange={() => {}} maxDate={new Date()} />, container);
  });
  // Testing is button icon left disabled and right now
  expect(container.querySelector("[id='button-icon-left']")).toBeDisabled();
  expect(container.querySelector("[id='button-icon-right']")).not.toBeDisabled();
  // Testing is date button whose value is equal to maxDate not disabled and high date yes disabled
  expect(container.querySelector(`[id='button-${new Date().getDate()}']`)).toBeDisabled();
  expect(container.querySelector(`[id='button-${new Date().getDate() - 1}']`)).not.toBeDisabled();
});

it("Checking if maxDate and minDate is the current date", () => {
  act(() => {
    render(<DatePicker onChange={() => {}} minDate={new Date()} maxDate={new Date()} />, container);
  });
  // Testing is button icon left disabled and also right
  expect(container.querySelector("[id='button-icon-left']")).toBeDisabled();
  expect(container.querySelector("[id='button-icon-right']")).toBeDisabled();
  // Testing is date button whose value is equal to maxDate and also minDate not disabled and high date or low yes disabled
  expect(container.querySelector(`[id='button-${new Date().getDate()}']`)).toBeDisabled();
  expect(container.querySelector(`[id='button-${new Date().getDate() - 2}']`)).toBeDisabled();
  expect(container.querySelector(`[id='button-${new Date().getDate() - 1}']`)).not.toBeDisabled();
});

it("Checking if maxDate and minDate is No values of dates", () => {
  console.warn = () => {};
  act(() => {
    render(<DatePicker onChange={() => {}} minDate={"test"} maxDate={"test"} />, container);
  });
  // Testing is button icon left disabled and also right
  expect(container.querySelector("[id='button-icon-left']")).not.toBeDisabled();
  expect(container.querySelector("[id='button-icon-right']")).not.toBeDisabled();
  // Testing is date button whose value is equal to maxDate and also minDate not disabled and high date or low yes disabled
  expect(container.querySelector(`[id='button-${new Date().getDate()}']`)).not.toBeDisabled();
  expect(container.querySelector(`[id='button-${new Date().getDate() - 2}']`)).not.toBeDisabled();
  expect(container.querySelector(`[id='button-${new Date().getDate() - 1}']`)).not.toBeDisabled();
});
