import type { Metadata } from "next";
import ExperienceLayout from "../experience-layout";
import { getExperience } from "../data";

export const metadata: Metadata = {
  title: "Monet | Experience",
  description:
    "Unreal Engine developer experience at Monet (QSTP), building interactive 3D venue planning and multiplayer collaboration tools.",
};

export default function MonetExperiencePage() {
  const experience = getExperience("monet");

  if (!experience) {
    return null;
  }

  return <ExperienceLayout experience={experience} />;
}
