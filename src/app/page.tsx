import { CustomCursor } from '@/components/CustomCursor';
import { Navbar } from '@/components/Navbar';
import { PickYourPath } from '@/components/PickYourPath';
import { HeroSection } from '@/components/HeroSection';
import { OrbitHero } from '@/components/OrbitHero';
import { MarqueeBand } from '@/components/MarqueeBand';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { WorkSection } from '@/components/WorkSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ContactSection } from '@/components/ContactSection';
import { FloatingControls } from '@/components/FloatingControls';
import { CommandPalette } from '@/components/CommandPalette';
import { AIAssistantDrawer } from '@/components/AIAssistantDrawer';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-ink selection:bg-accent selection:text-white transition-colors duration-500">
      <CustomCursor />
      <Navbar />
      <PickYourPath />
      <main className="relative">
        <HeroSection />
        {/* Living 3D Orbit Shape with Orbiting Particles */}
        <OrbitHero />
        <MarqueeBand />
        <AboutSection />
        <SkillsSection />
        <WorkSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <FloatingControls />
      <CommandPalette />
      <AIAssistantDrawer />
      <Footer />
    </div>
  );
}
