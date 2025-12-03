
(async () => {
  try {
    // Try to login with a legacy plaintext user
    console.log("🔐 Testing login with legacy plaintext user 'vivek'...");
    let res = await fetch("http://localhost:5000/customers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "vivek", password: "vivek" }),
    });

    console.log("Login response status:", res.status);
    const body = await res.json();
    console.log("Login response:", body);

    if (res.ok) {
      console.log("✅ Login successful! User migrated to hashed password.");
    } else {
      console.log("❌ Login failed:", body?.msg);
    }

    process.exit(res.ok ? 0 : 1);
  } catch (err) {
    console.error("Test error:", err);
    process.exit(2);
  }
})();
