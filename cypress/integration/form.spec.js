describe("Form test", () => {
  it("Can fill the form", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("test")
      .should("have.value", "test");
  });

  it("Can display output", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("5 5{enter}1 2 N{enter}LMLMLMLMM{enter}3 3 E{enter}MMRMMRMRRM{enter}0 0 S{enter}MMM{enter}4 1 n{enter}mm")
      .should("have.value", "5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM\n0 0 S\nMMM\n4 1 n\nmm");

    cy.get("form").submit();
    cy.contains('div', '1 3 N')
    cy.contains('div', '5 1 E')
    cy.contains('div', '0 0 S')
    cy.contains('div', '4 3 N');
  });
});

describe("Check input errors test", () => {
  it("Can prevent no integer upper-right coordinates", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("5 5.5{enter}1 2 N{enter}LMLMLMLMM")
      .should("have.value", "5 5.5\n1 2 N\nLMLMLMLMM");

    cy.get("form").submit();
    cy.contains('div', 'The maximum x and y coordinates of the grid must be integer numbers greater than zero.');
  });

  it("Can prevent negative number for upper-right coordinates", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("5 -5{enter}1 2 N{enter}LMLMLMLMM")
      .should("have.value", "5 -5\n1 2 N\nLMLMLMLMM");

    cy.get("form").submit();
    cy.contains('div', 'The maximum x and y coordinates of the grid must be integer numbers greater than zero.')
  });

  it("Can prevent undefined character in rover movement", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("5 5{enter}1 2 N{enter}LMX")
      .should("have.value", "5 5\n1 2 N\nLMX");

    cy.get("form").submit();
    cy.contains('div', 'Undefined movement X for the rover 1 . Please enter M, L or R')
  });

	it("Can prevent undefined character in rover position", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("5 5{enter}1 2 -{enter}LM")
      .should("have.value", "5 5\n1 2 -\nLM");

    cy.get("form").submit();
    cy.contains('div', 'Undefined character for rover 1 orientation. Please enter N, O, S or E value')
  });

  it("Can prevent negativ number rover position", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("5 5{enter}1 -2 N{enter}LM")
      .should("have.value", "5 5\n1 -2 N\nLM");

    cy.get("form").submit();
    cy.contains('div', 'The y coordinate of rover 1 must be an integer between 0 and 5')
  });

  it("Can prevent no integer rover position coordinate", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("5 5{enter}1.6 2 N{enter}LM")
      .should("have.value", "5 5\n1.6 2 N\nLM");

    cy.get("form").submit();
    cy.contains('div', 'The x coordinate of rover 1 must be an integer between 0 and 5')
  });

  it("Can prevent if initial rover position is outside the grid", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("5 5{enter}1 6 N{enter}LMLMLMLMM")
      .should("have.value", "5 5\n1 6 N\nLMLMLMLMM");

    cy.get("form").submit();
    cy.contains('div', 'The y coordinate of rover 1 must be an integer between 0 and 5')
  });

});

describe("Clear test", () => {
  it("Can clear textarea", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("test")
      .should("have.value", "test");

    cy.get('#clear').click();

    cy.get('textarea[name="inputData"]')
      .should("have.value", "");
  });

  it("Can clear output", () => {
    cy.visit("/");
    cy.get("form");

    cy.get('textarea[name="inputData"]')
      .type("5 5{enter}1 2 N{enter}LMLMLMLMM")
      .should("have.value", "5 5\n1 2 N\nLMLMLMLMM");

    cy.get("form").submit();

    cy.get('textarea[name="inputData"]')
      .type("error generation")
      .should("have.value", "5 5\n1 2 N\nLMLMLMLMMerror generation");

    cy.get("form").submit();

    cy.get('#clear').click();
    cy.get('.output__content').should('not.exist');
  });

});
