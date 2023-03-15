context("DatePicker", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  it("Check if the scrolling animation works", () => {
    cy.viewport('samsung-s10')
    cy.get("#button-icon-left").click()
    cy.get("button[name='button-date-picker']").not('[disabled]').each((button, i, array) => {
        if(i === 1) {
            button.click();
        }
    })
    cy.get("#button-0").should('not.be.visible');
  });
});
