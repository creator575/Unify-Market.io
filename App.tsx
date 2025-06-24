import { supabase } from "./supabase";
import React, { useEffect, useState } from "react";
import "./App.css";
type Product = {
  id?: string;
  name: string;
  detail: string;
  image: string;
  whatsapp: string;
};

export default function App() {
  const [step, setStep] = useState<"signup" | "login" | "home" | "products">(
    "signup"
  );
  const [userInfo, setUserInfo] = useState({
    name: "",
    password: "",
    code: "",
  });
  const [isHarresh, setIsHarresh] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    detail: "",
    image: "",
    whatsapp: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (data) setProducts(data);
    else console.error("❗ Fetch error:", error);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    if (file) {
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.detail ||
      !newProduct.image ||
      !newProduct.whatsapp
    ) {
      setError("❗ Fill in all fields.");
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select();
    if (data) {
      setProducts([...products, ...data]);
      setNewProduct({ name: "", detail: "", image: "", whatsapp: "" });
      setError("");
    } else {
      console.error("❗ Failed to add:", error);
      setError("❗ Failed to add product.");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("unify-user", JSON.stringify(userInfo));
    alert("Signed up!");
    setStep("login");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = localStorage.getItem("unify-user");
    if (!saved) return alert("No signup found.");
    const savedUser = JSON.parse(saved);
    if (
      savedUser.name === userInfo.name &&
      savedUser.password === userInfo.password
    ) {
      if (userInfo.code === "Harresh@26") setIsHarresh(true);
      setStep("home");
    } else alert("Invalid login");
  };

  return (
    <div className="App">
      {step === "signup" && (
        <form onSubmit={handleSignup}>
          <h1>Sign Up</h1>
          <input
            placeholder="Name"
            required
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          />
          <input
            placeholder="Password"
            required
            type="password"
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
          <button type="submit">Sign Up</button>
          <p>
            Already have an account?{" "}
            <button type="button" onClick={() => setStep("login")}>
              Login
            </button>
          </p>
        </form>
      )}

      {step === "login" && (
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <input
            placeholder="Name"
            required
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          />
          <input
            placeholder="Password"
            required
            type="password"
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
          <input
            placeholder="Code (optional)"
            value={userInfo.code}
            onChange={(e) => setUserInfo({ ...userInfo, code: e.target.value })}
          />
          <button type="submit">Login</button>
          <p>
            Don’t have an account?{" "}
            <button type="button" onClick={() => setStep("signup")}>
              Sign Up
            </button>
          </p>
        </form>
      )}

      {step === "home" && (
        <div>
          <h2>Welcome, {userInfo.name}</h2>
          <button onClick={() => setStep("products")}>🛒 View Products</button>
          {isHarresh && (
            <div>
              <h3>Add Product</h3>
              <input
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <input
                placeholder="Detail"
                value={newProduct.detail}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, detail: e.target.value })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <input
                placeholder="WhatsApp"
                value={newProduct.whatsapp}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, whatsapp: e.target.value })
                }
              />
              <button onClick={addProduct}>Add</button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          )}
          <button onClick={() => setStep("login")}>Logout</button>
        </div>
      )}

      {step === "products" && (
        <div>
          <button onClick={() => setStep("home")}>← Back</button>
          <h2>🛒 Products</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {products.map((p, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid gray",
                  padding: "10px",
                  width: "200px",
                }}
              >
                <img src={p.image} alt={p.name} width="100%" />
                <h4>{p.name}</h4>
                <p>{p.detail}</p>
                <a
                  href={`https://wa.me/${p.whatsapp.replace(/\s+/g, "")}`}
                  target="_blank"
                >
                  Buy
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
