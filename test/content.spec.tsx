import "@testing-library/jest-dom";
import "jest-canvas-mock";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import Content from "../src/components/Content";
import MainProvider from "../src/context/MainProvider";
import App from "../src/App";

describe("testing the content of the aplication", () => {
  it("should render the content", () => {
    render(<Content />);
    const htmlHeading = screen.getByRole("heading");
    expect(htmlHeading).toBeInTheDocument();
  });

  it("should hide content", async () => {
    user.setup();
    render(
      <MainProvider>
        <App />
      </MainProvider>
    );
    const btnhide = screen.getByRole("button");
    await user.click(btnhide);

    const htmlHeading = screen.queryByRole("heading");
    // const canvas = await screen.findByRole("canvas");
    // expect)
    expect(htmlHeading).not.toBeInTheDocument();
    // expect()
  });

  it("should render content after double click", async () => {
    user.setup();
    render(
      <MainProvider>
        <App />
      </MainProvider>
    );
    const btnhide = screen.getByRole("button");
    await user.dblClick(btnhide);

    const htmlHeading = screen.queryByRole("heading");
    // const canvas = await screen.findByRole("canvas");
    // expect)
    expect(htmlHeading).toBeInTheDocument();
  });
});
