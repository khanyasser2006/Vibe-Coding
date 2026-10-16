export const brandStory = {
  name: "Ciné",
  tagline: "Fresh Fruit & Real Cream Ice Cream",
  manifesto: "We make ice cream the honest way. Fresh white peaches from sunny Provence, ripe tangerines from Valencia, and pure organic farm cream.",
  dualTones: {
    peach: {
      name: "Provence Peach",
      hex: "#FEC5A8",
      rgb: "255, 197, 169",
      description: "Sweet white peaches picked fresh at the peak of summer."
    },
    tangerine: {
      name: "Valencian Tangerine",
      hex: "#F4784E",
      rgb: "244, 120, 78",
      description: "Bright, juicy citrus squeezed fresh and cooked into golden fruit glaze."
    }
  }
};

export const flavorList = [
  {
    id: "peach-nectar-velvet",
    name: "Peach Nectar Velvet",
    subtitle: "Sweet White Peach & Vanilla Cream",
    category: "Signature Flavors",
    tone: "peach",
    price: "$14.50",
    badge: "Summer Harvest",
    notes: ["Fresh White Peach", "Real Vanilla", "Clover Honey", "Fresh Cream"],
    intensity: "Smooth & Fruity",
    sweetness: "65%",
    tartness: "25%",
    image: "/assets/cine-cone-hero.png",
    description: "Ripe white peaches blended into thick farm cream with real vanilla seeds and a sweet peach drizzle.",
    origin: "Provence, France",
    fruitPercentage: "68% Real Fruit",
    calories: "220 Cal / Scoop",
    dairySource: "Organic Grass-Fed Farm Milk",
    pairing: "Enjoy in a warm waffle cone or with fresh raspberries.",
    detailedStory: "We pick fresh French white peaches at sunrise when their natural sugar is highest. We gently crush the fruit and blend it into cold farm cream so the pure peach flavor stays bright, refreshing, and creamy in every spoonful."
  },
  {
    id: "tangerine-caramel-swirl",
    name: "Tangerine Caramel Swirl",
    subtitle: "Tangy Tangerine & Toffee Swirl",
    category: "Signature Flavors",
    tone: "tangerine",
    price: "$14.50",
    badge: "Fan Favorite",
    notes: ["Valencian Tangerine", "Salted Butter Toffee", "Roasted Almonds", "Orange Nectar"],
    intensity: "Bright & Sweet",
    sweetness: "70%",
    tartness: "60%",
    image: "/assets/cine-bowl-signature.png",
    description: "Zesty citrus ribbons folded through sweet vanilla cream and topped with crunchy almond toffee bits.",
    origin: "Valencia, Spain",
    fruitPercentage: "62% Real Citrus Juice",
    calories: "235 Cal / Scoop",
    dairySource: "Organic Grass-Fed Farm Milk",
    pairing: "Perfect on its own or alongside a warm cup of coffee.",
    detailedStory: "Freshly squeezed Valencian tangerines are slowly simmered into a rich citrus syrup. We swirl this tangy fruit nectar into sweet vanilla ice cream and finish with crunchy caramelized toffee chunks for the ultimate bite."
  },
  {
    id: "honeyed-ricotta-apricot",
    name: "Honeyed Ricotta & Apricot",
    subtitle: "Sweet Ricotta, Ripe Apricot & Wild Honey",
    category: "Seasonal Specials",
    tone: "peach",
    price: "$16.00",
    badge: "Limited Batch",
    notes: ["Fresh Ricotta", "Sun-Ripened Apricot", "Mountain Honey", "Crunchy Pistachio"],
    intensity: "Creamy & Gentle",
    sweetness: "55%",
    tartness: "35%",
    image: "/assets/cine-cone-hero.png",
    description: "Fluffy sweet ricotta cheese layered with ripe apricot jam and a drizzle of raw mountain honey.",
    origin: "Sicily, Italy",
    fruitPercentage: "55% Real Apricot Compote",
    calories: "210 Cal / Scoop",
    dairySource: "Sweet Sheep Milk & Fresh Cream",
    pairing: "Delicious with butter cookies or sliced stone fruits.",
    detailedStory: "Soft, whipped ricotta cheese creates a light and silky ice cream base. We fold in slow-cooked summer apricots and wild flower honey to bring out a comforting, sunshine-filled flavor."
  },
  {
    id: "blood-orange-brioche",
    name: "Blood Orange Brioche",
    subtitle: "Ruby Orange & Toasted Butter Brioche",
    category: "Seasonal Specials",
    tone: "tangerine",
    price: "$16.00",
    badge: "Chef's Choice",
    notes: ["Ruby Blood Orange", "Toasted Brioche Crumbs", "Brown Butter", "Warm Caramel"],
    intensity: "Rich & Textured",
    sweetness: "75%",
    tartness: "50%",
    image: "/assets/cine-bowl-signature.png",
    description: "Deep red blood orange swirls mixed with buttery toasted bread crumbs and golden caramel cream.",
    origin: "Catania, Italy",
    fruitPercentage: "58% Real Blood Orange",
    calories: "245 Cal / Scoop",
    dairySource: "Organic Grass-Fed Farm Milk",
    pairing: "Pairs wonderfully with dark chocolate or hot chocolate.",
    detailedStory: "We bake fresh French brioche with brown butter, toast it to golden perfection, and fold the crunchy crumbs into rich cream. A vibrant ribbon of tart ruby blood orange cuts through the richness for a decadent taste."
  },
  {
    id: "wild-strawberry-cream",
    name: "Wild Strawberry & Sweet Cream",
    subtitle: "Fragrant Mountain Berries & Rich Cream",
    category: "Seasonal Specials",
    tone: "peach",
    price: "$15.50",
    badge: "Spring Harvest",
    notes: ["Wild Mountain Strawberry", "Sweet Vanilla Bean", "Crushed Mint", "Farm Cream"],
    intensity: "Bright & Silky",
    sweetness: "60%",
    tartness: "40%",
    image: "/assets/cine-cone-hero.png",
    description: "Tiny fragrant wild strawberries folded fresh into sweet churning cream with hints of garden mint.",
    origin: "Alps Foothills, France",
    fruitPercentage: "64% Real Strawberries",
    calories: "215 Cal / Scoop",
    dairySource: "Organic Grass-Fed Farm Milk",
    pairing: "Delicious with fresh shortbread or sparkling lemonade.",
    detailedStory: "Wild mountain strawberries carry an intense floral fragrance unlike commercial berries. Hand-harvested in small wooden punnets, they are swirled directly into chilled cream within hours of picking."
  },
  {
    id: "roasted-fig-orange-blossom",
    name: "Roasted Fig & Orange Blossom",
    subtitle: "Caramelized Black Figs & Floral Citrus",
    category: "Signature Flavors",
    tone: "tangerine",
    price: "$16.50",
    badge: "Autumn Special",
    notes: ["Black Mission Figs", "Orange Blossom Water", "Caramel Glaze", "Roasted Walnuts"],
    intensity: "Deep & Aromatic",
    sweetness: "68%",
    tartness: "20%",
    image: "/assets/cine-bowl-signature.png",
    description: "Oven-roasted figs simmered in orange blossom water and layered into thick golden custard cream.",
    origin: "Andalusia, Spain",
    fruitPercentage: "59% Roasted Figs",
    calories: "250 Cal / Scoop",
    dairySource: "Organic Grass-Fed Farm Milk",
    pairing: "Pairs exquisitely with warm espresso or toasted brioche.",
    detailedStory: "Whole ripe figs are roasted slowly with a brush of orange flower blossom honey until their natural sugars caramelize. The resulting jam is folded through rich cream with toasted walnuts for earthy warmth."
  }
];

