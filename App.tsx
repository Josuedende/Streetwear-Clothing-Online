import { useMemo, useState } from "react";
import ControlCenter, { type Order, type Product, type User } from "./ControlCenter";

type CartItem = Product & { quantity: number };

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Contour Utility Jacket",
    category: "Outerwear",
    price: 168,
    color: "Charcoal",
    sizes: ["S", "M", "L", "XL"], 
    inventory: 12,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1761637332438-02a9319195f8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "After Hours Track Set",
    category: "Sets",
    price: 142,
    color: "Onyx",
    sizes: ["XS", "S", "M", "L"],
    inventory: 28,
    badge: "Trending",
    image:
      "https://images.unsplash.com/photo-1548123378-bde4eca81d2d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Base Layer Heavy Tee",
    category: "T-Shirts",
    price: 58,
    color: "Bone",
    sizes: ["S", "M", "L", "XL"],
    inventory: 54,
    image:
      "https://images.unsplash.com/photo-1611166705419-30ee8dab0a9a?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Studio Denim Co-ord",
    category: "Sets",
    price: 196,
    color: "Indigo",
    sizes: ["S", "M", "L"],
    inventory: 8,
    badge: "Limited",
    image:
      "https://images.unsplash.com/photo-1756451182421-d2a1961638c9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Sandstorm Boxy Tee",
    category: "T-Shirts",
    price: 64,
    color: "Sand",
    sizes: ["XS", "S", "M", "L", "XL"],
    inventory: 34,
    image:
      "https://images.unsplash.com/photo-1598211709206-2a5f645f8684?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Division Bomber",
    category: "Outerwear",
    price: 184,
    color: "Shadow",
    sizes: ["M", "L", "XL"],
    inventory: 17,
    image:
      "https://images.unsplash.com/photo-1594035795389-9363dd86b113?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = ["All", "Outerwear", "T-Shirts", "Sets"];
const priceRanges = ["Any price", "Under R 100", "R 100–R 175", "R 175+"];

const formatRand = (value: number) => `R ${value.toLocaleString("en-ZA")}`;

