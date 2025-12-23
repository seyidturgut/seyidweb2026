import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowDown, ExternalLink, Smartphone, Video, Feather, ChevronRight, ChevronLeft, Hexagon, Zap, Fingerprint, PlayCircle, Star, MessageCircle, Headphones, LayoutGrid, Monitor, PenTool, Palette, Gift, X, Gamepad2, Layers, RotateCcw, ArrowUp } from 'lucide-react';
import AudioPlayer from './components/AudioPlayer';
import { CONTENT } from './constants';
import { Language } from './types';

// --- ANIMATION VARIANTS ---

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '100%' : '-100%',
    scale: 0.9,
    opacity: 0,
    filter: 'blur(8px)'
  }),
  center: {
    zIndex: 1,
    y: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      y: { type: "spring", stiffness: 300, damping: 35 },
      scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.5 },
      filter: { duration: 0.5 }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? '50%' : '-50%', // Parallax exit
    scale: 0.9,
    opacity: 0,
    filter: 'blur(8px)',
    transition: {
      y: { type: "spring", stiffness: 300, damping: 35 },
      scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.4 }
    }
  })
};

const textReveal = {
  hidden: { y: 80, opacity: 0, rotateX: 20 },
  visible: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { delay: i * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  })
};

const floatAnim = {
  animate: {
    y: [0, -15, 0],
    transition: { duration: 6, ease: "easeInOut", repeat: Infinity }
  }
};

// --- BACKGROUND PARTICLES ---
const BackgroundParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: Math.random() * window.innerHeight,
          opacity: Math.random() * 0.3
        }}
        animate={{ 
          y: [null, Math.random() * -100],
          opacity: [null, Math.random() * 0.5, 0]
        }}
        transition={{ 
          duration: 10 + Math.random() * 20, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-1 h-1 bg-brand-accent rounded-full blur-[1px]"
      />
    ))}
  </div>
);

// --- FLAPPY GAME COMPONENT ---

const GAME_GRAVITY = 0.6;
const GAME_JUMP = -10;
const GAME_SPEED = 4;
const SPAWN_RATE = 1500; // ms

interface GameItem {
  id: number;
  x: number;
  y: number; // Percentage 10-90
  type: number; // 0: Pen, 1: Palette, 2: Layers
  collected: boolean;
}