export const processSteps = [
  {
    step: "01",
    title: "Dawn Fruit Harvest",
    tagline: "Hand-Picked at Peak Brix",
    desc: "Every day at first light, our farming partners hand-pick tree-ripened white peaches in Provence and sunlit tangerines in Valencia when natural fructose is highest.",
    temp: "18°C Orchard Morning",
    metric: "100% Tree-Ripened",
    detail: "Never picked green. No cold-storage ripening. Only fruit that drinks the full summer sun.",
    icon: "Sun"
  },
  {
    step: "02",
    title: "Slow Cold-Press & Citrus Simmer",
    tagline: "Preserving Natural Enzymes & Aromas",
    desc: "We gently press the peaches and slowly simmer fresh tangerine peels in copper pans, concentrating the pure fruit aromas without boiling away delicate floral notes.",
    temp: "42°C Gentle Warmth",
    metric: "Zero Artificial Pectins",
    detail: "We use only pure fruit and raw mountain honey. Never high-fructose corn syrup or artificial gums.",
    icon: "Flame"
  },
  {
    step: "03",
    title: "48-Hour Cold Cream Infusion",
    tagline: "Organic Grass-Fed Farm Cream",
    desc: "The freshly prepared fruit nectar meets certified organic grass-fed whole milk and sweet cream, resting chilled at 2°C for 48 hours for deep harmonic flavor integration.",
    temp: "2°C Cold Maturation",
    metric: "48-Hour Infusion",
    detail: "This slow resting step allows the dairy fats to gently absorb every trace of natural citrus and peach oils.",
    icon: "Snowflake"
  },
  {
    step: "04",
    title: "Low-Air Velvet Churning",
    tagline: "Ultra-Dense & Silky Texture",
    desc: "We churn in small 12-liter chilled batches at low speed. Commercial ice creams pump in up to 100% air; we keep overrun under 18% so every spoonful is dense, rich, and slow to melt.",
    temp: "-11°C Perfect Scoop",
    metric: "< 18% Overrun (Dense Velvet)",
    detail: "Scooped by hand into chilled containers for instant savoring in our boutiques.",
    icon: "Sparkles"
  }
];

