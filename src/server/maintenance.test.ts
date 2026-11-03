import { describe, expect, it } from "vitest";
import { handleMaintenance } from "./maintenance.ts";

const TOKEN = "secret";
const on = async () => true;
const off = async () => false;
const req = (path: string, cookie?: string) =>
  new Request(`https://cuccasa.com${path}`, cookie ? { headers: { cookie } } : {});

describe("handleMaintenance", () => {
  it("lets everyone through when off", async () => {
    expect(await handleMaintenance(req("/"), TOKEN, off)).toBeNull();
  });

  it("serves a 503 page when on", async () => {
    const response = await handleMaintenance(req("/portfolio"), TOKEN, on);
    expect(response?.status).toBe(503);
    expect(response?.headers.get("Retry-After")).toBe("3600");
  });

  it("lets the preview cookie through when on", async () => {
    expect(await handleMaintenance(req("/", `a=1; apercu=${TOKEN}`), TOKEN, on)).toBeNull();
  });

  it("rejects a wrong cookie", async () => {
    expect((await handleMaintenance(req("/", "apercu=nope"), TOKEN, on))?.status).toBe(503);
  });

  it("ignores cookies when no token is configured", async () => {
    expect((await handleMaintenance(req("/", "apercu="), undefined, on))?.status).toBe(503);
  });

  it("sets the cookie from the link and strips the param", async () => {
    const response = await handleMaintenance(req(`/contact?x=1&apercu=${TOKEN}`), TOKEN, on);
    expect(response?.status).toBe(302);
    expect(response?.headers.get("Location")).toBe("/contact?x=1");
    expect(response?.headers.get("Set-Cookie")).toContain(`apercu=${TOKEN};`);
  });

  it("clears the cookie with any other value", async () => {
    const response = await handleMaintenance(req("/?apercu=0"), TOKEN, on);
    expect(response?.headers.get("Set-Cookie")).toContain("Max-Age=0");
  });
});
