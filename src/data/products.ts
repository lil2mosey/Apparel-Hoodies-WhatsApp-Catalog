import { Product, ColorOption, StoreContact, ProductCategory } from '../types';

export const DEFAULT_STORE_CONTACT: StoreContact = {
  name: "Gryson",
  phone: "0735418753",
  intlPhone: "254735418753",
  businessName: "Gryson's Apparel & Custom Merch",
  tagline: "Quality Hoodies, Polo Shirts, Sweatshirts, Ponchos, Tracksuits, Plain Tees & Caps",
  location: "Nairobi, Kenya • Delivery countrywide"
};

// Rich color palette from the video
export const COMMON_COLORS: Record<string, ColorOption> = {
  white: { name: 'White', hex: '#FFFFFF', twClass: 'bg-white border-neutral-300' },
  black: { name: 'Jet Black', hex: '#171717', twClass: 'bg-neutral-900' },
  maroon: { name: 'Maroon / Burgundy', hex: '#6b1d2f', twClass: 'bg-[#6b1d2f]' },
  crimsonRed: { name: 'Vibrant Red', hex: '#dc2626', twClass: 'bg-red-600' },
  mustardYellow: { name: 'Mustard Yellow', hex: '#eab308', twClass: 'bg-amber-500' },
  pinkRose: { name: 'Bubblegum Pink', hex: '#ec4899', twClass: 'bg-pink-500' },
  lilacLavender: { name: 'Lilac / Lavender', hex: '#c084fc', twClass: 'bg-purple-400' },
  forestGreen: { name: 'Forest Green', hex: '#15803d', twClass: 'bg-emerald-700' },
  oliveGreen: { name: 'Olive Green', hex: '#4d5b36', twClass: 'bg-[#4d5b36]' },
  royalBlue: { name: 'Royal Blue', hex: '#1d4ed8', twClass: 'bg-blue-700' },
  navyBlue: { name: 'Navy Blue', hex: '#1e293b', twClass: 'bg-slate-800' },
  aquaBlue: { name: 'Aqua / Cyan Blue', hex: '#06b6d4', twClass: 'bg-cyan-500' },
  lightBlue: { name: 'Sky / Light Blue', hex: '#38bdf8', twClass: 'bg-sky-400' },
  brightOrange: { name: 'Safety / Bright Orange', hex: '#f97316', twClass: 'bg-orange-500' },
  heatherGrey: { name: 'Heather Grey', hex: '#94a3b8', twClass: 'bg-slate-400' },
  beigeKhaki: { name: 'Beige / Khaki', hex: '#d4c5b9', twClass: 'bg-[#d4c5b9]' },
};

