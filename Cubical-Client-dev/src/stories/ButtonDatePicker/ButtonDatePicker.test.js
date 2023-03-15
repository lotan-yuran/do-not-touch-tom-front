import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

import { ButtonDatePicker } from "./ButtonDatePicker";

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
    render(<ButtonDatePicker labelOne="T" labelTwo="S"/>, container);
  });
  expect(container.textContent).toBe("TS");
});

it("Check that the props size changes the name of the className", () => {
  act(() => {
    render(
      <ButtonDatePicker
        labelOne="T"
        labelTwo="S"
        sizeButton="large"
        sizeLabelOne="small"
        sizeLabelTwo="medium"
      />,
      container
    );
  });
  expect(container.innerHTML).toEqual(
    '<button id="button" type="button" class="button-date-picker-not-accented button-date-picker button-date-picker--large"><p class="one-label-small">T</p><p class="two-label-medium">S</p></button>'
  );
});
