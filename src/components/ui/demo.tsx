import { IconCloud } from "./interactive-icon-cloud"
import { StaggerTestimonials } from "./stagger-testimonials"

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "openjdk",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonwebservices",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "vscodium",
  "androidstudio",
  "sonarqube",
  "figma",
]

export function IconCloudDemo() {
  return (
    <div className="relative flex w-full max-w-md items-center justify-center overflow-visible bg-transparent p-0">
      <IconCloud iconSlugs={slugs} />
    </div>
  )
}

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <StaggerTestimonials />
    </div>
  );
};

export { DemoOne };
