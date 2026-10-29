import { useState } from "react";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  color: string;
  sizes: string[];
  inventory: number;
  badge?: string;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: "Processing" | "Packed" | "Shipped" | "Delivered";
  customer: string;
  items: number;
};

export type User = {
  name: string;
  email: string;
  role: "customer" | "admin";
  phone?: string;
  address?: string;
};

type Props = {
  mode: "account" | "admin";
  onClose: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
};

const seededCustomers = [
  { name: "Maya Chen", email: "maya@example.com", orders: 4, spent: 614, status: "Active" },
  { name: "Noah Williams", email: "noah@example.com", orders: 2, spent: 286, status: "Active" },
  { name: "Avery Jones", email: "avery@example.com", orders: 7, spent: 1024, status: "VIP" },
  { name: "Sam Rivera", email: "sam@example.com", orders: 1, spent: 94, status: "Active" },
];

const formatRand = (value: number) => `R ${value.toLocaleString("en-ZA")}`;

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-black/55">{label}</span>
      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function AccountView({ user, setUser, orders, openAdmin }: {
  user: User | null;
  setUser: (user: User | null) => void;
  orders: Order[];
  openAdmin: () => void;
}) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [section, setSection] = useState<"overview" | "orders" | "profile">("overview");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[75vh] max-w-5xl items-center">
        <div className="grid w-full overflow-hidden border border-black/15 bg-[#f2f1ed] md:grid-cols-2">
          <div className="hidden min-h-[620px] bg-[url('https://images.unsplash.com/photo-1756451182421-d2a1961638c9?auto=format&fit=crop&w=900&q=85')] bg-cover bg-center md:block" />
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/45">Kasi Vibes Members</p>
            <h2 className="font-display mt-3 text-4xl font-black uppercase tracking-[-0.05em]">
              {authMode === "login" ? "Welcome back." : "Join the movement."}
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/55">
              {authMode === "login"
                ? "Sign in to track orders, save favorites and check out faster."
                : "Create an account for early access to limited drops."}
            </p>
            <div className="mt-8 flex border-b border-black/15">
              {(["login", "register"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setAuthMode(item)}
                  className={`flex-1 border-b-2 py-3 text-[11px] font-bold uppercase tracking-[0.15em] ${authMode === item ? "border-black" : "border-transparent text-black/40"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <form
              className="mt-7 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setUser({
                  name: authMode === "register" ? name : email.split("@")[0] || "Member",
                  email,
                  role: "customer",
                });
              }}
            >
              {authMode === "register" && <Field label="Full name" value={name} onChange={setName} />}
              <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Minimum 8 characters" />
              <button className="w-full bg-black py-4 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#d8ff3e] hover:text-black">
                {authMode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
            <button
              onClick={() => setUser({ name: "Demo Admin", email: "admin@kasivibes.co.za", role: "admin" })}
              className="mt-4 border border-black/20 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] hover:border-black"
            >
              Use administrator demo account
            </button>
            <p className="mt-5 text-center text-[10px] text-black/40">Demo only — credentials are not transmitted or stored.</p>
          </div>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter((order) => order.customer === user.name || user.role === "admin");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/45">Member account</p>
          <h2 className="font-display mt-2 text-5xl font-black uppercase tracking-[-0.055em]">Hi, {user.name.split(" ")[0]}.</h2>
        </div>
        <button onClick={() => setUser(null)} className="w-fit text-[11px] font-bold uppercase tracking-[0.14em] underline">Sign out</button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {(["overview", "orders", "profile"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`whitespace-nowrap px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] ${section === item ? "bg-black text-white" : "border border-black/15"}`}
            >
              {item}
            </button>
          ))}
          {user.role === "admin" && (
            <button onClick={openAdmin} className="whitespace-nowrap bg-[#d8ff3e] px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em]">Admin console</button>
          )}
        </nav>
        <div>
          {section === "overview" && (
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Orders", String(userOrders.length)],
                ["Saved pieces", "04"],
                ["Member since", "2025"],
              ].map(([label, value]) => (
                <div key={label} className="border border-black/15 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/45">{label}</p>
                  <p className="font-display mt-4 text-4xl font-black">{value}</p>
                </div>
              ))}
              <div className="border border-black/15 p-6 sm:col-span-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/45">Latest order</p>
                {userOrders[0] ? (
                  <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div><p className="font-display text-xl font-bold">{userOrders[0].id}</p><p className="mt-1 text-sm text-black/50">{userOrders[0].date} · {userOrders[0].items} items</p></div>
                    <span className="w-fit bg-[#d8ff3e] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">{userOrders[0].status}</span>
                  </div>
                ) : <p className="mt-5 text-sm text-black/50">No orders yet. Your first drop is waiting.</p>}
              </div>
            </div>
          )}
          {section === "orders" && (
            <div className="border border-black/15">
              <div className="border-b border-black/15 p-6"><h3 className="font-display text-2xl font-bold uppercase">Order history & tracking</h3></div>
              {userOrders.length ? userOrders.map((order) => (
                <div key={order.id} className="flex flex-col justify-between gap-5 border-b border-black/10 p-6 last:border-0 sm:flex-row sm:items-center">
                  <div><p className="font-display text-lg font-bold">{order.id}</p><p className="mt-1 text-xs text-black/50">{order.date} · {order.items} items · {formatRand(order.total)}</p></div>
                  <div className="min-w-56">
                    <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider"><span>{order.status}</span><span>{order.status === "Delivered" ? "100%" : order.status === "Shipped" ? "75%" : order.status === "Packed" ? "50%" : "25%"}</span></div>
                    <div className="h-1 bg-black/10"><div className="h-full bg-black" style={{ width: order.status === "Delivered" ? "100%" : order.status === "Shipped" ? "75%" : order.status === "Packed" ? "50%" : "25%" }} /></div>
                  </div>
                </div>
              )) : <p className="p-10 text-center text-sm text-black/45">No purchases to show yet.</p>}
            </div>
          )}
          {section === "profile" && (
            <form
              className="grid gap-5 border border-black/15 p-6 sm:grid-cols-2 sm:p-8"
              onSubmit={(event) => {
                event.preventDefault();
                setUser({ ...user, name, email, phone, address });
              }}
            >
              <div className="sm:col-span-2"><h3 className="font-display text-2xl font-bold uppercase">Profile details</h3><p className="mt-2 text-sm text-black/50">Manage your contact and delivery information.</p></div>
              <Field label="Full name" value={name} onChange={setName} />
              <Field label="Email address" type="email" value={email} onChange={setEmail} />
              <Field label="Phone" value={phone} onChange={setPhone} />
              <Field label="Delivery address" value={address} onChange={setAddress} />
              <button className="bg-black py-4 text-xs font-bold uppercase tracking-[0.15em] text-white sm:col-span-2">Save changes</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminView({ products, setProducts, orders, setOrders, user }: Omit<Props, "mode" | "onClose" | "setUser">) {
  const [section, setSection] = useState<"dashboard" | "products" | "orders" | "customers">("dashboard");
  const [editing, setEditing] = useState<Product | null>(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState("");
  const [category, setCategory] = useState("T-Shirts");
  const [customerStatuses, setCustomerStatuses] = useState<Record<string, string>>({});

  const startProduct = (product?: Product) => {
    setEditing(product ?? { id: Date.now(), name: "", category: "T-Shirts", price: 0, image: products[0]?.image ?? "", color: "Black", sizes: ["S", "M", "L"], inventory: 0 });
    setProductName(product?.name ?? "");
    setPrice(String(product?.price ?? ""));
    setInventory(String(product?.inventory ?? ""));
    setCategory(product?.category ?? "T-Shirts");
  };

  const saveProduct = () => {
    if (!editing || !productName || !price) return;
    const next = { ...editing, name: productName, price: Number(price), inventory: Number(inventory), category };
    setProducts((current) => current.some((product) => product.id === next.id) ? current.map((product) => product.id === next.id ? next : product) : [next, ...current]);
    setEditing(null);
  };

  const revenue = orders.reduce((total, order) => total + order.total, 0);
  const lowStock = products.filter((product) => product.inventory < 15).length;

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/45">Operations / Kasi Vibes</p><h2 className="font-display mt-2 text-5xl font-black uppercase tracking-[-0.055em]">Admin console</h2></div>
        <p className="text-xs text-black/50">Signed in as <strong className="text-black">{user?.email}</strong></p>
      </div>
      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-black/15 pb-4">
        {(["dashboard", "products", "orders", "customers"] as const).map((item) => (
          <button key={item} onClick={() => setSection(item)} className={`whitespace-nowrap px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] ${section === item ? "bg-black text-white" : "border border-black/15"}`}>{item}</button>
        ))}
      </div>

      {section === "dashboard" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[["Revenue", formatRand(revenue)], ["Orders", String(orders.length)], ["Products", String(products.length)], ["Low stock", String(lowStock)]].map(([label, value]) => (
              <div key={label} className="border border-black/15 p-6"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/45">{label}</p><p className="font-display mt-4 text-4xl font-black">{value}</p></div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="border border-black/15 p-6">
              <h3 className="font-display text-xl font-bold uppercase">Inventory health</h3>
              <div className="mt-6 space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id}>
                    <div className="mb-2 flex justify-between text-xs"><span>{product.name}</span><strong>{product.inventory} units</strong></div>
                    <div className="h-1.5 bg-black/10"><div className={`h-full ${product.inventory < 15 ? "bg-[#e54d2e]" : "bg-black"}`} style={{ width: `${Math.min(product.inventory, 100)}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-black/15 p-6">
              <h3 className="font-display text-xl font-bold uppercase">Recent orders</h3>
              <div className="mt-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between border-b border-black/10 py-4 text-sm">
                    <div><strong>{order.id}</strong><p className="text-xs text-black/45">{order.customer}</p></div>
                    <div className="text-right"><strong>{formatRand(order.total)}</strong><p className="text-[10px] uppercase text-black/45">{order.status}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {section === "products" && (
        <div>
          <div className="mb-5 flex items-center justify-between"><p className="text-sm text-black/50">{products.length} products in catalog</p><button onClick={() => startProduct()} className="bg-[#d8ff3e] px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em]">+ Add product</button></div>
          <div className="overflow-x-auto border border-black/15">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-black/15 bg-black/[0.03] text-[10px] uppercase tracking-[0.15em] text-black/45"><tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Inventory</th><th className="pr-4 text-right">Actions</th></tr></thead>
              <tbody>{products.map((product) => <tr key={product.id} className="border-b border-black/10 text-sm last:border-0"><td className="p-4"><div className="flex items-center gap-3"><img src={product.image} alt="" className="h-12 w-10 object-cover" /><strong>{product.name}</strong></div></td><td>{product.category}</td><td>{formatRand(product.price)}</td><td><span className={product.inventory < 15 ? "font-bold text-[#c43d22]" : ""}>{product.inventory} units</span></td><td className="pr-4 text-right"><button onClick={() => startProduct(product)} className="mr-4 text-[10px] font-bold uppercase underline">Edit</button><button onClick={() => setProducts((current) => current.filter((item) => item.id !== product.id))} className="text-[10px] font-bold uppercase text-[#c43d22] underline">Delete</button></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {section === "orders" && (
        <div className="overflow-x-auto border border-black/15"><table className="w-full min-w-[760px] text-left"><thead className="border-b border-black/15 bg-black/[0.03] text-[10px] uppercase tracking-[0.15em] text-black/45"><tr><th className="p-4">Order</th><th>Customer</th><th>Total</th><th>Date</th><th className="pr-4">Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b border-black/10 text-sm last:border-0"><td className="p-4 font-bold">{order.id}</td><td>{order.customer}</td><td>{formatRand(order.total)}</td><td>{order.date}</td><td className="pr-4"><select value={order.status} onChange={(event) => setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: event.target.value as Order["status"] } : item))} className="border border-black/20 bg-transparent px-3 py-2 text-xs outline-none"><option>Processing</option><option>Packed</option><option>Shipped</option><option>Delivered</option></select></td></tr>)}</tbody></table></div>
      )}

      {section === "customers" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{seededCustomers.map((customer) => <div key={customer.email} className="border border-black/15 p-6"><div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-black font-display text-sm font-bold text-white">{customer.name.split(" ").map((part) => part[0]).join("")}</span><div><p className="font-bold">{customer.name}</p><p className="text-xs text-black/45">{customer.email}</p></div></div><div className="mt-6 grid grid-cols-2 border-y border-black/10 py-4 text-sm"><div><p className="text-[10px] uppercase text-black/45">Orders</p><strong>{customer.orders}</strong></div><div><p className="text-[10px] uppercase text-black/45">Spent</p><strong>{formatRand(customer.spent)}</strong></div></div><select value={customerStatuses[customer.email] ?? customer.status} onChange={(event) => setCustomerStatuses({ ...customerStatuses, [customer.email]: event.target.value })} className="mt-4 w-full border border-black/20 bg-transparent px-3 py-2 text-xs"><option>Active</option><option>VIP</option><option>Suspended</option></select></div>)}</div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-5" onMouseDown={() => setEditing(null)}>
          <div className="w-full max-w-lg bg-[#f2f1ed] p-7" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="font-display text-2xl font-bold uppercase">{products.some((product) => product.id === editing.id) ? "Update product" : "Add product"}</h3><button onClick={() => setEditing(null)} className="text-xl">×</button></div>
            <div className="mt-6 space-y-4"><Field label="Product name" value={productName} onChange={setProductName} /><Field label="Price (R)" type="number" value={price} onChange={setPrice} /><Field label="Inventory units" type="number" value={inventory} onChange={setInventory} /><label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-black/55">Category</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm"><option>T-Shirts</option><option>Outerwear</option><option>Sets</option><option>Accessories</option></select></label></div>
            <button onClick={saveProduct} className="mt-6 w-full bg-black py-4 text-xs font-bold uppercase tracking-[0.15em] text-white">Save product</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ControlCenter(props: Props) {
  const [mode, setMode] = useState(props.mode);
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#f2f1ed]">
      <header className="sticky top-0 z-10 border-b border-black/10 bg-[#f2f1ed]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <p className="font-display text-2xl font-black tracking-[-0.08em]">Kasi Vibes</p>
          <div className="flex items-center gap-3">
            {props.user?.role === "admin" && <button onClick={() => setMode(mode === "admin" ? "account" : "admin")} className="hidden border border-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-wider sm:block">{mode === "admin" ? "Customer view" : "Admin console"}</button>}
            <button onClick={props.onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xl text-white" aria-label="Close">×</button>
          </div>
        </div>
      </header>
      <div className="px-5 py-10 md:px-10 md:py-14">
        {mode === "account" ? (
          <AccountView user={props.user} setUser={props.setUser} orders={props.orders} openAdmin={() => setMode("admin")} />
        ) : props.user?.role === "admin" ? (
          <AdminView products={props.products} setProducts={props.setProducts} orders={props.orders} setOrders={props.setOrders} user={props.user} />
        ) : (
          <div className="mx-auto max-w-lg py-24 text-center"><h2 className="font-display text-4xl font-black uppercase">Administrator access required</h2><p className="mt-4 text-sm text-black/50">Sign in with the demo administrator account from the account screen.</p><button onClick={() => setMode("account")} className="mt-8 bg-black px-7 py-4 text-xs font-bold uppercase tracking-wider text-white">Go to sign in</button></div>
        )}
      </div>
    </div>
  );
}
