import type { Metadata } from "next";
import ExperienceLayout from "../experience-layout";
import { getExperience } from "../data";

export const metadata: Metadata = {
  title: "Edgage | Experience",
  description:
    "Software quality assurance experience at Edgage, focused on testing, defect tracking, and Playwright/Cucumber automation.",
};

export default function EdgageExperiencePage() {
  const experience = getExperience("edgage");

  if (!experience) {
    return null;
  }

  return <ExperienceLayout experience={experience} />;
}
