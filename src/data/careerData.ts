import { CareerData } from '../types/game';

export const INITIAL_CAREER_DATA: CareerData = {
  player: {
    name: "Rajdeep Tarafder",
    title: "Wellsite & Exploration Geologist",
    organization: "Oil and Natural Gas Corporation (ONGC)",
    cpf: "141604",
    doj: "06.11.2023",
    email: "tarafderrajdeep@gmail.com",
    altEmail: "tarafderrajdeep.20mc0072@agl.iitism.ac.in",
    phone: "+91 90075 15735",
    linkedin: "https://linkedin.com/in/rajdeep-tarafder-82a408184",
    location: "Dehradun / Field Ops, India",
    photo: "avatar-photo.jpg",
    fieldPhoto: "rig-field-photo.jpg",
    artwork: "art-drawing.jpg",
    summary: "High-impact Exploration & Wellsite Geologist at ONGC blending 2.5 years of frontier basin interpretation (Vindhyan Block Group) with frontline drilling rig operations. Proven record in 2D/3D seismic interpretation (Petrel, PaleoScan), prospect maturation across BExB and EPMB blocks, 3D Mechanical Earth Modeling (MEM), and pioneering national clean energy exploration in Natural Hydrogen (H2) and Helium (He). Experienced in real-time wellsite lithological logging, hydrocarbon surveillance (UV cut/fluorescence, C1-C5 chromatograph), pore pressure / PDA surveillance, and critical 8.5\" phase open-ended drill pipe cement squeeze remediation at GDA-A Samastipur."
  },
  stats: {
    level: 4,
    currentXP: 650,
    maxXP: 1000,
    stamina: 100,
    coffeeBoost: 100,
    zeroLtiDays: 342,
    prospectsDefended: 2
  },
  roles: [
    {
      id: "wellsite_geologist",
      role: "Wellsite Geologist",
      company: "Oil and Natural Gas Corporation (ONGC)",
      period: "Current (Active Operations)",
      location: "Frontline Exploratory Drilling Rigs (12hr / 24hr Rotations)",
      badge: "ACTIVE FRONTLINE RIG OPS",
      room: "rig",
      arsenal: ["Binocular Microscopy", "Fluoroscope UV", "Mud Gas Gas-Chromatograph", "Pressure While Drilling (PDA)", "dc-Exponent"],
      highlights: [
        "24/7 real-time formation top evaluation and geological prognosis correlation on active exploratory drilling rigs.",
        "Precision drill-cuttings lithological description under binocular microscope, grain texture analysis, and mineralogical identification.",
        "Continuous hydrocarbon surveillance: direct fluorescence, chemical solvent cut evaluation, and real-time mud gas surveillance (Total Gas & C1–C5 chromatographic breakdown).",
        "Pore pressure estimation, dc-exponent trendline monitoring, trip gas / connection gas surveillance, and Pressure While Drilling (PDA) tracking across 12hr and 24hr shift rotations.",
        "Supervision of critical 8.5\" phase drilling and open-ended drill pipe cement squeeze operations for wellbore integrity remediation at GDA-A Samastipur."
      ]
    },
    {
      id: "interpretation_geologist",
      role: "Interpretation Geologist",
      company: "Oil and Natural Gas Corporation (ONGC)",
      group: "Vindhyan Block Group",
      period: "Nov 2023 – Present (2.5 Years Total Track Record)",
      location: "Subsurface G&G Interpretation Center, Dehradun",
      badge: "G&G BASIN PROSPECTS",
      room: "lab",
      arsenal: ["Schlumberger Petrel", "Eliis PaleoScan", "QGIS", "DSPetrophysics", "ArcGIS", "CorelDRAW", "AI / SAR Remote Sensing"],
      highlights: [
        "Spearheaded multi-vintage 2D and 3D seismic interpretation utilizing Petrel and PaleoScan, constructing high-resolution Relative Geologic Time (RGT) models and structural fault-seal frameworks.",
        "Generated, evaluated, and successfully defended drillable exploratory prospects across BExB and EPMB exploration blocks before executive review management committees.",
        "Pioneered unconventional clean resource exploration targeting Natural Hydrogen (H2) and Helium (He) play concepts in deep basement shear systems across Vindhyan & Chhattisgarh basins.",
        "Conducted critical mineral enrichment zone mapping and 3D Mechanical Earth Modeling (MEM) / fault mapping in Son Valley & Bhima-Kaladgi basins.",
        "Performed integrated petrophysical wireline log evaluations (DSPetrophysics) for sandstone and carbonate reservoirs.",
        "Monitored under-drilling exploratory wells, executed Pore Pressure & Drillability Analysis (PDA), and managed technical administration and statutory directorate reporting."
      ]
    },
    {
      id: "oil_internship",
      role: "Vocational Trainee – Petroleum Geology",
      company: "Oil India Limited (OIL)",
      period: "May 2022 – Jun 2022",
      location: "Duliajan, Assam",
      badge: "PETROLEUM BASIN TRAINING",
      room: "academic",
      arsenal: ["Wireline Log Interpretation", "Mud Logging", "Basin Modeling"],
      highlights: [
        "Analyzed upstream E&P operations across the Assam Shelf Basin; evaluated source rock maturation, Barail and Tipam sandstone reservoirs, regional seals, and structural traps.",
        "Interpreted open-hole wireline logs (Gamma Ray, Deep/Shallow Resistivity, RHOB-NPHI, Sonic) to identify lithology, permeable intervals, and hydrocarbon-water contacts.",
        "Observed on-site drilling protocols, mud logging operations, cuttings sample preparation, and drill-stem formation pressure testing."
      ]
    },
    {
      id: "sail_internship",
      role: "Vocational Trainee – Mining Geology & Exploration",
      company: "Steel Authority of India Limited (SAIL)",
      period: "Dec 2021",
      location: "Dalli-Rajhara, Chhattisgarh",
      badge: "MINING GEOLOGY & RESERVES",
      room: "academic",
      arsenal: ["Bench Mapping", "Cross-Section Reserve Estimation", "Ore Beneficiation"],
      highlights: [
        "Practical open-cast mine training at Dalli-Rajhara Iron Ore Complex (captive mines of Bhilai Steel Plant); mapped open-cast mine benches and structural contacts.",
        "Estimated iron ore reserves using the geological cross-section method; correlated bench profiles with exploratory borehole lithologs.",
        "Conducted petrographic and chemical characterization of Banded Iron Formations (BIF, BHQ) and high-grade hematite deposits; evaluated mineral beneficiation circuits."
      ]
    }
  ],
  achievements: [
    {
      id: "ach_prospects_bexb",
      title: "Drillable Prospect Maturation (BExB & EPMB)",
      category: "lab",
      date: "2024",
      badge: "EXPLORATION MILESTONE",
      xp: 150,
      description: "Generated and defended drillable exploratory prospects in BExB and EPMB blocks in the Vindhyan Basin before management review committees."
    },
    {
      id: "ach_h2_he",
      title: "Pioneering Unconventional H2 & He Exploration",
      category: "lab",
      date: "2024",
      badge: "CLEAN ENERGY FRONTIER",
      xp: 200,
      description: "Explored deep basement degassing mechanisms and crustal fault conduits for Natural Hydrogen (H2) and Helium (He) across Vindhyan & Chhattisgarh basins."
    },
    {
      id: "ach_samastipur_cement",
      title: "GDA-A Samastipur 8.5\" Cement Squeeze Oversight",
      category: "rig",
      date: "2025",
      badge: "RIG INTEGRITY HERO",
      xp: 200,
      description: "Supervised critical 8.5\" phase drilling and open-ended drill pipe cement squeeze operations for wellbore isolation and pressure control at GDA-A Samastipur."
    },
    {
      id: "ach_pda_surveillance",
      title: "Real-Time 24hr PDA & Mud Gas Surveillance",
      category: "rig",
      date: "2025",
      badge: "ZERO INCIDENT RECORD",
      xp: 100,
      description: "Tracked real-time pore pressure, dc-exponent trends, and gas chromatograph signatures across 12hr and 24hr shift rotations with zero LTIs."
    },
    {
      id: "ach_msc_thesis_ml",
      title: "M.Sc. Tech Thesis: ML Garnet Provenance (IIT ISM)",
      category: "academic",
      date: "2023",
      badge: "AI/ML GEOSCIENCE",
      xp: 150,
      description: "Engineered supervised ML pipelines in Python to predict host-rock lithologies and tectonic provenance from EPMA garnet geochemical vectors for diamond exploration."
    },
    {
      id: "ach_football_champ",
      title: "Football General Championship Winner & Centre-Back",
      category: "academic",
      date: "2022",
      badge: "ATHLETIC CHAMPION",
      xp: 100,
      description: "Starting Centre-Back for university and departmental teams across 4 consecutive seasons; won IIT (ISM) Football General Championship & Departmental Cup."
    }
  ],
  education: [
    {
      degree: "M.Sc. Tech in Applied Geology",
      institution: "Indian Institute of Technology (ISM), Dhanbad",
      period: "2020 – 2023",
      score: "7.36 CGPA",
      honors: "First Class"
    },
    {
      degree: "B.Sc. (Hons.) in Geological Sciences",
      institution: "Jadavpur University, Kolkata",
      period: "2017 – 2020",
      score: "7.30 CGPA",
      honors: "First Class"
    },
    {
      degree: "Higher Secondary Examination (Class XII)",
      institution: "The Bhawanipur Education Society School, Kolkata",
      period: "2017",
      score: "79.5%"
    },
    {
      degree: "Secondary Examination (Class X)",
      institution: "Lycée, Kolkata",
      period: "2015",
      score: "81.5%"
    }
  ],
  researchTheses: [
    {
      title: "Host Rock Identification & Provenance Detection via Machine Learning",
      type: "M.Sc. Tech Thesis",
      institution: "IIT (ISM) Dhanbad",
      period: "2022 – 2023",
      skills: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Matplotlib", "JupyterLab"],
      description: "Engineered supervised machine learning pipelines (Random Forest, SVM, Decision Trees, Logistic Regression) to predict parent host-rock lithologies and tectonic provenance from garnet EPMA geochemical datasets. Overcame classical thermo-barometric limitations where bulk-rock context is absent in detrital records. Established discriminative geochemical vectors directly applicable to diamond exploration (identifying mantle-derived kimberlitic pyrope garnets) and metamorphic terrane mapping."
    },
    {
      title: "Exchange of Iron from Atmosphere to Ocean Under Anthropogenic Inducements",
      type: "B.Sc. (Hons.) Dissertation",
      institution: "Jadavpur University",
      period: "2019 – 2020",
      skills: ["Biogeochemistry", "Atmospheric Modeling", "Oceanography"],
      description: "Investigated global atmospheric iron (Fe) emissions from fossil fuel combustion and biomass burning. Evaluated atmospheric transport pathways, chemical/mineralogical controls on fractional aerosol Fe solubility, and nutrient bioavailability for marine phytoplankton in High-Nutrient Low-Chlorophyll (HNLC) ocean basins, quantifying feedback loops into the global carbon cycle."
    }
  ],
  fieldwork: [
    {
      area: "Chandipur, Odisha",
      title: "Sedimentary Terrain & Modern Coastal Facies",
      mentors: "Dr. Anupam Ghosh & Dr. Soumik Samanta",
      highlights: "Conducted high-resolution coastal and estuarine sedimentary facies mapping. Documented planar/trough cross-stratification, flaser/lenticular bedding, and verified Walther's Law through vertical stratigraphic logs and modern ichnological trace fossil distributions."
    },
    {
      area: "Chhota Nagpur Gneissic Complex",
      title: "Metamorphic Terrain & Polyphase Structural Analysis",
      mentors: "Dr. Pulak Sengupta & Dr. Subrata Karmakar",
      highlights: "Mapped high-grade Precambrian metamorphic and basement crystalline rocks. Measured foliation, lineation, shear indicators, and fold axial planes to unravel polyphase tectonometamorphic deformation stages (D1–D3)."
    },
    {
      area: "Galudih / Ghatsila, Jharkhand",
      title: "Introductory Geological Field Mapping",
      mentors: "Dr. Susanta Choudhary & Dr. Supriyo Mondal",
      highlights: "Mastered Brunton compass & clinometer structural measurement techniques, topographic navigation, base map creation, and litho-stratigraphic identification in hand specimen."
    }
  ],
  skills: {
    subsurface: [
      "Schlumberger Petrel",
      "Eliis PaleoScan",
      "QGIS",
      "DSPetrophysics",
      "ArcGIS",
      "2D/3D Seismic Interpretation",
      "Horizon & Fault Modeling",
      "Sequence Stratigraphy",
      "3D Mechanical Earth Modeling (MEM)",
      "Prospect Generation (BExB, EPMB)",
      "Wireline Log Analysis"
    ],
    wellsite: [
      "Real-Time Formation Top Tracking",
      "Drill Cuttings Lithology",
      "Hydrocarbon Show & UV Fluorescence",
      "Mud Gas Surveillance (C1–C5)",
      "Pore Pressure Evaluation (PDA)",
      "dc-Exponent Analysis",
      "Cement Squeeze Oversight (8.5\" Phase at GDA-A)",
      "Rig Safety & LTI Protocols",
      "12hr & 24hr Shift Rotations"
    ],
    unconventional: [
      "Natural Hydrogen (H2) Play Concepts",
      "Helium (He) Exploration",
      "Deep Basement Degassing",
      "Noble Gas Geochemistry",
      "Crustal Fault Migration Pathways (Vindhyan & Chhattisgarh)"
    ],
    programming: [
      "Python 3",
      "Pandas & NumPy",
      "Scikit-Learn (Supervised ML)",
      "Matplotlib & Seaborn",
      "JupyterLab & Spyder",
      "R Programming",
      "LaTeX"
    ],
    design: [
      "CorelDRAW",
      "Adobe Photoshop",
      "Technical Drafting",
      "MS Office (Advanced Excel, PowerPoint)"
    ]
  },
  certifications: [
    {
      name: "Supervised Machine Learning: Regression and Classification",
      issuer: "DeepLearning.AI / Coursera",
      grade: "90.4%",
      topics: "Cost functions, gradient descent, polynomial regression, logistic classification, decision trees"
    },
    {
      name: "Global Warming II: Create Your Models in Python",
      issuer: "University of Chicago / Coursera",
      grade: "90.4%",
      topics: "Numerical climate modeling, Earth radiative equilibrium, greenhouse gas dynamics in Python"
    },
    {
      name: "Data Analysis with Python",
      issuer: "freeCodeCamp",
      topics: "Data wrangling with Pandas/NumPy, statistical correlations, automated reporting"
    },
    {
      name: "Scientific Computing with Python",
      issuer: "freeCodeCamp",
      topics: "Computational algorithms, scientific numerical analysis, data structures"
    }
  ],
  extracurriculars: [
    {
      role: "Head of Graphics & Digital Media",
      event: "Flysch '22 (Geological Society, IIT ISM Dhanbad)",
      period: "2021 – 2022",
      description: "Spearheaded digital branding and publicity for the annual geo-technical fest; designed official publications, technical brochures, and promotional digital assets using CorelDRAW & Photoshop."
    },
    {
      role: "Departmental Conclave Convenor",
      event: "Lithify '19 (Jadavpur University Geological Society)",
      period: "2019",
      description: "Convened the flagship geological conclave sponsored by UGC CAS-Phase VI; coordinated inter-college academic events, panel discussions, and guest lectures for 200+ delegates."
    },
    {
      role: "Athletic Leadership & Football Champion",
      event: "University & Departmental Teams",
      period: "2017 – 2022",
      description: "Starting Centre-Back across 4 consecutive seasons for IIT (ISM) Dhanbad and Jadavpur University; Champion in the Inter-Departmental Football Championship (March 2022) & Annual Geological Society Football Cup (April 2022)."
    },
    {
      role: "High-Altitude Trekker",
      event: "Himalayan Alpine Expeditions",
      period: "Ongoing",
      description: "Completed demanding high-altitude group treks including Dafeybhir Pass (Sikkim) and exploratory high-elevation passes across Himachal Pradesh."
    }
  ]
};

