import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameMap } from './engine/worldMap';
import { PlayerAvatar } from './engine/player';
import { audio } from './engine/audio';
import { TILE_SIZE, PORTRAIT_EXPRESSIONS } from './engine/sprites';
import { INITIAL_CAREER_DATA } from './data/careerData';
import { CareerData, Hotspot, LightingMode, OutfitType, Achievement, PortraitExpressionId } from './types/game';

import { HUD } from './components/HUD';
import { GameCanvas } from './components/GameCanvas';
import { StratigraphicElevator } from './components/StratigraphicElevator';
import { ZoneBanner } from './components/ZoneBanner';
import { ActionPrompt } from './components/ActionPrompt';
import { RigRadioModal } from './components/RigRadioModal';
import { HotspotModal } from './components/HotspotModal';
import { BackpackModal } from './components/BackpackModal';
import { SeismicMiniGameModal } from './components/SeismicMiniGameModal';
import { KickMiniGameModal } from './components/KickMiniGameModal';
import { RockRouletteModal } from './components/RockRouletteModal';
import { ShiftDodgeModal } from './components/ShiftDodgeModal';
import { KimberliteClassifierModal } from './components/KimberliteClassifierModal';
import { SarDespecklingModal } from './components/SarDespecklingModal';
import { ArtExhibitModal } from './components/ArtExhibitModal';
import { LiveUpdaterModal } from './components/LiveUpdaterModal';
import { BossResumeModal } from './components/BossResumeModal';

