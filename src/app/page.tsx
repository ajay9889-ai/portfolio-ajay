import { CustomCursor } from '@/components/CustomCursor';
import { Navbar } from '@/components/Navbar';
import { PickYourPath } from '@/components/PickYourPath';
import { HeroSection } from '@/components/HeroSection';
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
    <div className="min-h-screen max-w-full overflow-x-hidden bg-bg text-ink selection:bg-accent selection:text-white transition-colors duration-500">
      <CustomCursor />
      <Navbar />
      <PickYourPath />
      <main className="relative w-full overflow-x-hidden">
        {/* Full-screen Hero incorporating the living 3D Orbit on the right */}
        <HeroSection />
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
