import type { Metadata } from "next";
import ExperienceLayout from "../experience-layout";
import { getExperience } from "../data";
import { discoverMedia } from "../media";

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

  const discovered = discoverMedia("sehtana");
  const media = discovered.length > 0 ? discovered : experience.media;

  return <ExperienceLayout experience={{ ...experience, media }} />;
}