export const boutiques = [
  {
    id: "paris-marais",
    city: "Paris",
    country: "France",
    district: "Le Marais",
    address: "24 Rue de Turenne, 75004 Paris",
    status: "Open Daily 12:00 – 23:00",
    phone: "+33 1 42 68 90 12",
    image: "/assets/generated/boutique_paris.jpg",
    specialty: "White Peach Nectar Coupe & Waffle Cone",
    metro: "Saint-Paul (Line 1) or Chemin Vert (Line 8)",
    description: "Located on charming Rue de Turenne, our Paris flagship pairs warm peach storefront woodwork with gleaming brass churns and outdoor bistro seating.",
    coords: "48.8566° N, 2.3622° E"
  },
  {
    id: "tokyo-ginza",
    city: "Tokyo",
    country: "Japan",
    district: "Ginza",
    address: "5-7-22 Ginza, Chuo-ku, Tokyo 104-0061",
    status: "Open Daily 11:00 – 22:00",
    phone: "+81 3 5413 8820",
    image: "/assets/generated/boutique_tokyo.jpg",
    specialty: "Seasonal Tangerine Tasting Flight & Sencha Pairing",
    metro: "Ginza Station (Exit A3)",
    description: "A sanctuary of minimalist luxury crafted from pale peach marble, natural light oak, and warm ambient glow in the heart of Ginza.",
    coords: "35.6719° N, 139.7640° E"
  },
  {
    id: "milan-brera",
    city: "Milan",
    country: "Italy",
    district: "Brera",
    address: "Via Fiori Chiari 16, 20121 Milano",
    status: "Open Daily 12:00 – 23:30",
    phone: "+39 02 8739 4410",
    image: "/assets/generated/boutique_milan.jpg",
    specialty: "Blood Orange Brioche Gelato & Espresso",
    metro: "Lanza (M2) or Montenapoleone (M3)",
    description: "Nestled in an idyllic sunlit courtyard with terracotta arches, blooming tangerine trees, and peach bistro chairs in the artistic Brera district.",
    coords: "45.4719° N, 9.1881° E"
  },
  {
    id: "newyork-soho",
    city: "New York",
    country: "United States",
    district: "SoHo",
    address: "92 Prince Street, New York, NY 10012",
    status: "Open Daily 12:00 – 00:00",
    phone: "+1 212 941 7890",
    image: "/assets/generated/boutique_nyc.jpg",
    specialty: "Tangerine Caramel Swirl & Affogato Flight",
    metro: "Prince St (N, R, W) or Spring St (6)",
    description: "Airy cast-iron architecture with warm peach plaster walls, a glowing neon Ciné script, and a sun-drenched marble tasting counter.",
    coords: "40.7248° N, 73.9984° W"
  }
];

export const galleryPhotos = [
  {
    id: "orchard-sunrise",
    title: "Morning Harvest in Provence",
    category: "Orchards",
    image: "/assets/generated/provence_peach_orchard.jpg",
    caption: "Handpicking ripe French white peaches at sunrise in our partner orchard in Luberon.",
    location: "Provence, France",
    aspect: "landscape"
  },
  {
    id: "citrus-groves",
    title: "Sunlit Valencian Tangerines",
    category: "Orchards",
    image: "/assets/generated/valencia_tangerines.jpg",
    caption: "Heavy woven baskets filled with freshly harvested citrus in sunny eastern Spain.",
    location: "Valencia, Spain",
    aspect: "landscape"
  },
  {
    id: "copper-churn",
    title: "Artisanal Churn & Swirl",
    category: "Craft",
    image: "/assets/generated/artisanal_churn_craft.jpg",
    caption: "Velvet peach and tangerine ribbons folding through organic farm cream inside our workshop.",
    location: "Workshop Atelier",
    aspect: "landscape"
  },
  {
    id: "crystal-coupe",
    title: "The Signature Coupe",
    category: "Moments",
    image: "/assets/generated/crystal_icecream_coupe.jpg",
    caption: "Pure scoops of peach and citrus served on a sunny afternoon marble bistro table.",
    location: "Courtyard Terrace",
    aspect: "landscape"
  },
  {
    id: "paris-flagship",
    title: "Le Marais Afternoon",
    category: "Boutiques",
    image: "/assets/generated/boutique_paris.jpg",
    caption: "Guests gathering outside our Parisian boutique on Rue de Turenne under the warm peach canopy.",
    location: "Paris, France",
    aspect: "landscape"
  },
  {
    id: "tokyo-sanctuary",
    title: "Ginza Marble Counter",
    category: "Boutiques",
    image: "/assets/generated/boutique_tokyo.jpg",
    caption: "Curved peach marble and peaceful Japanese woodwork in our Tokyo sanctuary.",
    location: "Tokyo, Japan",
    aspect: "landscape"
  },
  {
    id: "milan-courtyard",
    title: "Brera Garden Terrace",
    category: "Boutiques",
    image: "/assets/generated/boutique_milan.jpg",
    caption: "Terracotta arches and citrus trees under the warm afternoon sun of Milan.",
    location: "Milan, Italy",
    aspect: "landscape"
  },
  {
    id: "soho-counter",
    title: "Prince Street Tasting Bar",
    category: "Boutiques",
    image: "/assets/generated/boutique_nyc.jpg",
    caption: "Lively afternoon tastings beneath the glowing Ciné neon in SoHo New York.",
    location: "New York, USA",
    aspect: "landscape"
  }
];
