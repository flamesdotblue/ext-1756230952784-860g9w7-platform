import React, { useMemo, useRef, useState } from 'react';

// Minimal single-file app implementing an online store for a neo-traditional tattoo artist
// Includes: Flash sheets, prints, booking, sketchbook photos, social links, and "See Available Designs"

const currency = (n) => `$${n.toFixed(2)}`;

const FLASH_SHEETS = [
  {
    id: 'flash-rose-skull',
    title: 'Rose & Skull Flash',
    price: 180,
    size: 'A4',
    img: 'https://images.unsplash.com/photo-1630587148261-c1e798637a9b?q=80&w=1200&auto=format&fit=crop',
    tags: ['neo-traditional', 'rose', 'skull'],
  },
  {
    id: 'flash-snake-dagger',
    title: 'Snake & Dagger Flash',
    price: 220,
    size: 'A3',
    img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop',
    tags: ['neo-traditional', 'snake', 'dagger'],
  },
  {
    id: 'flash-panther',
    title: 'Panther Flash',
    price: 200,
    size: 'A4',
    img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1200&auto=format&fit=crop',
    tags: ['neo-traditional', 'panther'],
  },
  {
    id: 'flash-moth',
    title: 'Death Moth Flash',
    price: 160,
    size: 'A4',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
    tags: ['neo-traditional', 'moth'],
  },
];

const PRINTS = [
  {
    id: 'print-rose',
    title: 'Rose Study Print',
    price: 35,
    size: 'A4 Giclée',
    img: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'print-wolf',
    title: 'Wolf Howl Print',
    price: 45,
    size: 'A3 Giclée',
    img: 'https://images.unsplash.com/photo-1533139502658-0198f920d8ae?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'print-dagger',
    title: 'Dagger & Bloom Print',
    price: 40,
    size: 'A3 Giclée',
    img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop',
  },
];

const SKETCHBOOK = [
  'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532153955177-f59af40d6472?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop',
];

function SocialIcon({ type, href }) {
  const icons = {
    instagram: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6m4.5-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2"/></svg>
    ),
    tiktok: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M12.63 2h3.004a6.87 6.87 0 0 0 2.156 4.285A7 7 0 0 0 21.96 8.5v3.036a9.01 9.01 0 0 1-4.55-1.427 9.28 9.28 0 0 1-1.076-.79v6.968a5.79 5.79 0 1 1-5.79-5.79c.26 0 .514.02.76.06v3.086a2.71 2.71 0 1 0 1.7 2.518zm0 0V2z"/></svg>
    ),
    pinterest: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.5 19.4c-.05-.83-.1-2.1.02-3 .1-.72.66-4.6.66-4.6s-.17-.35-.17-.88c0-.83.48-1.46 1.08-1.46.51 0 .75.38.75.83 0 .5-.32 1.25-.49 1.94-.14.58.3 1.05.9 1.05 1.08 0 1.9-1.14 1.9-2.8 0-1.46-1.05-2.49-2.55-2.49-1.74 0-2.76 1.3-2.76 2.65 0 .53.2 1.09.46 1.4.05.06.06.11.04.17-.04.19-.13.6-.15.69-.02.07-.09.1-.16.06-.6-.28-.98-1.16-.98-1.86 0-1.52 1.1-2.92 3.2-2.92 1.68 0 2.99 1.2 2.99 2.8 0 1.67-1.05 3.02-2.5 3.02-.49 0-.95-.25-1.1-.55l-.3 1.13c-.11.43-.41.96-.61 1.29.46.14.94.21 1.43.21A8 8 0 1 0 12 2"/></svg>
    ),
  };
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-rose-200 hover:text-rose-100 transition-colors" aria-label={type}>
      {icons[type]}
    </a>
  );
}