export const App: React.FC = () => {
  const [careerData, setCareerData] = useState<CareerData>(() => {
    try {
      const saved = localStorage.getItem('rajdeep_boss_cv_custom');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CAREER_DATA;
  });

  const [stats, setStats] = useState(INITIAL_CAREER_DATA.stats);
  const [outfit, setOutfit] = useState<OutfitType>('scholar');
  const [isPortraitCanvas, setIsPortraitCanvas] = useState(true);
  const [lightingMode, setLightingMode] = useState<LightingMode>('day');
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<PortraitExpressionId>('wicked_smirk');
  const [isGodMode, setIsGodMode] = useState(false);

  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [hotspotModalData, setHotspotModalData] = useState<{ title: string; content: string }>({
    title: '',
    content: ''
  });

  const [zoneBanner, setZoneBanner] = useState<{ visible: boolean; title: string; desc: string }>({
    visible: true,
    title: 'Alma Mater & Early Foundations Wing',
    desc: 'IIT (ISM) Dhanbad, Jadavpur Univ, Theses & Geological Fieldwork'
  });

  // Persistent map & player instances
  const mapRef = useRef<GameMap>(new GameMap());
  const playerRef = useRef<PlayerAvatar>(new PlayerAvatar(8 * TILE_SIZE, 11 * TILE_SIZE));

  const showZoneNotification = useCallback((title: string, desc: string) => {
    setZoneBanner({ visible: true, title, desc });
    setTimeout(() => {
      setZoneBanner(prev => ({ ...prev, visible: false }));
    }, 3800);
  }, []);

  const setExpression = useCallback((exprId: PortraitExpressionId, playSound: boolean = true) => {
    setCurrentExpression(exprId);
    if (playSound) {
      const expr = PORTRAIT_EXPRESSIONS.find(e => e.id === exprId);
      if (expr) {
        audio.playExpressionChirp(expr.sound.freq, expr.sound.type, expr.sound.duration);
      }
    }
  }, []);

  const activateGodMode = useCallback(() => {
    setIsGodMode(true);
    playerRef.current.isGodMode = true;
    setExpression('deal_with_it', true);
    audio.playGodModeChime();
    playerRef.current.showBubble("👑 CHIEF EXPLORER GOD MODE! (2.5x Speed + Diamond Hammer) Deal with it.", 3.5);
  }, [setExpression]);

  // Set up player callbacks and global listeners
  useEffect(() => {
    const player = playerRef.current;
    player.onZoneChange = (z) => {
      setOutfit(player.outfit);
      showZoneNotification(z.name, z.desc);
    };

    // 13th-Day Shift Zombie Idle Callback
    player.onIdleZombie = () => {
      setExpression('shift_zombie', false);
      player.showBubble("13th-Day shift fatigue... need coffee...", 2.2);
    };

    // DevTools Console ASCII Art Welcome
    console.log(
      "%c" +
      "       /\\\n" +
      "      /  \\       ===============================================================\n" +
      "     / /\\ \\      GEOLOGY QUEST: BASIN TO BIT — 16-BIT RETRO RPG PORTFOLIO\n" +
      "    / /__\\ \\     Player: Rajdeep Tarafder (Wellsite & Exploration Geologist | ONGC)\n" +
      "   |   ||   |    CPF: 141604 | Email: tarafderrajdeep@gmail.com | +91 90075 15735\n" +
      "   |   ||   |    LinkedIn: https://linkedin.com/in/rajdeep-tarafder-82a408184\n" +
      "   |   ||   |    ===============================================================\n" +
      "  /==========\\   Core Arsenal: Petrel, PaleoScan, 3D MEM, Post Drill Analysis,\n" +
      " / /|      |\\ \\  Wellsite Surveillance, Natural H2 & He, Supervised ML (EPMA)\n" +
      "/_/ |______|_\\_\\ Subsurface decoded! Reach out to Rajdeep: tarafderrajdeep@gmail.com\n",
      "color: #F59E0B; font-weight: bold; font-family: monospace; font-size: 11px;"
    );

    // Global Key Listener: Konami Code & Ctrl+S Rescue
    const konamiSequence = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIndex = 0;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Petrel 4:59 PM Rescue Shortcut: Ctrl+S
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setStats(prev => ({ ...prev, currentXP: prev.currentXP + 50 }));
        setExpression('wicked_smirk', true);
        playerRef.current.showBubble("💾 CTRL+S RESCUE! Prospect model saved! +50 XP", 2.5);
        audio.playFanfare();
      }

      // Konami Code Detection
      const target = konamiSequence[konamiIndex].toLowerCase();
      if (e.key.toLowerCase() === target) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          konamiIndex = 0;
          activateGodMode();
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    // Auto hide initial welcome zone toast
    const t = setTimeout(() => {
      setZoneBanner(prev => ({ ...prev, visible: false }));
    }, 4000);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      clearTimeout(t);
    };
  }, [showZoneNotification, activateGodMode, setExpression]);

  const addXP = useCallback((amount: number) => {
    setStats(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let newMax = prev.maxXP;

      while (newXP >= newMax) {
        newXP -= newMax;
        newLevel += 1;
        newMax = Math.round(newMax * 1.35);
        playerRef.current.showBubble(`⭐ LEVEL UP! NOW LEVEL ${newLevel}!`, 3.0);
        audio.playFanfare();
        setExpression('deal_with_it', true);
      }

      return {
        ...prev,
        currentXP: newXP,
        level: newLevel,
        maxXP: newMax
      };
    });
  }, [setExpression]);

  const handleTogglePortrait = () => {
    setIsPortraitCanvas(prev => !prev);
    audio.playTone(600, 'square', 0.05, 0.1);
  };

  const handleToggleAudio = () => {
    const newState = audio.toggleMute();
    setIsAudioOn(newState);
  };

  const handleToggleLighting = () => {
    setLightingMode(prev => {
      if (prev === 'day') return 'sunset';
      if (prev === 'sunset') return 'night';
      return 'day';
    });
  };

  const handleTeleport = (targetZone: 'academic' | 'lab' | 'rig') => {
    const p = playerRef.current;
    if (targetZone === 'academic') {
      p.x = 8 * TILE_SIZE;
      p.y = 11 * TILE_SIZE;
    } else if (targetZone === 'lab') {
      p.x = 28 * TILE_SIZE;
      p.y = 11 * TILE_SIZE;
    } else {
      p.x = 48 * TILE_SIZE;
      p.y = 11 * TILE_SIZE;
    }
    audio.playFanfare();
    p.showBubble('⚡ Fast travel warp!', 1.5);
  };

  const handleSelectDepth = (depth: number, x: number, y: number) => {
    const p = playerRef.current;
    p.x = x;
    p.y = y;
    audio.playDrillBitWhir();
    p.showBubble(`⚡ Stratigraphic drill drop to ${depth}m!`, 2.5);
    setActiveModal(null);
  };

  const handleTriggerHotspot = (h: Hotspot) => {
    if (h.specialType === 'minigame_seismic') {
      setExpression('wicked_smirk');
      setActiveModal('minigame_seismic');
    } else if (h.specialType === 'minigame_kick') {
      setExpression('blowout_sweat');
      setActiveModal('minigame_kick');
    } else if (h.specialType === 'minigame_rock') {
      setExpression('loupe_cyclops');
      setActiveModal('minigame_rock');
    } else if (h.specialType === 'minigame_shift') {
      setExpression('caffeine_overdrive');
      setActiveModal('minigame_shift');
    } else if (h.specialType === 'minigame_kimberlite') {
      setExpression('kimberlite_eureka');
      setActiveModal('minigame_kimberlite');
    } else if (h.specialType === 'minigame_sar') {
      setExpression('matrix_hacker');
      setActiveModal('minigame_sar');
    } else if (h.specialType === 'art_exhibit') {
      setActiveModal('art_exhibit');
    } else if (h.specialType === 'helium_gag') {
      playerRef.current.heliumTimer = 10.0;
      setExpression('helium_chipmunk');
      playerRef.current.showBubble('INHALED PURE HELIUM-4 FROM DEEP BASEMENT! *SQUEEEEAK!*', 3.0);
      audio.playHeliumChirp();
      setHotspotModalData({
        title: 'Unconventional Energy: Natural H2 & Helium (He)',
        content: `
          <p><strong>Clean Energy Transition Frontier &bull; Vindhyan &amp; Chhattisgarh Basins</strong></p>
          <p>Pioneering exploration for deep-seated Natural Hydrogen (H2) and non-hydrocarbon noble gas Helium (He) trapped along basement fracture networks.</p>
          <h4>Exploration Arsenals:</h4>
          <ul>
            <li>Deep crustal structural lineament extraction and basement reactivation modeling.</li>
            <li>Isotopic geochemical surveillance of carrier gas degassing anomalies.</li>
            <li>Synthesis of tight cap-rock seal integrity and basement granite heat production.</li>
          </ul>
          <p><em>Notice: Rajdeep's speech bubbles are now floating squeakily for the next 10 seconds!</em></p>
        `
      });
      setActiveModal('hotspot_detail');
    } else {
      openHotspotDetails(h.id, h.title);
    }
  };

  const openHotspotDetails = (id: string, title: string) => {
    audio.playTone(880, 'sine', 0.1, 0.15);

    if (id === 'hotspot_marine') {
      setExpression('matrix_hacker');
      setHotspotModalData({
        title,
        content: `
          <h4>Marine Biogeochemistry Lab Bench: Jadavpur University (2019–2020)</h4>
          <p><strong>"Exchange of Iron from Atmosphere to Ocean Under Anthropogenic Inducements"</strong></p>
          <p>Investigated aerosol Fe solubility, mineral dust deposition, and marine phytoplankton nutrient bioavailability in High-Nutrient Low-Chlorophyll (HNLC) ocean regimes.</p>
          <ul>
            <li>Aerosol leaching experiments and spectrophotometric iron speciation.</li>
            <li>Coupled atmospheric-oceanic biogeochemical flux modeling.</li>
          </ul>
        `
      });
    } else if (id === 'hotspot_fossil') {
      setExpression('kimberlite_eureka');
      setHotspotModalData({
        title,
        content: `
          <h4>Glass Mineral &amp; Fossil Display Case</h4>
          <p>Curated rare geological specimens collected across Indian stratigraphic basins:</p>
          <ul>
            <li><strong>Pyrope Garnet (Cr-rich G10):</strong> Kimberlitic diamond indicator from Panna diamond field.</li>
            <li><strong>Banded Iron Formation (BIF / BHQ):</strong> Archean high-grade hematite ore from SAIL Dalli-Rajhara.</li>
            <li><strong>Stromatolitic Dolomite:</strong> Proterozoic cyanobacterial laminations from the Vindhyan Supergroup.</li>
          </ul>
        `
      });
    } else if (id === 'hotspot_field') {
      setExpression('loupe_cyclops');
      setHotspotModalData({
        title,
        content: `
          <h4>Expedition Field Mapping Table</h4>
          <p>Comprehensive field mapping folios and structural measurement stations:</p>
          <ul>
            <li><strong>Chandipur Coastal Facies:</strong> Walther's Law deltaic and tidal sedimentary logs.</li>
            <li><strong>Ghatsila Metamorphic Belt:</strong> Structural cleavage, fold axis stereonets, and shear zone kinematics.</li>
            <li><strong>Chhota Nagpur Gneissic Complex:</strong> High-grade Precambrian migmatites and pegmatite intrusions.</li>
          </ul>
        `
      });
    } else if (id === 'hotspot_plotter') {
      setExpression('wicked_smirk');
      setHotspotModalData({
        title,
        content: `
          <h4>Wide-Format GIS Map Plotter Roll</h4>
          <p>High-resolution cartographic output for ONGC Vindhyan Block exploratory portfolios:</p>
          <ul>
            <li>Regional Bouguer gravity &amp; magnetic anomaly overlays of the Son Valley.</li>
            <li>Matured drillable prospect folios across BExB and EPMB blocks.</li>
            <li>Stratigraphic correlation panels across deep exploratory test wells.</li>
          </ul>
        `
      });
    } else if (id === 'hotspot_derrick') {
      setExpression('blowout_sweat');
      setHotspotModalData({
        title,
        content: `
          <h4>Active Drilling Derrick Mast &amp; Rotary Table</h4>
          <p>Frontline wellsite operational telemetry at GDA-A Samastipur:</p>
          <ul>
            <li>Real-time Weight on Bit (WOB), Torque, Standpipe Pressure (SPP), and ROP monitoring.</li>
            <li>Cuttings lag-time calculation and formation top identification.</li>
            <li>Coordinated wireline logging runs and 8.5" casing cementing operations.</li>
          </ul>
        `
      });
    } else if (id === 'hotspot_cementing') {
      setExpression('blowout_sweat');
      setHotspotModalData({
        title,
        content: `
          <h4>High-Pressure Cementing Unit (GDA-A Squeeze)</h4>
          <p>Supervised critical cementing operation at GDA-A exploratory well:</p>
          <ul>
            <li>Execution of open-ended drill pipe cement squeeze across loss zone.</li>
            <li>Slurry density (1.92 SG), thickening time, and compressive strength quality control.</li>
            <li>Successful zonal isolation and formation pressure integrity test (FIT/LOT).</li>
          </ul>
        `
      });
    } else if (id === 'hotspot_bop') {
      setExpression('blowout_sweat');
      setHotspotModalData({
        title,
        content: `
          <h4>Blowout Preventer (BOP) Stack &amp; Koomey Unit</h4>
          <p>Well control and secondary barrier safeguards:</p>
          <ul>
            <li>10,000 PSI rated annular and double-ram BOP stack configuration.</li>
            <li>Hydraulic accumulator bottle bank (Koomey unit) with fast-acting manifold control.</li>
            <li>Weekly functional pressure testing and strict compliance with Zero LTI protocols.</li>
          </ul>
        `
      });
    } else if (id === 'hotspot_trekking') {
      setExpression('centre_back');
      setHotspotModalData({
        title,
        content: `
          <h4>Himalayan Trekking Expedition Camp</h4>
          <p>High-altitude alpine expeditions shaping endurance and geological observation:</p>
          <ul>
            <li>Traversed Dafeybhir Pass (Sikkim) and high Himalayan passes of Himachal Pradesh.</li>
            <li>Structural mapping of Main Central Thrust (MCT) hanging wall metamorphic sequences.</li>
            <li>Trekker endurance translating to resilient 24-hour frontline drilling shifts!</li>
          </ul>
        `
      });
    } else if (id === 'hotspot_gym') {
      setExpression('centre_back');
      setHotspotModalData({
        title,
        content: `
          <h4>Athletic Leadership &amp; Football Championship</h4>
          <ul>
            <li>Starting Centre-Back across 4 consecutive seasons for IIT (ISM) Dhanbad &amp; Jadavpur University.</li>
            <li>Winner: Inter-Departmental Football Championship (March 2022) &amp; Geological Society Football Cup.</li>
            <li>Trained with heavy core-box loaded barbell lifting (+10 Physical Endurance).</li>
          </ul>
        `
      });
    } else if (id === 'hotspot_shaker') {
      setExpression('loupe_cyclops');
      setHotspotModalData({
        title,
        content: `
          <h4>Shale Shakers &amp; Cuttings Lithology</h4>
          <ul>
            <li>24/7 lithological cuttings surveillance under binocular microscope.</li>
            <li>Direct ultraviolet fluorescence testing and chemical solvent cut evaluation.</li>
            <li>Total Gas and C1 to C5 chromatographic breakout analysis.</li>
          </ul>
        `
      });
    } else {
      setExpression('wicked_smirk');
      setHotspotModalData({
        title,
        content: `<p>Operational workstation: <strong>${title}</strong>. Integrated with active ONGC subsurface &amp; frontline operational data streams.</p>`
      });
    }

    setActiveModal('hotspot_detail');
  };

  const handleOpenBackpack = () => {
    setActiveModal('backpack');
  };

  const handleOpenBossResume = () => {
    setExpression('deal_with_it', false);
    setActiveModal('boss_resume');
  };

  const handleAddMilestone = (title: string, date: string, category: string, desc: string) => {
    const newAch: Achievement = {
      id: `ach_${Date.now()}`,
      title,
      date,
      category,
      badge: 'LIVE FIELD UPDATE',
      xp: 200,
      description: desc
    };

    setCareerData(prev => ({
      ...prev,
      achievements: [newAch, ...(prev.achievements || [])]
    }));

    // Spawn pedestal on map
    mapRef.current.spawnAchievementPedestal(newAch);

    // Reward XP
    addXP(200);

    playerRef.current.showBubble(`🎉 NEW MILESTONE SPAWNED IN ${category.toUpperCase()}!`, 3.0);
    audio.playFanfare();
  };

  const handleDeleteMilestone = (id: string) => {
    setCareerData(prev => ({
      ...prev,
      achievements: (prev.achievements || []).filter(a => a.id !== id)
    }));
  };

  const closeAllModals = () => {
    setActiveModal(null);
  };

  return (
    <div className="game-app">
      {/* Top Navigation HUD */}
      <HUD
        player={careerData.player}
        stats={stats}
        outfit={outfit}
        currentExpression={currentExpression}
        isGodMode={isGodMode}
        isPortraitCanvas={isPortraitCanvas}
        onTogglePortrait={handleTogglePortrait}
        onActivateGodMode={activateGodMode}
        onTeleport={handleTeleport}
        onToggleElevator={() => setActiveModal(prev => prev === 'strat_elevator' ? null : 'strat_elevator')}
        onOpenBackpack={handleOpenBackpack}
        onOpenLiveUpdater={() => setActiveModal('live_updater')}
        lightingMode={lightingMode}
        onToggleLighting={handleToggleLighting}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
        onOpenBossResume={handleOpenBossResume}
      />

      {/* Viewport for 2D Tilemap & Avatar */}
      <GameCanvas
        map={mapRef.current}
        player={playerRef.current}
        activeHotspot={activeHotspot}
        onActiveHotspotChange={setActiveHotspot}
        onTriggerHotspot={handleTriggerHotspot}
        onFastTravel={handleTeleport}
        onOpenBackpack={handleOpenBackpack}
        onOpenLiveUpdater={() => setActiveModal('live_updater')}
        isModalOpen={activeModal !== null}
        onCloseModals={closeAllModals}
        lightingMode={lightingMode}
        onSoccerGoal={() => addXP(50)}
      />

      {/* Subsurface Stratigraphic Depth Elevator Widget */}
      <StratigraphicElevator
        isOpen={activeModal === 'strat_elevator'}
        onClose={closeAllModals}
        onSelectDepth={handleSelectDepth}
      />

      {/* Rig Walkie-Talkie Radio Button & Modal */}
      <RigRadioModal
        isOpen={activeModal === 'rig_radio'}
        onClose={closeAllModals}
        onOpen={() => setActiveModal('rig_radio')}
      />

      {/* Zone Transition Toast */}
      <ZoneBanner
        title={zoneBanner.title}
        desc={zoneBanner.desc}
        visible={zoneBanner.visible}
      />

      {/* Floating Action Prompt */}
      <ActionPrompt
        text={activeHotspot?.title || ''}
        visible={activeHotspot !== null && activeModal === null}
      />

      {/* Hotspot Lore Modal with Hades/Stardew Character Frame */}
      <HotspotModal
        isOpen={activeModal === 'hotspot_detail'}
        title={hotspotModalData.title}
        content={hotspotModalData.content}
        outfit={outfit}
        expressionId={currentExpression}
        onClose={closeAllModals}
      />

      {/* Interactive Geological Expedition Backpack & 10-Face Expression Soundboard */}
      <BackpackModal
        isOpen={activeModal === 'backpack'}
        player={careerData.player}
        outfit={outfit}
        currentExpression={currentExpression}
        onSelectExpression={(expr) => {
          setCurrentExpression(expr);
        }}
        onClose={closeAllModals}
      />

      {/* Mini-Game 1: Seismic Fault Sniper (Petrel Workstation + 4:59 PM Cube Freeze) */}
      <SeismicMiniGameModal
        isOpen={activeModal === 'minigame_seismic'}
        onClose={closeAllModals}
        onRewardXP={addXP}
        onTriggerExpression={(expr) => setExpression(expr as PortraitExpressionId)}
      />

      {/* Mini-Game 2: Kill the Kick! (GDA-A Well Control + 3 AM Masala Chai Spike) */}
      <KickMiniGameModal
        isOpen={activeModal === 'minigame_kick'}
        onClose={closeAllModals}
        onRewardXP={addXP}
        onTriggerExpression={(expr) => setExpression(expr as PortraitExpressionId)}
      />

      {/* Mini-Game 3: Outcrop Hammer & Lens Roulette */}
      <RockRouletteModal
        isOpen={activeModal === 'minigame_rock'}
        rockName={activeHotspot?.title || 'Basin Outcrop'}
        onClose={closeAllModals}
        onRewardXP={addXP}
      />

      {/* Mini-Game 4: 24-Hour Shift Dodge */}
      <ShiftDodgeModal
        isOpen={activeModal === 'minigame_shift'}
        onClose={closeAllModals}
        onRewardXP={addXP}
      />

      {/* Mini-Game 5: Kimberlite Diamond ML Classifier */}
      <KimberliteClassifierModal
        isOpen={activeModal === 'minigame_kimberlite'}
        onClose={closeAllModals}
        onRewardXP={addXP}
      />

      {/* Mini-Game 6: AI/SAR Satellite Despeckling Slider */}
      <SarDespecklingModal
        isOpen={activeModal === 'minigame_sar'}
        onClose={closeAllModals}
      />

      {/* Fine-Art Acrylic Painting Exhibition */}
      <ArtExhibitModal
        isOpen={activeModal === 'art_exhibit'}
        onClose={closeAllModals}
      />

      {/* Live Milestones Updater */}
      <LiveUpdaterModal
        isOpen={activeModal === 'live_updater'}
        onClose={closeAllModals}
        careerData={careerData}
        onAddMilestone={handleAddMilestone}
        onDeleteMilestone={handleDeleteMilestone}
      />

      {/* 100% Inline-Editable Boss Mode Executive CV Studio */}
      <BossResumeModal
        isOpen={activeModal === 'boss_resume'}
        onClose={closeAllModals}
        careerData={careerData}
        onUpdateCareerData={setCareerData}
      />
    </div>
  );
};

export default App;