export const PRODUCTS: Product[] = [
  {
    id: 'half-hoodie',
    name: 'Half Hoodie (Sleeveless Fleece Hoodie)',
    category: 'hoodies',
    subtitle: 'Modern sleeveless fleece hoodie with kangaroo pocket & drawstrings',
    description: 'Our viral sleeveless pullover hoodie (half hoodie) crafted from premium heavyweight cotton-fleece. Features clean drop-armhole ribbed cuffs, a double-lined drawstring hood with dark aglet tips, and a spacious front kangaroo pouch pocket. Perfect for casual streetwear, warm weather layering, gym sessions, or custom printed names and logos.',
    price: 2000,
    currency: 'KSh',
    image: 'hoodie-half',
    featured: true,
    popularBadge: 'Viral Style',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.maroon,
      COMMON_COLORS.crimsonRed,
      COMMON_COLORS.heatherGrey,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.forestGreen,
      COMMON_COLORS.mustardYellow,
      COMMON_COLORS.pinkRose
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabric: '320 GSM Heavyweight Cotton Fleece Blend',
    fit: 'Sleeveless Regular Fit',
    features: [
      'Dropped sleeveless armholes with reinforced rolled trim',
      'Double-lined hood with contrast-tipped drawstrings',
      'Spacious front kangaroo pouch pocket',
      'Custom name printing & embroidery ready'
    ],
    customizable: true
  },
  {
    id: 'pullover-hoodie',
    name: 'Premium Pullover Fleece Hoodie',
    category: 'hoodies',
    subtitle: 'Ultra-soft heavyweight fleece with front kangaroo pocket',
    description: 'Our best-selling heavyweight pullover hoodie crafted from premium cotton-poly blend fleece. Features a double-lined drawstring hood, sturdy ribbed cuffs, and spacious front kangaroo pocket. Perfect for casual wear, team uniforms, or custom printed names and logos.',
    price: 2300,
    currency: 'KSh',
    image: 'hoodie-pullover',
    featured: true,
    popularBadge: 'Top Seller',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.maroon,
      COMMON_COLORS.crimsonRed,
      COMMON_COLORS.pinkRose,
      COMMON_COLORS.lilacLavender,
      COMMON_COLORS.mustardYellow,
      COMMON_COLORS.forestGreen,
      COMMON_COLORS.brightOrange,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.heatherGrey
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabric: '320 GSM Heavyweight Cotton Fleece Blend',
    fit: 'Relaxed Unisex Fit',
    features: [
      'Double-stitched reinforced seams',
      'Soft brushed interior for warmth',
      'Matching metal-tipped drawstrings',
      'Custom name printing & embroidery ready'
    ],
    customizable: true
  },
  {
    id: 'zip-hoodie',
    name: 'Full-Zip Heavyweight Hoodie',
    category: 'hoodies',
    subtitle: 'Classic front zip hoodie with dual split pockets',
    description: 'Versatile full-zip hooded sweatshirt featuring a smooth metal zipper, split pouch pockets, and snug ribbed hems. Effortless layering piece for daily wear or company branding.',
    price: 2300,
    currency: 'KSh',
    image: 'hoodie-zip',
    featured: true,
    popularBadge: 'Popular',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.crimsonRed,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.heatherGrey,
      COMMON_COLORS.maroon
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabric: '320 GSM Cotton Fleece with Metal YKK Zip',
    fit: 'Regular Fit',
    features: [
      'Full front smooth zip closure',
      'Spacious split front pockets',
      'High-durability ribbed cuffs and hem'
    ],
    customizable: true
  },
  {
    id: 'crewneck-sweatshirt',
    name: 'Classic Crewneck Sweatshirt',
    category: 'sweatshirts',
    subtitle: 'Clean cut drop-shoulder sweatshirt with ribbed collar',
    description: 'Timeless casual crewneck sweatshirt built with breathable, cozy fleece fabric. Ideal for everyday lounging, college apparel, corporate merchandise, or personalized custom typography.',
    price: 1500,
    currency: 'KSh',
    image: 'sweatshirt',
    featured: true,
    popularBadge: 'Trending',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.maroon,
      COMMON_COLORS.crimsonRed,
      COMMON_COLORS.heatherGrey,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.forestGreen
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabric: '290 GSM Premium French Terry / Fleece',
    fit: 'Comfort Regular Fit',
    features: [
      'Ribbed knit collar, cuffs, and waistband with spandex',
      'Smooth outer fabric optimized for crisp printing',
      'Warm and breathable year-round feel'
    ],
    customizable: true
  },
  {
    id: 'pique-polo-shirt',
    name: 'Piqué Dotted & Solid Collar Polo Shirt',
    category: 'polo-shirts',
    subtitle: 'Breathable honeycomb piqué polo with dotted accents & 3-button placket',
    description: 'Smart casual polo shirt crafted from breathable honeycomb piqué fabric with a crisp structured collar, dotted finish accents, and tailored 3-button placket. Available in an extensive range of vibrant solid colors.',
    price: 1000,
    currency: 'KSh',
    image: 'polo',
    featured: true,
    popularBadge: 'Best Value',
    colors: [
      COMMON_COLORS.oliveGreen,
      COMMON_COLORS.white,
      COMMON_COLORS.royalBlue,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.aquaBlue,
      COMMON_COLORS.lightBlue,
      COMMON_COLORS.crimsonRed,
      COMMON_COLORS.mustardYellow,
      COMMON_COLORS.brightOrange,
      COMMON_COLORS.black
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabric: '220 GSM 100% Combed Cotton Honeycomb Piqué',
    fit: 'Tailored Smart Fit',
    features: [
      '3-button reinforced front placket',
      'Shape-retaining ribbed collar & sleeve bands',
      'Side vents for comfortable movement',
      'Resistant to color fading and shrinking'
    ],
    customizable: true
  },
  {
    id: 'plain-tshirt',
    name: 'Heavy Cotton Plain Crewneck T-Shirt',
    category: 'plain-tshirts',
    subtitle: '100% pure combed cotton round-neck tee',
    description: 'Essential everyday plain round-neck t-shirt. Soft, durable, pre-shrunk cotton that keeps its shape wash after wash. Stock up on clean everyday essentials or order custom batches for group events.',
    price: 600,
    currency: 'KSh',
    image: 'tshirt',
    featured: false,
    popularBadge: 'Essential',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.royalBlue,
      COMMON_COLORS.crimsonRed,
      COMMON_COLORS.mustardYellow,
      COMMON_COLORS.forestGreen,
      COMMON_COLORS.brightOrange,
      COMMON_COLORS.maroon,
      COMMON_COLORS.heatherGrey
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabric: '190 GSM 100% Ring-Spun Cotton',
    fit: 'Standard Unisex Fit',
    features: [
      'Seamless double-needle 7/8" collar',
      'Taped neck and shoulders for durability',
      'Ultra-soft hand feel'
    ],
    customizable: true
  },
  {
    id: 'baseball-cap',
    name: 'Classic 6-Panel Cotton Baseball Cap',
    category: 'caps',
    subtitle: 'Adjustable strap structured cotton cap with curved visor',
    description: 'Premium 6-panel baseball cap with embroidered eyelets for ventilation and an adjustable buckle strap for a customized fit. Pairs effortlessly with hoodies and polo shirts.',
    price: 350,
    currency: 'KSh',
    image: 'cap',
    featured: true,
    popularBadge: 'Hot Item',
    colors: [
      COMMON_COLORS.white,
      COMMON_COLORS.black,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.maroon,
      COMMON_COLORS.beigeKhaki,
      COMMON_COLORS.forestGreen,
      COMMON_COLORS.crimsonRed,
      COMMON_COLORS.royalBlue
    ],
    sizes: ['One Size'],
    fabric: '100% Brushed Cotton Twill',
    fit: 'Adjustable Universal Fit',
    features: [
      'Pre-curved visor with 6 rows of stitching',
      'Brass metal buckle adjustable closure',
      '6 stitched breathable eyelets'
    ],
    customizable: true
  },
  {
    id: 'safety-reflective-vest',
    name: 'High-Visibility Safety Reflective Vest',
    category: 'vests',
    subtitle: 'High-visibility fluorescent vest with dual reflective strips',
    description: 'Safety vest with 2-inch high-visibility silver reflective bands and front Velcro closure. Lightweight and breathable for site work, events, riders, and safety personnel.',
    price: 550,
    currency: 'KSh',
    image: 'vest-reflective',
    featured: false,
    colors: [
      COMMON_COLORS.brightOrange,
      COMMON_COLORS.mustardYellow,
      COMMON_COLORS.royalBlue,
      COMMON_COLORS.forestGreen
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    fabric: '100% Lightweight Fluorescent Polyester Mesh',
    fit: 'Over-Garment Loose Fit',
    features: [
      '360° reflective high-glow visibility stripes',
      'Easy hook-and-loop front closure',
      'Tear-resistant edge binding'
    ],
    customizable: true
  },
  {
    id: 'quilted-puffer-gilet',
    name: 'Insulated Quilted Sleeveless Puffer Vest',
    category: 'vests',
    subtitle: 'Sleeveless thermal bodywarmer with zip-off hood and stand collar',
    description: 'Sleek insulated puffer gilet featuring horizontal baffle quilting, warm down-alternative fill, secure zippered hand pockets, and high stand collar with removable hood.',
    price: 2200,
    currency: 'KSh',
    image: 'vest-puffer',
    featured: false,
    popularBadge: 'Premium',
    colors: [
      COMMON_COLORS.black,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.maroon,
      COMMON_COLORS.heatherGrey
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    fabric: 'Water-Resistant Ripstop Nylon Shell with Polyfill',
    fit: 'Modern Regular Fit',
    features: [
      'Detachable toggle hood with zipper',
      'Deep dual zippered handwarmer pockets',
      'Windproof front storm flap over zip'
    ],
    customizable: false
  },
  {
    id: 'fleece-poncho',
    name: 'Fringed Warm Fleece & Maasai Poncho',
    category: 'ponchos',
    subtitle: 'Warm draped fleece poncho with handcrafted fringe tassel border',
    description: 'Signature oversized draped fleece poncho featuring a comfortable open-neck silhouette, reinforced shoulder drape, and handcrafted fringe tassel hem. Ideal for cold Nairobi evenings, outdoor safari events, stylish casual streetwear, or custom embroidered initials.',
    price: 2500,
    currency: 'KSh',
    image: 'poncho-fleece',
    featured: true,
    popularBadge: 'New Arrival',
    colors: [
      COMMON_COLORS.maroon,
      COMMON_COLORS.black,
      COMMON_COLORS.forestGreen,
      COMMON_COLORS.crimsonRed,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.mustardYellow,
      COMMON_COLORS.heatherGrey,
      COMMON_COLORS.beigeKhaki
    ],
    sizes: ['One Size'],
    fabric: '360 GSM Heavyweight Thermal Plush Fleece & Woven Blend',
    fit: 'Relaxed Draped Universal Fit',
    features: [
      'Hand-knotted perimeter fringe tassel hem',
      'Comfort-cut open neckline with reinforced hem',
      'Ultra-warm thermal fleece fabric blend',
      'Custom name or brand embroidery ready'
    ],
    customizable: true
  },
  {
    id: 'athletic-tracksuit',
    name: '2-Piece Heavyweight Athletic Fleece Tracksuit',
    category: 'tracksuits',
    subtitle: 'Matching full-zip warm-up jacket and tapered jogger pants set',
    description: 'Complete premium 2-piece fleece tracksuit set. Features a high-collar full-zip jacket with zippered side pockets and ribbed cuffs, paired with matching elastic-waistband tapered jogger sweatpants with deep pockets and ankle cuffs. Perfect for casual streetwear, team kits, athletic warm-ups, or custom printed brand merchandise.',
    price: 3800,
    currency: 'KSh',
    image: 'tracksuit-set',
    featured: true,
    popularBadge: 'Complete Set',
    colors: [
      COMMON_COLORS.black,
      COMMON_COLORS.navyBlue,
      COMMON_COLORS.heatherGrey,
      COMMON_COLORS.maroon,
      COMMON_COLORS.forestGreen,
      COMMON_COLORS.royalBlue,
      COMMON_COLORS.crimsonRed
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabric: '340 GSM Heavyweight Brushed Cotton-Poly Athletic Fleece',
    fit: 'Athletic Tapered 2-Piece Fit',
    features: [
      'Includes both Full-Zip Jacket + Matching Cuffed Joggers',
      'Heavy-duty smooth zipper and zippered side pockets',
      'Elasticized drawcord waistband & ribbed ankle cuffs',
      'Custom name printing & team embroidery ready'
    ],
    customizable: true
  }
];

export const CATEGORIES: { id: ProductCategory; label: string; count: number }[] = [
  { id: 'all', label: 'All Items', count: PRODUCTS.length },
  { id: 'hoodies', label: 'Hoodies', count: PRODUCTS.filter(p => p.category === 'hoodies').length },
  { id: 'polo-shirts', label: 'Polo Shirts', count: PRODUCTS.filter(p => p.category === 'polo-shirts').length },
  { id: 'sweatshirts', label: 'Sweatshirts', count: PRODUCTS.filter(p => p.category === 'sweatshirts').length },
  { id: 'ponchos', label: 'Ponchos', count: PRODUCTS.filter(p => p.category === 'ponchos').length },
  { id: 'tracksuits', label: 'Tracksuits', count: PRODUCTS.filter(p => p.category === 'tracksuits').length },
  { id: 'caps', label: 'Caps', count: PRODUCTS.filter(p => p.category === 'caps').length },
  { id: 'plain-tshirts', label: 'Plain T-Shirts', count: PRODUCTS.filter(p => p.category === 'plain-tshirts').length },
  { id: 'vests', label: 'Vests & Jackets', count: PRODUCTS.filter(p => p.category === 'vests').length },
];

export const SIZE_CHART_DATA = {
  hoodies: [
    { size: 'S', chest: '36-38"', length: '27"', sleeve: '25"' },
    { size: 'M', chest: '40-42"', length: '28"', sleeve: '26"' },
    { size: 'L', chest: '44-46"', length: '29"', sleeve: '27"' },
    { size: 'XL', chest: '48-50"', length: '30"', sleeve: '28"' },
    { size: '2XL', chest: '52-54"', length: '31"', sleeve: '29"' },
    { size: '3XL', chest: '56-58"', length: '32"', sleeve: '30"' }
  ],
  tracksuits: [
    { size: 'S', chest: '38"', jacketLength: '26"', waist: '28-30"', pantLength: '39"' },
    { size: 'M', chest: '41"', jacketLength: '27"', waist: '31-33"', pantLength: '40"' },
    { size: 'L', chest: '44"', jacketLength: '28"', waist: '34-36"', pantLength: '41"' },
    { size: 'XL', chest: '47"', jacketLength: '29"', waist: '37-39"', pantLength: '42"' },
    { size: '2XL', chest: '50"', jacketLength: '30"', waist: '40-43"', pantLength: '43"' },
    { size: '3XL', chest: '53"', jacketLength: '31"', waist: '44-47"', pantLength: '44"' }
  ],
  polos: [
    { size: 'S', chest: '36-38"', length: '27"', shoulder: '17"' },
    { size: 'M', chest: '39-41"', length: '28"', shoulder: '18"' },
    { size: 'L', chest: '42-44"', length: '29"', shoulder: '19"' },
    { size: 'XL', chest: '45-47"', length: '30"', shoulder: '20"' },
    { size: '2XL', chest: '48-50"', length: '31"', shoulder: '21"' },
    { size: '3XL', chest: '51-53"', length: '32"', shoulder: '22"' }
  ],
  ponchos: [
    { size: 'One Size', width: '130 cm (Draped Span)', length: '88 cm (From Shoulder to Fringe)', fit: 'Universal Draped Unisex Fit' }
  ],
  caps: [
    { size: 'One Size', circumference: '54 - 60 cm (Adjustable Strap)', crown: '11.5 cm', brim: '7.5 cm' }
  ]
};
