import { fetchProfile, fetchProjects, fetchSkills, fetchExperiences } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default async function HomePage() {
  // Fetch live portfolio data from Node.js backend with resilient fallback
  const [profile, projects, skillCategories, experiences] = await Promise.all([
    fetchProfile(),
    fetchProjects(),
    fetchSkills(),
    fetchExperiences(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-primary/30 selection:text-white">
      <Navbar />
      <main>
        <HeroSection profile={profile} />
        <ProjectsSection projects={projects} />
        <SkillsSection skillCategories={skillCategories} />
        <ExperienceSection experiences={experiences} />
        <ContactSection profile={profile} />
      </main>
      <Footer />
    </div>
  );
}