export const COMIC_BUBBLES = [
  "Fault line detected! Normal throw ~2.4m!",
  "Need more 3 AM doghouse black coffee!",
  "Zero LTI record intact! Safety first!",
  "Hold on... Petrel 3D seismic autosaving!",
  "Caution: High pressure formation gas kick!",
  "Walther's Law in action: vertical matches lateral!",
  "EPMA garnet vector: Kimberlitic pyrope confirmed!",
  "Mud weight: 1.28 SG. Formation top right on prognosis!",
  "Natural H2 degassing anomaly spotted!",
  "Cement squeeze pressure held solid!",
  "Starting Centre-Back ready to defend the goal!"
];

export const RIG_RADIO_KNOWLEDGE: Record<string, string> = {
  h2: "Doghouse copy: Pioneer in Unconventional Natural Hydrogen (H2) and Helium (He) exploration across Vindhyan & Chhattisgarh basins. Mapped basement fracture degassing, seal integrity, and caprock retention. Clean energy frontier!",
  cement: "Doghouse copy: Active Wellsite frontline ops at GDA-A Samastipur exploratory well (8.5\" phase). Supervised open-ended drill pipe cement squeeze operation, verified slurry placement, and maintained 0 LTI safety standards.",
  petrel: "Doghouse copy: 2.5+ years interpretation geologist for Vindhyan Block. Extensive modeling in Schlumberger Petrel, Eliis PaleoScan RGT, QGIS, DSPetrophysics. Successfully generated and defended drillable exploration prospects in BExB & EPMB blocks.",
  thesis: "Doghouse copy: M.Sc. Tech thesis from IIT (ISM) Dhanbad: Engineered supervised Machine Learning models on EPMA garnet geochemistry to predict parent host rock provenance for kimberlitic diamond exploration.",
  pda: "Doghouse copy: Active 24/7 surveillance: Real-time Pore Pressure Prediction, PDA drilling parameter tracking, binocular cuttings lithology, UV hydrocarbon fluorescence cuts, and C1-C5 chromatograph gas analysis.",
  sports: "Doghouse copy: Athletic record: Starting Centre-Back across 4 seasons for IIT ISM & Jadavpur. Winner of Inter-Departmental Football Championship '22. High-altitude alpine trekker across Dafeybhir Pass, Sikkim!"
};