function Header({ onOpenCart, onScrollToDesigns }) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-700/20 ring-1 ring-rose-700/40">
            <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3.3 0 6 2.7 6 6 0 2.2-1.2 4.1-3 5.2V22l-3-2-3 2v-8.8A6 6 0 0 1 6 8c0-3.3 2.7-6 6-6Z"/></svg>
          </span>
          <div>
            <div className="text-zinc-100 tracking-wider font-semibold">Black Rose Tattoo</div>
            <div className="text-xs text-zinc-400">Neo-traditional • Studio</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#designs" className="text-zinc-300 hover:text-rose-300">Designs</a>
          <a href="#prints" className="text-zinc-300 hover:text-rose-300">Prints</a>
          <a href="#sketchbook" className="text-zinc-300 hover:text-rose-300">Sketchbook</a>
          <a href="#booking" className="text-zinc-300 hover:text-rose-300">Booking</a>
          <button onClick={onScrollToDesigns} className="px-3 py-1.5 rounded-md bg-rose-600/90 hover:bg-rose-600 text-white">See Available Designs</button>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <SocialIcon type="instagram" href="https://instagram.com" />
            <SocialIcon type="tiktok" href="https://tiktok.com" />
            <SocialIcon type="pinterest" href="https://pinterest.com" />
          </div>
          <button onClick={onOpenCart} className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-200 hover:bg-zinc-800">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h-2l-1 2v2h2l2.5 9.5h9.5l2.5-9.5h2v-2h-15zM9 20a2 2 0 1 0 .001 3.999A2 2 0 0 0 9 20m9 0a2 2 0 1 0 .001 3.999A2 2 0 0 0 18 20"/></svg>
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onScrollToDesigns }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900" />
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 20% 10%, rgba(244,63,94,.2), transparent 40%), radial-gradient(circle at 80% 20%, rgba(244,63,94,.15), transparent 40%), radial-gradient(circle at 50% 80%, rgba(244,63,94,.12), transparent 50%)'}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-100">
              Neo‑Traditional Ink, Crafted to Last
            </h1>
            <p className="mt-4 text-zinc-300 max-w-prose">
              Original flash available for booking, museum-quality prints, and a peek inside the sketchbook. Bold lines, rich color palettes, and timeless symbolism.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onScrollToDesigns} className="px-5 py-3 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium">
                See Available Designs
              </button>
              <a href="#booking" className="px-5 py-3 rounded-md border border-zinc-700 text-zinc-200 hover:bg-zinc-800 font-medium">Book a Session</a>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1400&auto=format&fit=crop" alt="Neo-traditional tattoo studio vibes" className="rounded-xl border border-zinc-800 shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 rotate-[-6deg] bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 shadow-xl">
              <div className="text-sm text-zinc-300">Bold lines. Rich stories.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item, onAdd }) {
  return (
    <div className="group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-rose-700/50 transition-colors">
      <div className="aspect-[4/3] overflow-hidden bg-zinc-800">
        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-zinc-100 font-semibold leading-tight">{item.title}</h3>
          <span className="text-rose-300 font-medium whitespace-nowrap">{currency(item.price)}</span>
        </div>
        {'size' in item && (
          <div className="text-xs text-zinc-400 mt-1">{item.size}</div>
        )}
        {'tags' in item && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">#{t}</span>
            ))}
          </div>
        )}
        <div className="mt-4">
          <button onClick={() => onAdd(item)} className="w-full px-3 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-sm">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, items, onIncrement, onDecrement, onRemove, onCheckout }) {
  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.qty, 0), [items]);
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-zinc-100 font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4l-6.3 6.3-1.41-1.42L9.17 12l-6.3-6.29L4.29 4.3l6.3 6.29 6.3-6.3z"/></svg>
          </button>
        </div>
        <div className="p-4 max-h-[calc(100%-160px)] overflow-auto space-y-3">
          {items.length === 0 && (
            <div className="text-zinc-400 text-sm">Your cart is empty. Add some flash or prints!</div>
          )}
          {items.map((it) => (
            <div key={it.id} className="flex gap-3 border border-zinc-800 rounded-lg p-2 bg-zinc-900">
              <img src={it.img} alt="" className="w-20 h-20 object-cover rounded-md border border-zinc-800" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-zinc-100 font-medium leading-tight">{it.title}</div>
                    <div className="text-xs text-zinc-400">{it.size || 'One size'}</div>
                  </div>
                  <button onClick={() => onRemove(it.id)} className="text-zinc-500 hover:text-rose-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7h12v2H6zM9 9h2v10H9zm4 0h2v10h-2zM9 4h6l1 2H8z"/></svg>
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onDecrement(it.id)} className="w-7 h-7 rounded bg-zinc-800 text-zinc-200">-</button>
                    <div className="w-8 text-center text-zinc-100">{it.qty}</div>
                    <button onClick={() => onIncrement(it.id)} className="w-7 h-7 rounded bg-zinc-800 text-zinc-200">+</button>
                  </div>
                  <div className="text-rose-300 font-medium">{currency(it.price * it.qty)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="text-zinc-300">Total</div>
            <div className="text-rose-300 font-semibold">{currency(total)}</div>
          </div>
          <button disabled={items.length === 0} onClick={onCheckout} className={`w-full px-4 py-3 rounded-md text-white ${items.length === 0 ? 'bg-zinc-800 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500'}`}>
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}

function BookingForm({ designs }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',
    designId: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
  }

  if (submitted) {
    const design = designs.find((d) => d.id === form.designId);
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="text-zinc-100 text-xl font-semibold">Request received</h3>
        <p className="text-zinc-300 mt-2">
          Thanks {form.name}! I\'ll reach out at {form.email} within 48 hours. Preferred date: {form.date || 'flexible'}.
        </p>
        {design && (
          <div className="mt-4 flex items-center gap-3">
            <img src={design.img} alt="" className="w-20 h-20 object-cover rounded border border-zinc-800" />
            <div className="text-sm text-zinc-300">Selected design: <span className="font-medium text-zinc-100">{design.title}</span></div>
          </div>
        )}
        <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', date: '', designId: '', notes: '' }); }} className="mt-6 px-4 py-2 rounded-md border border-zinc-700 text-zinc-200 hover:bg-zinc-800">
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-zinc-100 text-xl font-semibold">Booking Request</h3>
      <p className="text-zinc-400 text-sm mt-1">Submit your info and preferred date. I\'ll confirm availability and details.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm text-zinc-300">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm text-zinc-300">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="mt-1 w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm text-zinc-300">Preferred Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="mt-1 w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500" />
        </div>
        <div>
          <label className="block text-sm text-zinc-300">Design (optional)</label>
          <select name="designId" value={form.designId} onChange={handleChange} className="mt-1 w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100">
            <option value="">No preference / custom</option>
            {designs.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-zinc-300">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} placeholder="Placement, size, color palette, references..." className="mt-1 w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-zinc-500">A non-refundable deposit may be required to secure the appointment.</div>
        <button type="submit" className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white">Request Booking</button>
      </div>
    </form>
  );
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const designsRef = useRef(null);

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }
  function removeFromCart(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }
  function inc(id) {
    setCart((prev) => prev.map((p) => p.id === id ? { ...p, qty: p.qty + 1 } : p));
  }
  function dec(id) {
    setCart((prev) => prev.flatMap((p) => p.id === id ? (p.qty > 1 ? [{ ...p, qty: p.qty - 1 }] : []) : [p]));
  }
  function checkout() {
    const total = cart.reduce((s, p) => s + p.qty * p.price, 0);
    alert(`Thank you! This demo would process your order of ${cart.length} item(s) totaling ${currency(total)}.`);
    setCart([]);
    setCartOpen(false);
  }

  const scrollToDesigns = () => designsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header onOpenCart={() => setCartOpen(true)} onScrollToDesigns={scrollToDesigns} />
      <main>
        <Hero onScrollToDesigns={scrollToDesigns} />

        <section id="designs" ref={designsRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Available Flash Designs</h2>
              <p className="text-zinc-400 text-sm mt-1">First come, first served. Each flash design is tattooed once.</p>
            </div>
            <a href="#booking" className="hidden sm:inline px-3 py-2 rounded-md border border-zinc-700 text-zinc-200 hover:bg-zinc-800">Book from this selection</a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {FLASH_SHEETS.map((item) => (
              <ProductCard key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        </section>

        <section id="prints" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold">Art Prints</h2>
          <p className="text-zinc-400 text-sm mt-1">Archival giclée prints on heavy cotton rag. Signed.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {PRINTS.map((item) => (
              <ProductCard key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        </section>

        <section id="sketchbook" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">Sketchbook</h2>
            <div className="text-sm text-zinc-400">WIP, studies, and color tests</div>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {SKETCHBOOK.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                <img src={src} alt="Sketchbook page" className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        </section>

        <section id="booking" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <BookingForm designs={FLASH_SHEETS} />
            <div className="rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6">
              <h3 className="text-zinc-100 text-xl font-semibold">Session Info</h3>
              <ul className="mt-4 space-y-3 text-zinc-300 text-sm">
                <li className="flex gap-3"><span className="text-rose-400">•</span> Flash designs are tattooed once. A deposit may be required.</li>
                <li className="flex gap-3"><span className="text-rose-400">•</span> Custom pieces welcome. Provide references in notes.</li>
                <li className="flex gap-3"><span className="text-rose-400">•</span> Studio located in the Arts District. By appointment only.</li>
                <li className="flex gap-3"><span className="text-rose-400">•</span> Healed work featured with consent only.</li>
              </ul>
              <div className="mt-6 aspect-[16/10] overflow-hidden rounded-lg border border-zinc-800">
                <img src="https://images.unsplash.com/photo-1597239450996-b47c8b2f9f36?q=80&w=1400&auto=format&fit=crop" alt="Studio desk with inks and sketchbook" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-zinc-200 font-semibold">Black Rose Tattoo</div>
              <div className="text-zinc-500 text-sm">Neo-traditional tattooing and illustration</div>
            </div>
            <div className="flex items-center gap-4">
              <SocialIcon type="instagram" href="https://instagram.com" />
              <SocialIcon type="tiktok" href="https://tiktok.com" />
              <SocialIcon type="pinterest" href="https://pinterest.com" />
            </div>
          </div>
          <div className="mt-6 text-xs text-zinc-500">© {new Date().getFullYear()} Black Rose Tattoo. All rights reserved.</div>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onIncrement={inc}
        onDecrement={dec}
        onRemove={removeFromCart}
        onCheckout={checkout}
      />
    </div>
  );
}
