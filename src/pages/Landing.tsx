import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Lock, Waves } from 'lucide-react';
import missionNavisLogo from '@/assets/mission-navis-logo.jpg';
const Landing = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-primary via-primary/90 to-primary/70">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--accent))_0%,_transparent_50%)] animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={missionNavisLogo} 
                alt="Mission Navis - Bateau de Secours" 
                className="w-48 h-48 object-contain animate-pulse"
              />
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              MISSION NAVIS
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              Bateau de Secours
            </p>
          </div>

          {/* Description */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 space-y-4">
            <p className="text-lg text-white leading-relaxed">
              Une tempête dévastatrice vient de frapper une île isolée. 
              Les réserves s'épuisent. Vous êtes l'équipe d'intervention d'urgence 
              chargée de reconstruire le bateau de secours.
            </p>
            <p className="text-white/90">
              Résolvez les énigmes, déverrouillez les boîtes, 
              assemblez le bateau. Chaque minute compte pour sauver des vies !
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-white text-sm font-medium">2-4 joueurs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-white text-sm font-medium">15-20 min</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Lock className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-white text-sm font-medium">4 boîtes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Waves className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Mission</p>
            </div>
          </div>

          {/* CTA */}
          <Button onClick={() => navigate('/connect')} size="lg" className="w-full text-lg px-8 bg-secondary hover:bg-secondary/90 shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-gray-900">
            ACCEPTER LA MISSION →
          </Button>
        </div>
      </div>
    </div>;
};
export default Landing;