const FlappyGame: React.FC<{ content: any, onClose: () => void }> = ({ content, onClose }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
  const [score, setScore] = useState(0);
  const [birdY, setBirdY] = useState(50); // Percentage
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [items, setItems] = useState<GameItem[]>([]);
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- GAME LOOP ---
  const gameLoop = useCallback((time: number) => {
    if (gameState !== 'playing') return;

    // Delta time calculation
    // const deltaTime = time - lastTimeRef.current; // Not strictly used for physics here to keep it simple, but good for consistent speed
    lastTimeRef.current = time;

    // 1. Update Physics (Bird)
    setBirdVelocity(v => v + GAME_GRAVITY);
    setBirdY(y => {
      const newY = y + (birdVelocity * 0.15); // Scale velocity to screen %
      // Check collision with floor (100%) or ceiling (0%)
      if (newY >= 95) {
        setGameState('gameover');
        return 95;
      }
      if (newY < 0) return 0; // Clamp ceiling
      return newY;
    });

    // 2. Spawn Items
    if (time - lastSpawnTime.current > SPAWN_RATE) {
      const newItem: GameItem = {
        id: Date.now(),
        x: 100, // Start at right edge
        y: Math.random() * 70 + 10, // Random height 10-80%
        type: Math.floor(Math.random() * 3),
        collected: false
      };
      setItems(prev => [...prev, newItem]);
      lastSpawnTime.current = time;
    }

    // 3. Move Items & Check Collisions
    setItems(prevItems => {
      return prevItems
        .map(item => ({ ...item, x: item.x - (GAME_SPEED * 0.1) })) // Move left
        .filter(item => item.x > -10); // Remove if off screen
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, birdVelocity]);

  // --- COLLISION DETECTION (Separate Effect for clarity) ---
  useEffect(() => {
    if (gameState !== 'playing') return;

    // We check collision based on current rendered state
    // Bird is at approx 20% left (fixed x), variable birdY
    // Item is at variable item.x, item.y
    // Simple box collision approximation in percentages
    
    items.forEach(item => {
      if (item.collected) return;

      // Hitbox approximation
      // Bird: X=20%..25%, Y=birdY..birdY+5%
      // Item: X=item.x..item.x+5%, Y=item.y..item.y+5%
      
      const birdLeft = 10; // Bird is positioned at left: 10%
      const birdRight = 20; 
      const birdTop = birdY;
      const birdBottom = birdY + 8; // Approx height %

      const itemLeft = item.x;
      const itemRight = item.x + 6;
      const itemTop = item.y;
      const itemBottom = item.y + 6;

      if (
        birdRight > itemLeft &&
        birdLeft < itemRight &&
        birdBottom > itemTop &&
        birdTop < itemBottom
      ) {
        // Collision!
        collectItem(item.id);
      }
    });

  }, [birdY, items, gameState]);

  const collectItem = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, collected: true } : i));
    setScore(s => {
      const newScore = s + 10;
      if (newScore >= 100) {
        setGameState('won');
      }
      return newScore;
    });
  };

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, gameLoop]);

  // --- CONTROLS ---
  const jump = useCallback(() => {
    if (gameState === 'playing') {
      setBirdVelocity(GAME_JUMP);
    } else if (gameState === 'start' || gameState === 'gameover') {
      startGame();
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault(); // Prevent scrolling
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const startGame = () => {
    setScore(0);
    setBirdY(50);
    setBirdVelocity(0);
    setItems([]);
    setGameState('playing');
    lastTimeRef.current = performance.now();
    lastSpawnTime.current = performance.now();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col overflow-hidden font-sans">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 bg-brand-accent/20 px-4 py-2 rounded-full border border-brand-accent/50">
          <span className="text-brand-accent font-bold uppercase tracking-wider text-xs">{content.game.score}</span>
          <span className="text-white font-bold text-xl">{score}</span>
        </div>
        <button 
          onClick={onClose}
          className="bg-white/10 p-2 rounded-full hover:bg-white/20 text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Game Area */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full bg-gradient-to-b from-gray-900 to-black overflow-hidden cursor-pointer"
        onPointerDown={jump}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

        {/* Player (Bird) */}
        <motion.div
          className="absolute left-[10%] w-12 h-12 md:w-16 md:h-16 z-10"
          style={{ 
            top: `${birdY}%`,
          }}
          animate={{
            rotate: birdVelocity * 3 // Tilt based on velocity
          }}
          transition={{ type: "tween", duration: 0.1 }}
        >
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykOXDsM5Da5NEC4dhSC_0TgablqPFURV_xQ&s"
            alt="Player"
            className="w-full h-full rounded-full border-2 border-brand-accent shadow-[0_0_20px_rgba(45,212,191,0.8)]"
          />
        </motion.div>

        {/* Items */}
        <AnimatePresence>
          {items.map(item => !item.collected && (
            <div
              key={item.id}
              className="absolute w-10 h-10 flex items-center justify-center bg-white/10 rounded-full border border-white/30 shadow-lg text-white"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
              }}
            >
              {item.type === 0 ? <PenTool size={20} /> : item.type === 1 ? <Palette size={20} /> : <Layers size={20} />}
            </div>
          ))}
        </AnimatePresence>

        {/* Floor */}
        <div className="absolute bottom-0 w-full h-[5%] bg-gradient-to-t from-brand-accent/50 to-transparent border-t border-brand-accent z-10"></div>
      </div>

      {/* Mobile Controls (Visible on Touch devices primarily, but kept for visual affordance) */}
      <div className="h-24 bg-black border-t border-white/10 flex items-center justify-center px-6 md:hidden">
        <button 
          onPointerDown={(e) => { e.stopPropagation(); jump(); }}
          className="w-full h-16 bg-brand-accent/20 border border-brand-accent rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <ArrowUp className="text-brand-accent" size={24} />
          <span className="text-brand-accent font-bold tracking-widest uppercase">JUMP / FLY</span>
        </button>
      </div>
      <div className="hidden md:flex h-12 bg-black border-t border-white/10 items-center justify-center text-gray-500 text-sm font-mono tracking-widest">
         [ SPACE TO JUMP ]
      </div>


      {/* Overlays (Start / Game Over / Win) */}
      <AnimatePresence>
        {gameState === 'start' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <div className="text-center max-w-md pointer-events-none">
              <Gamepad2 size={64} className="mx-auto mb-6 text-brand-accent" />
              <h2 className="text-4xl font-serif text-white mb-4">{content.game.startTitle}</h2>
              <p className="text-gray-300 mb-8">{content.game.startDesc}</p>
              <div className="flex flex-col gap-2 text-sm text-gray-400 font-mono">
                <span className="md:hidden flex items-center justify-center gap-2"><Fingerprint size={16}/> {content.game.mobileInstruction}</span>
                <span className="hidden md:flex items-center justify-center gap-2"><Monitor size={16}/> {content.game.desktopInstruction}</span>
              </div>
              <div className="mt-8 animate-pulse text-brand-accent font-bold uppercase tracking-widest">
                TAP TO START
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-red-900/40 backdrop-blur-md p-6"
          >
            <div className="text-center">
              <h2 className="text-5xl font-serif text-white mb-2">{content.game.gameOver}</h2>
              <p className="text-xl text-gray-300 mb-8">{content.game.score}: {score}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={18} /> {content.game.tryAgain}
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'won' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border border-brand-accent p-8 rounded-3xl max-w-md w-full text-center relative shadow-[0_0_50px_rgba(45,212,191,0.3)]">
               <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-accent"
              >
                <Gift size={40} />
              </motion.div>

              <h2 className="text-2xl md:text-3xl font-serif text-white mb-4 leading-tight">
                {content.game.winTitle}
              </h2>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                {content.game.winDesc}
              </p>

              <a 
                href={`https://wa.me/905336746421?text=${encodeURIComponent(content.game.waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-[#25D366]/40"
              >
                <MessageCircle size={20} />
                {content.game.claimBtn}
              </a>
              
              <button onClick={onClose} className="mt-4 text-gray-500 hover:text-white text-sm underline">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SLIDE COMPONENTS ---

const HeroSlide: React.FC<{ content: any }> = ({ content }) => (
  <div className="h-full flex flex-col justify-center items-center text-center px-4 relative perspective-1000">
    <motion.div 
      initial={{ scale: 0, opacity: 0, rotate: -45 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 2, ease: "circOut" }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        className="w-[80vw] h-[80vw] md:w-[650px] md:h-[650px] border border-white/5 rounded-full border-dashed" 
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        className="absolute w-[60vw] h-[60vw] md:w-[450px] md:h-[450px] border border-brand-accent/20 rounded-full" 
      />
       <motion.div 
        animate={{ rotate: 180 }} 
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        className="absolute w-[40vw] h-[40vw] md:w-[300px] md:h-[300px] border border-white/10 rounded-full border-t-2 border-t-brand-accent" 
      />
    </motion.div>

    <motion.div 
      variants={floatAnim} animate="animate"
      className="relative z-10"
    >
      <motion.p 
        custom={0} variants={textReveal} initial="hidden" animate="visible"
        className="text-brand-accent tracking-[0.5em] text-xs md:text-sm font-mono mb-8 uppercase"
      >
        {content.hero.role}
      </motion.p>
      
      <div className="relative overflow-visible">
        <motion.h1 
          custom={1} variants={textReveal} initial="hidden" animate="visible"
          className="text-7xl md:text-[10rem] font-serif font-medium leading-[0.85] tracking-tight mix-blend-overlay opacity-50 absolute top-2 left-1/2 -translate-x-1/2 blur-sm"
        >
          SEYİD
        </motion.h1>
        <motion.h1 
          custom={1} variants={textReveal} initial="hidden" animate="visible"
          className="text-7xl md:text-[10rem] font-serif font-medium leading-[0.85] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-transparent"
        >
          SEYİD
        </motion.h1>
        <motion.h1 
          custom={2} variants={textReveal} initial="hidden" animate="visible"
          className="text-7xl md:text-[10rem] font-serif font-medium leading-[0.85] tracking-tight text-white"
        >
          TURGUT
        </motion.h1>
      </div>

      <motion.div 
        custom={3} variants={textReveal} initial="hidden" animate="visible"
        className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent mt-12 mb-8 mx-auto"
      />

      <motion.h2 
        custom={4} variants={textReveal} initial="hidden" animate="visible"
        className="text-lg md:text-2xl text-gray-400 font-light max-w-xl mx-auto"
      >
        {content.hero.reportTitle}
      </motion.h2>
    </motion.div>
  </div>
);

const ExecutiveSlide: React.FC<{ content: any }> = ({ content }) => (
  <div className="h-full flex flex-col md:flex-row items-center justify-center gap-16 px-6 md:px-20 max-w-7xl mx-auto">
    <motion.div 
      className="md:w-1/2 relative"
      initial="hidden" animate="visible" variants={textReveal} custom={1}
    >
      <div className="flex items-center gap-3 mb-6 relative">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-accent"></span>
        </span>
        <span className="text-brand-accent font-mono text-sm tracking-widest uppercase">{content.executive.title}</span>
      </div>
      
      <h3 className="text-4xl md:text-6xl font-serif leading-[1.1] mb-8">
        10 Million+ <br/> 
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">Active Users</span>
      </h3>
      
      <p className="text-lg text-gray-300 font-light leading-relaxed border-l border-brand-accent/50 pl-6 backdrop-blur-sm bg-white/5 p-4 rounded-r-xl">
        {content.executive.body}
      </p>
    </motion.div>

    <div className="md:w-1/2 grid grid-cols-2 gap-4 w-full perspective-500">
      {content.executive.stats?.map((stat: any, idx: number) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, rotateX: -20, y: 50 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ delay: 0.5 + (idx * 0.15), type: "spring" }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-brand-accent/50 transition-all group shadow-2xl"
        >
          <div className="flex justify-between items-start mb-2">
             <h4 className="text-2xl md:text-4xl font-bold text-white group-hover:text-brand-accent transition-colors">
              {stat.value}
            </h4>
            {idx === 0 && <Star className="text-yellow-500 w-5 h-5 fill-current" />}
          </div>
          <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const PortfolioSlide: React.FC<{ content: any }> = ({ content }) => {
  return (
    <div className="h-full flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="text-brand-accent font-mono text-sm tracking-widest">{content.portfolio.title}</span>
        <h2 className="text-4xl md:text-5xl font-serif mt-2">{content.portfolio.webTitle}</h2>
      </div>

      {/* Websites Ticker / Grid */}
      <div className="relative w-full overflow-hidden h-[40vh] mb-12 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none z-10" />
         
         <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-full scrollbar-hide">
            {content.portfolio.websites.map((site: string, i: number) => {
              const domain = site.replace('https://', '').replace('www.', '').replace('/', '');
              return (
                <motion.a
                  key={i}
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-black/40 rounded-xl hover:bg-brand-accent/10 border border-white/5 hover:border-brand-accent/30 transition-all group"
                >
                  <div className="p-2 bg-white/10 rounded-lg group-hover:text-brand-accent">
                    <Monitor size={16} />
                  </div>
                  <span className="text-sm font-mono text-gray-300 group-hover:text-white truncate">{domain}</span>
                  <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              )
            })}
         </div>
      </div>

      <h3 className="text-2xl font-serif mb-6">{content.portfolio.appTitle}</h3>
      <div className="flex flex-wrap gap-4">
        {content.portfolio.apps.map((app: any, i: number) => (
          <motion.a
            key={i}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-gray-800 to-black border border-white/10 rounded-2xl shadow-lg hover:shadow-brand-accent/20 transition-all"
          >
            <div className="bg-brand-accent/20 p-2 rounded-lg text-brand-accent">
              <Smartphone size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{app.name}</div>
              <div className="text-[10px] text-gray-400 font-mono uppercase">Google Play</div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

const UxUiSlide: React.FC<{ content: any }> = ({ content }) => (
  <div className="h-full flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto relative z-10">
    <motion.div 
      initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <span className="text-brand-accent font-mono text-sm tracking-widest">{content.uxui.title}</span>
      <h2 className="text-4xl md:text-6xl font-serif mt-2">{content.uxui.subtitle}</h2>
      <p className="mt-4 text-gray-400 max-w-2xl">{content.uxui.body}</p>
    </motion.div>

    <div className="flex flex-col md:flex-row gap-6 pb-4 md:pb-0">
      {content.uxui.items?.map((item: any, idx: number) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + (idx * 0.2), type: "spring", stiffness: 100 }}
          whileHover={{ y: -20, transition: { duration: 0.3 } }}
          className="flex-1 bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-brand-accent/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-brand-accent border border-white/10 group-hover:scale-110 transition-transform duration-500">
              {idx === 0 ? <LayoutGrid size={28} /> : idx === 1 ? <Fingerprint size={28} /> : <Zap size={28} />}
            </div>
            
            <h3 className="text-xl font-bold mb-4 group-hover:translate-x-2 transition-transform">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const VisualSlide: React.FC<{ content: any }> = ({ content }) => (
  <div className="h-full flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto relative">
    <div className="grid md:grid-cols-2 gap-20 h-[70vh] items-center">
      <div className="space-y-16 relative z-10">
        <motion.div initial="hidden" animate="visible" variants={textReveal}>
          <span className="text-brand-accent font-mono text-sm tracking-widest">{content.visual.title}</span>
          <h2 className="text-5xl md:text-7xl font-serif mt-4 leading-none">{content.visual.subtitle}</h2>
          <p className="mt-4 text-gray-400">{content.visual.body}</p>
        </motion.div>
        
        <div className="space-y-10">
          {content.visual.items?.map((item: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (idx * 0.2) }}
              whileHover={{ x: 10 }}
              className="flex items-start gap-6 group cursor-default"
            >
              <div className="mt-2 w-12 h-[1px] bg-gray-600 group-hover:bg-brand-accent group-hover:w-20 transition-all duration-300" />
              <div>
                <h4 className="text-2xl font-bold mb-2 group-hover:text-brand-accent transition-colors">{item.title}</h4>
                <p className="text-gray-400 font-light leading-relaxed max-w-md">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Abstract Design System Visual */}
      <div className="relative h-full hidden md:flex items-center justify-center perspective-1000">
        <motion.div
           animate={{ rotateY: [0, 15, 0] }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           className="relative z-10"
        >
          {/* Color Palettes */}
          <div className="absolute top-0 -right-20 w-40 h-40 bg-[#2dd4bf] rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 -left-20 w-40 h-40 bg-gold-500 rounded-full blur-3xl opacity-20" />

          {/* Phone Mockup Representation */}
          <div className="w-[320px] h-[600px] bg-black rounded-[40px] border-4 border-gray-800 shadow-2xl relative overflow-hidden flex flex-col">
             {/* Header */}
             <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
                <div className="w-4 h-4 rounded-full bg-white/20" />
                <div className="w-20 h-2 rounded-full bg-white/10" />
             </div>
             {/* Body */}
             <div className="flex-1 p-6 space-y-4">
                <div className="w-full h-32 bg-gradient-to-br from-brand-accent/20 to-transparent rounded-2xl border border-brand-accent/20 flex items-center justify-center">
                   <div className="text-brand-accent font-mono text-xs">TURQUOISE THEME</div>
                </div>
                <div className="flex gap-4">
                   <div className="flex-1 h-24 bg-white/5 rounded-2xl" />
                   <div className="flex-1 h-24 bg-white/5 rounded-2xl" />
                </div>
                <div className="w-full h-12 bg-gold-500/20 rounded-xl border border-gold-500/30 flex items-center px-4">
                   <div className="w-20 h-2 bg-gold-500/50 rounded-full" />
                </div>
             </div>
             {/* Tab Bar */}
             <div className="h-20 border-t border-white/10 flex justify-around items-center px-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/5" />
                ))}
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

const MultimediaSlide: React.FC<{ content: any }> = ({ content }) => (
  <div className="h-full flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto">
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-6"
    >
      <div>
        <span className="text-brand-accent font-mono text-sm tracking-widest">{content.multimedia.title}</span>
        <h2 className="text-4xl md:text-6xl font-serif mt-2">{content.multimedia.subtitle}</h2>
        <p className="mt-2 text-gray-400">{content.multimedia.body}</p>
      </div>
      <div className="flex gap-3 items-center mt-4 md:mt-0">
        <motion.div 
          animate={{ opacity: [1, 0.3, 1] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
        />
        <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">Live Production</span>
      </div>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-8">
      {content.multimedia.items?.map((item: any, idx: number) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3 + (idx * 0.15), type: "spring" }}
          whileHover={{ scale: 1.03 }}
          className="relative group h-96 cursor-pointer perspective-500"
        >
           {/* Card Backgrounds */}
          <div className="absolute inset-0 bg-gray-900 rounded-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-white/5" />
          <div className="absolute inset-0 bg-gray-800 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/5" />
          
          <div className="absolute inset-0 bg-black rounded-2xl border border-white/10 p-8 flex flex-col justify-between z-10 overflow-hidden">
            {/* Background Image / Video Placeholder */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
               <div className={`w-full h-full bg-gradient-to-br ${idx === 0 ? 'from-purple-900' : idx === 1 ? 'from-blue-900' : 'from-emerald-900'} to-black`} />
            </div>

            <div className="relative z-10 flex justify-between items-start">
               <div className="bg-white/10 p-3 rounded-full backdrop-blur-md">
                 {idx === 0 ? <Smartphone className="text-white" size={24} /> : idx === 1 ? <Video className="text-white" size={24} /> : <Feather className="text-white" size={24} />}
               </div>
               <span className="text-5xl font-serif text-white/10 font-bold">0{idx+1}</span>
            </div>
            
            <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.desc}</p>
            </div>

            {idx === 1 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <PlayCircle size={64} className="text-white drop-shadow-lg" />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ConclusionSlide: React.FC<{ content: any }> = ({ content }) => (
  <div className="h-full flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
     {/* Rotating Ray Background */}
     <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        className="absolute inset-[-50%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#1a1a1a_100%)] opacity-30 pointer-events-none" 
     />
     
     <motion.div
       initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
       animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
       transition={{ duration: 1.2, ease: "circOut" }}
       className="relative z-10 max-w-5xl"
     >
       <h2 className="text-5xl md:text-8xl font-serif mb-12 leading-tight">
         {content.conclusion.title}
       </h2>
     </motion.div>
     
     <motion.p 
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.6 }}
       className="text-lg md:text-2xl text-gray-300 font-light mb-16 max-w-2xl mx-auto relative z-10 leading-relaxed"
     >
       {content.conclusion.body}
     </motion.p>

     <div className="flex flex-wrap justify-center gap-6 relative z-10">
        {content.conclusion.items?.map((item: any, idx: number) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + (idx * 0.15) }}
            className="px-8 py-4 border border-white/20 bg-black/40 backdrop-blur-xl rounded-full text-sm font-mono uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-all shadow-lg cursor-default"
          >
             {item.title}
          </motion.div>
        ))}
     </div>
      <div className="mt-12 relative z-10">
          <a href="https://www.behance.net/seyidturgut" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline flex items-center gap-2">
            View Full Portfolio on Behance <ExternalLink size={16} />
          </a>
      </div>
  </div>
);

// --- INTRO MODAL COMPONENT ---

const IntroModal: React.FC<{ content: any, onStart: () => void }> = ({ content, onStart }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
    transition={{ duration: 0.8 }}
    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center"
  >
    <div className="absolute inset-0 overflow-hidden">
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
    </div>

    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="relative z-10 flex flex-col items-center max-w-2xl"
    >
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-12 relative"
      >
        <div className="absolute inset-0 bg-brand-accent/20 blur-3xl rounded-full" />
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykOXDsM5Da5NEC4dhSC_0TgablqPFURV_xQ&s"
          alt="Seyid Turgut"
          className="w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-2xl relative z-10"
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border border-brand-accent/30 rounded-full border-dashed z-0"
        />
      </motion.div>

      <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
        {content.hero.name}
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-300 font-light mb-8">
        {content.intro.welcome}
      </p>

      <div className="flex items-center gap-3 text-brand-accent/80 mb-12 bg-white/5 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md">
        <Headphones size={20} />
        <span className="text-sm font-mono tracking-wide">{content.intro.advisory}</span>
      </div>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative px-10 py-5 bg-white text-black rounded-full font-bold tracking-widest uppercase overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-3">
          {content.intro.button} <ArrowDown size={18} className="animate-bounce" />
        </span>
        <motion.div 
          className="absolute inset-0 bg-brand-accent"
          initial={{ x: '-100%' }}
          whileHover={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </motion.button>
    </motion.div>
  </motion.div>
);

// --- MAIN APP ---

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('TR');
  const [showIntro, setShowIntro] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const content = CONTENT[lang];
  
  // Slide State
  const [[page, direction], setPage] = useState([0, 0]);
  
  // Use Ref to lock scroll during animation
  const isAnimating = useRef(false);
  const touchStartY = useRef<number | null>(null);

  const slides = [
    HeroSlide,
    ExecutiveSlide,
    PortfolioSlide,
    UxUiSlide,
    VisualSlide,
    MultimediaSlide,
    ConclusionSlide
  ];

  const totalSlides = slides.length;

  const handleStartExperience = () => {
    setShowIntro(false);
    setAudioEnabled(true);
  };

  const paginate = useCallback((newDirection: number) => {
    if (isAnimating.current || showIntro || gameActive) return; // Disable scroll during intro or game
    
    const newPage = page + newDirection;
    if (newPage < 0 || newPage >= totalSlides) return;

    isAnimating.current = true;
    setPage([newPage, newDirection]);
    
    setTimeout(() => {
      isAnimating.current = false;
    }, 1000); 
  }, [page, totalSlides, showIntro, gameActive]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro || gameActive) return; // Disable slide nav if game active
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') paginate(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate, showIntro, gameActive]);

  // Wheel Navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (showIntro || gameActive) return;
      if (Math.abs(e.deltaY) > 15) {
        if (e.deltaY > 0) paginate(1);
        else paginate(-1);
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [paginate, showIntro, gameActive]);

  // Touch Navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartY.current || showIntro || gameActive) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 30) {
       if (diff > 0) paginate(1);
       else paginate(-1);
    }
    touchStartY.current = null;
  };

  const CurrentSlideComponent = slides[page];

  return (
    <div 
      className="fixed inset-0 bg-brand-dark font-sans text-white overflow-hidden selection:bg-brand-accent selection:text-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {showIntro && (
          <IntroModal content={content} onStart={handleStartExperience} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!showIntro && gameActive) && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-[60]">
             <FlappyGame content={content} onClose={() => setGameActive(false)} />
           </motion.div>
        )}
      </AnimatePresence>

      <BackgroundParticles />

      {/* BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05], rotate: [0, -45, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* HEADER NAV */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto"
        >
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykOXDsM5Da5NEC4dhSC_0TgablqPFURV_xQ&s"
            alt="Seyid Turgut Logo"
            className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
        
        <div className="flex items-center gap-3 pointer-events-auto">
          {!gameActive && (
            <motion.button 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              onClick={() => setGameActive(true)}
              className={`flex items-center gap-2 text-xs font-bold border border-white/20 rounded-full px-4 py-2 hover:bg-white hover:text-black transition-all uppercase tracking-wider backdrop-blur-md bg-black/20 text-white`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">GAME</span>
            </motion.button>
          )}

          <motion.button 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => setLang(l => l === 'TR' ? 'EN' : 'TR')}
            className="flex items-center gap-2 text-xs font-bold border border-white/20 rounded-full px-4 py-2 hover:bg-white hover:text-black transition-all uppercase tracking-wider bg-black/20 backdrop-blur-md"
          >
            <Globe className="w-3 h-3" />
            <span>{lang}</span>
          </motion.button>
        </div>
      </nav>

      {/* SIDE NAVIGATION (DOTS) */}
      <div className={`fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-6 ${gameActive ? 'opacity-0 pointer-events-none' : ''}`}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isAnimating.current || idx === page || showIntro) return;
              isAnimating.current = true;
              setPage([idx, idx > page ? 1 : -1]);
              setTimeout(() => { isAnimating.current = false; }, 1000);
            }}
            className="group relative flex items-center justify-center w-4 h-4"
          >
             <div className={`absolute w-2 h-2 rounded-full transition-all duration-500 ${idx === page ? 'bg-brand-accent scale-150' : 'bg-white/20 group-hover:bg-white/50'}`} />
             {idx === page && (
               <motion.div 
                 layoutId="activeDot"
                 className="absolute w-8 h-8 rounded-full border border-brand-accent/30"
                 transition={{ duration: 0.5 }}
               />
             )}
          </button>
        ))}
      </div>

      {/* MOBILE NAV CONTROLS */}
      {!gameActive && (
        <div className="fixed bottom-24 right-6 z-40 md:hidden flex gap-4">
          <button onClick={() => paginate(-1)} disabled={page === 0} className="p-4 bg-white/5 rounded-full disabled:opacity-30 backdrop-blur-md border border-white/10 active:scale-95 transition-transform">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => paginate(1)} disabled={page === totalSlides - 1} className="p-4 bg-white/5 rounded-full disabled:opacity-30 backdrop-blur-md border border-white/10 active:scale-95 transition-transform">
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* MAIN SLIDE AREA */}
      <main className={`relative w-full h-full z-10 ${gameActive ? 'opacity-0 pointer-events-none' : ''}`}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full overflow-y-auto md:overflow-hidden"
          >
            <div className="min-h-full w-full py-24 md:py-0 flex flex-col">
               <div className="flex-1 flex flex-col relative">
                  <CurrentSlideComponent content={content} />
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* PROGRESS BAR BOTTOM */}
      {!gameActive && (
        <motion.div 
          className="fixed bottom-0 left-0 h-1 bg-brand-accent z-50 shadow-[0_0_20px_rgba(45,212,191,0.5)]"
          animate={{ width: `${((page + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.8, ease: "circOut" }}
        />
      )}

      <AudioPlayer uiLabels={content.ui} shouldPlay={audioEnabled} />
    </div>
  );
};

export default App;