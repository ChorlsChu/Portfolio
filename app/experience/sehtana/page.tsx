import type { Metadata } from "next";
import ExperienceLayout from "../experience-layout";
import { getExperience } from "../data";

export const metadata: Metadata = {
  title: "Sehtana | Experience",
  description:
    "Full stack developer experience at Sehtana, building a multi-app healthcare technology initiative addressing real-world clinical and operational needs identified with healthcare stakeholders.",
};

export default function SehtanaExperiencePage() {
  const experience = getExperience("sehtana");

  if (!experience) {
    return null;
  }

  return <ExperienceLayout experience={experience} />;
}
