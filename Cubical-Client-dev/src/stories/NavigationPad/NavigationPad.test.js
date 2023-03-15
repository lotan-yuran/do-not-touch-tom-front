import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

import { NavigationPad } from "./NavigationPad";

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
    render(<NavigationPad labelBetweenIcons="דצמבר 2020" />, container);
  });
  expect(container.textContent).toBe("דצמבר 2020");
  expect(container.querySelector("[id='button-icon-left']")).toBeTruthy();
  expect(container.querySelector("[id='button-icon-right']")).toBeTruthy();
});

it("Checks if the 'Today' button is displayed by props", () => {
  act(() => {
    render(
      <NavigationPad
        isDisplayButtonToDay={true}
        labelBetweenIcons="דצמבר 2020"
        labelButtonToday="לעבור להיום"
      />,
      container
    );
  });
  expect(container.textContent).toContain("דצמבר 2020");
  expect(container.textContent).toContain("לעבור להיום");
  expect(container.querySelector("[id='button']")).toBeTruthy();
  expect(container.querySelector("[id='button-icon-left']")).toBeTruthy();
  expect(container.querySelector("[id='button-icon-right']")).toBeTruthy();
});

it("Checks if not disabled buttons of icon left and right", () => {
  act(() => {
    render(<NavigationPad labelBetweenIcons="דצמבר 2020" />, container);
  });
  expect(container.textContent).toContain("דצמבר 2020");
  expect(container.querySelector("[id='button-icon-left']:not([disabled]")).toBeTruthy();
  expect(container.querySelector("[id='button-icon-right']:not([disabled]")).toBeTruthy();
});

it("Checks if disabled button of icon right by minDate", () => {
  act(() => {
    render(
      <NavigationPad labelBetweenIcons="דצמבר 2020" date="2020-01-11" minDate="2020-01-11" />,
      container
    );
  });
  expect(container.textContent).toContain("דצמבר 2020");
  expect(container.querySelector("[id='button-icon-right']:disabled")).toBeTruthy();
  expect(container.querySelector("[id='button-icon-left']:not([disabled]")).toBeTruthy();
});

it("Checks if disabled button of icon left by maxDate", () => {
  act(() => {
    render(
      <NavigationPad labelBetweenIcons="דצמבר 2020" date="2020-01-11" maxDate="2020-01-11" />,
      container
    );
  });
  expect(container.textContent).toContain("דצמבר 2020");
  expect(container.querySelector("[id='button-icon-left']:disabled")).toBeTruthy();
  expect(container.querySelector("[id='button-icon-right']:not([disabled]")).toBeTruthy();
});

it("Checks if disabled buttons of icon left and right by maxDate and minDate", () => {
  act(() => {
    render(
      <NavigationPad
        date="2020-01-11"
        minDate="2020-01-11"
        maxDate="2020-01-11"
        labelBetweenIcons="דצמבר 2020"
      />,
      container
    );
  });
  expect(container.textContent).toContain("דצמבר 2020");
  expect(container.querySelector("[id='button-icon-left']:disabled")).toBeTruthy();
  expect(container.querySelector("[id='button-icon-right']:disabled")).toBeTruthy();
});