function Icon({
  name,
  size = 20,
}: {
  name: "search" | "bag" | "user" | "heart" | "menu" | "close" | "arrow" | "minus" | "plus";
  size?: number;
}) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bag: <><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All sizes");
  const [colorFilter, setColorFilter] = useState("All colors");
  const [priceFilter, setPriceFilter] = useState("Any price");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notice, setNotice] = useState("");
  const [portal, setPortal] = useState<"account" | "admin" | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    { id: "#KV-1048", date: "May 24, 2025", total: 310, status: "Shipped", customer: "Maya Chen", items: 2 },
    { id: "#KV-1047", date: "May 23, 2025", total: 168, status: "Packed", customer: "Noah Williams", items: 1 },
    { id: "#KV-1046", date: "May 21, 2025", total: 254, status: "Delivered", customer: "Avery Jones", items: 3 },
  ]);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (activeCategory === "All" || product.category === activeCategory) &&
          (sizeFilter === "All sizes" || product.sizes.includes(sizeFilter)) &&
          (colorFilter === "All colors" || product.color === colorFilter) &&
          (priceFilter === "Any price" ||
            (priceFilter === "Under R 100" && product.price < 100) ||
            (priceFilter === "R 100–R 175" && product.price >= 100 && product.price <= 175) ||
            (priceFilter === "R 175+" && product.price > 175)) &&
          product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [activeCategory, sizeFilter, colorFilter, priceFilter, search, products],
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing
        ? current.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...current, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added`);
    window.setTimeout(() => setNotice(""), 1800);
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((current) =>
      current
        .map((item) => ({ ...item, quantity: item.quantity + (item.id === id ? change : 0) }))
        .filter((item) => item.quantity > 0),
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <main className="min-h-screen bg-[#f2f1ed] text-[#11120f] selection:bg-[#d8ff3e]">
      <div className="bg-[#d8ff3e] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.18em]">
        Free shipping on orders over R 120 — Drop 02 live now
      </div>

      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f2f1ed]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={23} />
          </button>
          <a href="#" className="font-display text-3xl font-black tracking-[-0.08em]">
            Kasi Vibes
          </a>
          <nav className="hidden items-center gap-9 text-xs font-semibold uppercase tracking-[0.12em] md:flex">
            {["New arrivals", "Shop", "Editorial", "Admin"].map((item) =>
              item === "Admin" ? (
                <button key={item} onClick={() => setPortal("admin")} className="nav-link">
                  {item}
                </button>
              ) : (
                <a key={item} href={item === "Shop" ? "#shop" : "#"} className="nav-link">
                  {item}
                </a>
              ),
            )}
          </nav>
          <div className="flex items-center gap-5">
            <button aria-label="Search" onClick={() => setSearchOpen((value) => !value)}>
              <Icon name="search" />
            </button>
            <button className="hidden sm:block" aria-label="Account" onClick={() => setPortal("account")}>
              <Icon name="user" />
            </button>
            <button className="relative" aria-label="Shopping bag" onClick={() => setCartOpen(true)}>
              <Icon name="bag" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d8ff3e] px-1 text-[9px] font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-black/10 px-5 py-4 md:px-10">
            <div className="mx-auto flex max-w-[1440px] items-center gap-3">
              <Icon name="search" />
              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search the collection..."
                className="w-full bg-transparent py-2 text-lg outline-none placeholder:text-black/35"
              />
              <button onClick={() => { setSearch(""); setSearchOpen(false); }} aria-label="Close search">
                <Icon name="close" />
              </button>
            </div>
          </div>
        )}
      </header>

      <section className="relative min-h-[670px] overflow-hidden bg-[#1b1c18] text-white">
        <img
          src="https://images.unsplash.com/photo-1548123378-bde4eca81d2d?auto=format&fit=crop&w=1800&q=90"
          alt="Model wearing a black streetwear tracksuit"
          className="absolute inset-0 h-full w-full object-cover object-[65%_35%] opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/15 to-transparent" />
        <div className="relative mx-auto flex min-h-[670px] max-w-[1440px] flex-col justify-end px-5 pb-14 md:px-10 md:pb-20">
          <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em]">
            <span className="h-px w-10 bg-[#d8ff3e]" /> Spring / Summer 2025
          </p>
          <h1 className="font-display max-w-4xl text-[clamp(4.5rem,12vw,10.5rem)] font-black uppercase leading-[0.76] tracking-[-0.075em]">
            Own the <span className="text-[#d8ff3e]">streets.</span>
          </h1>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <a
              href="#shop"
              className="group flex w-fit items-center gap-10 bg-white px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-[#d8ff3e]"
            >
              Shop the drop
              <span className="transition-transform group-hover:translate-x-1"><Icon name="arrow" /></span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              Uniforms for the after-hours. Built in limited runs, designed without limits.
            </p>
          </div>
        </div>
        <p className="absolute bottom-8 right-10 hidden origin-bottom-right -rotate-90 text-[10px] uppercase tracking-[0.2em] text-white/60 md:block">
          Scroll to discover — 01
        </p>
      </section>

      <section id="shop" className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-black/50">Drop 02 / 2025</p>
            <h2 className="font-display text-5xl font-black uppercase tracking-[-0.055em] md:text-7xl">
              Latest pieces
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  activeCategory === category
                    ? "border-black bg-black text-white"
                    : "border-black/20 hover:border-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-3 border-y border-black/10 py-4 sm:grid-cols-3">
          <label className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.14em]">
            Size
            <select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)} className="min-w-36 bg-transparent py-2 text-right text-xs font-medium normal-case tracking-normal outline-none">
              {["All sizes", "XS", "S", "M", "L", "XL"].map((size) => <option key={size}>{size}</option>)}
            </select>
          </label>
          <label className="flex items-center justify-between gap-3 border-black/10 text-[10px] font-bold uppercase tracking-[0.14em] sm:border-x sm:px-5">
            Color
            <select value={colorFilter} onChange={(event) => setColorFilter(event.target.value)} className="min-w-36 bg-transparent py-2 text-right text-xs font-medium normal-case tracking-normal outline-none">
              {["All colors", ...Array.from(new Set(products.map((product) => product.color)))].map((color) => <option key={color}>{color}</option>)}
            </select>
          </label>
          <label className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.14em]">
            Price
            <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} className="min-w-36 bg-transparent py-2 text-right text-xs font-medium normal-case tracking-normal outline-none">
              {priceRanges.map((price) => <option key={price}>{price}</option>)}
            </select>
          </label>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <article key={product.id} className="product-card group">
                <div className={`relative overflow-hidden bg-[#deddd7] ${index === 1 ? "lg:mt-20" : ""}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-[4/5] w-full object-cover grayscale-[15%] transition duration-700 group-hover:scale-[1.035] group-hover:grayscale-0"
                  />
                  {product.badge && (
                    <span className="absolute left-4 top-4 bg-[#d8ff3e] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]">
                      {product.badge}
                    </span>
                  )}
                  <button
                    aria-label="Add to favorites"
                    onClick={() => toggleFavorite(product.id)}
                    className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full transition ${
                      favorites.includes(product.id) ? "bg-[#d8ff3e]" : "bg-white/90 hover:bg-white"
                    }`}
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill={favorites.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 left-4 right-4 flex translate-y-4 items-center justify-between bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white opacity-0 transition-all duration-300 hover:bg-[#d8ff3e] hover:text-black group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    Add to bag <Icon name="plus" size={18} />
                  </button>
                </div>
                <div className="flex items-start justify-between gap-4 pt-5">
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase tracking-[-0.02em]">{product.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/50">
                      {product.color} / Unisex
                    </p>
                  </div>
                  <p className="font-display text-lg font-bold">{formatRand(product.price)}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-y border-black/15 py-24 text-center">
            <p className="font-display text-3xl font-bold uppercase">No pieces found</p>
            <button onClick={() => { setSearch(""); setActiveCategory("All"); setSizeFilter("All sizes"); setColorFilter("All colors"); setPriceFilter("Any price"); }} className="mt-4 text-xs font-bold uppercase tracking-widest underline">
              Reset search
            </button>
          </div>
        )}
      </section>

      <section className="bg-[#11120f] px-5 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#d8ff3e]">Kasi Vibes Editorial 004</p>
            <h2 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] md:text-7xl">
              Night shift:<br />the city edit
            </h2>
            <p className="mt-7 max-w-md text-sm leading-7 text-white/60">
              Technical layers meet relaxed proportions. A study in movement, shadow and the places that come alive after dark.
            </p>
            <a href="#" className="mt-8 inline-flex items-center gap-6 border-b border-white/40 pb-2 text-xs font-bold uppercase tracking-[0.16em] hover:border-[#d8ff3e] hover:text-[#d8ff3e]">
              Explore the story <Icon name="arrow" />
            </a>
          </div>
          <div className="order-1 grid grid-cols-2 gap-3 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1594035795389-9363dd86b113?auto=format&fit=crop&w=900&q=85"
              alt="Streetwear editorial"
              className="mt-16 aspect-[3/4] w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1611166705419-30ee8dab0a9a?auto=format&fit=crop&w=900&q=85"
              alt="Streetwear model in city"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#d8ff3e] px-5 py-16 md:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">Members get first access</p>
            <h2 className="font-display mt-2 text-4xl font-black uppercase tracking-[-0.04em] md:text-5xl">Stay ahead of the drop.</h2>
          </div>
          <form className="flex w-full max-w-md border-b-2 border-black py-3" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-transparent text-xs font-bold tracking-[0.12em] outline-none placeholder:text-black/60" />
            <button aria-label="Subscribe"><Icon name="arrow" /></button>
          </form>
        </div>
      </section>

      <footer className="bg-[#f2f1ed] px-5 py-14 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 border-b border-black/15 pb-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-display text-3xl font-black tracking-[-0.08em]">Kasi Vibes</p>
              <p className="mt-4 max-w-xs text-sm leading-6 text-black/55">Independent streetwear for the independently minded.</p>
            </div>
            {[
              ["Shop", "New arrivals", "Outerwear", "T-Shirts", "Accessories"],
              ["Help", "Shipping", "Returns", "Size guide", "Contact"],
              ["Follow", "Instagram", "TikTok", "Pinterest", "Spotify"],
            ].map(([title, ...links]) => (
              <div key={title}>
                <p className="mb-4 text-[11px] font-black uppercase tracking-[0.16em]">{title}</p>
                <div className="space-y-2.5 text-sm text-black/55">
                  {links.map((link) => <a key={link} href="#" className="block hover:text-black">{link}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45 sm:flex-row">
            <p>© 2025 Kasi Vibes. All rights reserved.</p>
            <p>Frontend concept / No payments are processed</p>
          </div>
        </div>
      </footer>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#11120f] p-6 text-white md:hidden">
          <div className="flex items-center justify-between">
            <p className="font-display text-3xl font-black tracking-[-0.08em]">Kasi Vibes</p>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><Icon name="close" size={26} /></button>
          </div>
          <nav className="mt-20 flex flex-col gap-6 font-display text-5xl font-black uppercase tracking-[-0.04em]">
            {["New arrivals", "Shop", "Editorial", "Admin", "Account"].map((item, index) => (
              <a key={item} href={item === "Shop" ? "#shop" : "#"} onClick={(event) => { if (item === "Account" || item === "Admin") { event.preventDefault(); setPortal(item === "Admin" ? "admin" : "account"); } setMenuOpen(false); }} className="flex items-center justify-between border-b border-white/15 pb-5">
                {item}<span className="text-xs font-normal text-[#d8ff3e]">0{index + 1}</span>
              </a>
            ))}
          </nav>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" onMouseDown={() => setCartOpen(false)}>
          <aside className="flex h-full w-full max-w-md flex-col bg-[#f2f1ed] p-6 sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-black/15 pb-5">
              <h2 className="font-display text-3xl font-black uppercase tracking-[-0.04em]">
                {checkout ? "Checkout" : `Your bag (${cartCount})`}
              </h2>
              <button onClick={() => { setCartOpen(false); setCheckout(false); }} aria-label="Close cart"><Icon name="close" /></button>
            </div>
            {checkout ? (
              <form className="mt-8 flex flex-1 flex-col" onSubmit={(event) => {
                event.preventDefault();
                setOrders((current) => [{
                  id: `#KV-${1049 + current.length}`,
                  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  total: subtotal,
                  status: "Processing",
                  customer: user?.name ?? "Guest Customer",
                  items: cartCount,
                }, ...current]);
                setCart([]);
                setCheckout(false);
                setCartOpen(false);
                setNotice("Order confirmed — thank you");
                window.setTimeout(() => setNotice(""), 2500);
              }}>
                <p className="mb-6 text-sm leading-6 text-black/55">Enter your delivery details. This is a frontend demo; no payment will be processed.</p>
                <div className="space-y-4">
                  {["Full name", "Email address", "Street address", "City", "Postal code"].map((field) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em]">{field}</span>
                      <input required type={field.includes("Email") ? "email" : "text"} className="w-full border border-black/20 bg-transparent px-4 py-3.5 outline-none transition focus:border-black" />
                    </label>
                  ))}
                </div>
                <button className="mt-auto w-full bg-black py-4 text-xs font-bold uppercase tracking-[0.15em] text-white hover:bg-[#d8ff3e] hover:text-black">
                  Place demo order — {formatRand(subtotal)}
                </button>
              </form>
            ) : cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-black/15"><Icon name="bag" size={26} /></span>
                <p className="font-display text-2xl font-bold uppercase">Your bag is empty</p>
                <p className="mt-2 max-w-xs text-sm text-black/50">Your next favorite piece is waiting in the latest drop.</p>
                <button onClick={() => setCartOpen(false)} className="mt-6 bg-black px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white">Explore the drop</button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto py-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt="" className="h-28 w-24 object-cover" />
                      <div className="flex flex-1 flex-col py-1">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-display text-base font-bold uppercase">{item.name}</p>
                            <p className="mt-1 text-[10px] uppercase tracking-wider text-black/50">{item.color} / M</p>
                          </div>
                          <p className="text-sm font-bold">{formatRand(item.price * item.quantity)}</p>
                        </div>
                        <div className="mt-auto flex w-fit items-center border border-black/20">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2" aria-label="Decrease quantity"><Icon name="minus" size={14} /></button>
                          <span className="min-w-7 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2" aria-label="Increase quantity"><Icon name="plus" size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-black/15 pt-5">
                  <div className="mb-2 flex justify-between text-sm"><span>Subtotal</span><strong>{formatRand(subtotal)}</strong></div>
                  <p className="mb-5 text-[11px] text-black/50">Shipping and taxes calculated at checkout.</p>
                  <button onClick={() => setCheckout(true)} className="w-full bg-black py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#d8ff3e] hover:text-black">
                    Continue to checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 bg-[#d8ff3e] px-6 py-3 text-xs font-black uppercase tracking-[0.12em] shadow-xl">
          {notice}
        </div>
      )}
      {portal && (
        <ControlCenter
          mode={portal}
          onClose={() => setPortal(null)}
          user={user}
          setUser={setUser}
          products={products}
          setProducts={setProducts}
          orders={orders}
          setOrders={setOrders}
        />
      )}
    </main>
  );
}
