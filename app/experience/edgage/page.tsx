import type { Metadata } from "next";
import ExperienceLayout from "../experience-layout";
import { getExperience } from "../data";
import { discoverMedia } from "../media";

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

  const discovered = discoverMedia("edgage");
  const media = discovered.length > 0 ? discovered : experience.media;

  return <ExperienceLayout experience={{ ...experience, media }} />;
}
