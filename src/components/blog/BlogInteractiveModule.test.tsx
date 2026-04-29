import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlogInteractiveModule } from "./BlogInteractiveModule";

describe("BlogInteractiveModule", () => {
  it("renders the module title, prompt, and active response", () => {
    const markup = renderToStaticMarkup(
      <BlogInteractiveModule
        module={{
          type: "decision-guide",
          placement: "after-intro",
          title: "Choose the training response",
          prompt: "What kind of call are you making today?",
          note: "Lifters deciding whether to push or hold.",
          choices: [
            {
              key: "push",
              label: "Push",
              title: "Take the normal path",
              description: "Recovery looks stable enough to train.",
              response: "Keep the main lift intact and trim only what is obviously too costly.",
            },
          ],
        }}
      />,
    );

    expect(markup).toContain("Choose the training response");
    expect(markup).toContain("What kind of call are you making today?");
    expect(markup).toContain("Keep the main lift intact and trim only what is obviously too costly.");
    expect(markup).toContain("Lifters deciding whether to push or hold.");
  });
});
