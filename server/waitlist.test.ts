import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context";

// Mock DB helpers
vi.mock("./db", () => ({
  getWaitlistByEmail: vi.fn(),
  getWaitlistByReferralCode: vi.fn(),
  getWaitlistCount: vi.fn(),
  getReferralCount: vi.fn(),
  getWaitlistRank: vi.fn(),
  insertWaitlistEntry: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

// Mock email
vi.mock("./email", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
  buildWelcomeEmailHtml: vi.fn().mockReturnValue("<html>welcome</html>"),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import * as db from "./db";
import { appRouter } from "./routers";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("waitlist.count", () => {
  it("returns the current waitlist count", async () => {
    vi.mocked(db.getWaitlistCount).mockResolvedValue(42);
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.waitlist.count();
    expect(result.count).toBe(42);
  });
});

describe("waitlist.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a new email and returns referralCode and rank", async () => {
    vi.mocked(db.getWaitlistByEmail)
      .mockResolvedValueOnce(undefined) // duplicate check → not found
      .mockResolvedValueOnce({          // after insert → found
        id: 5,
        email: "test@example.com",
        referralCode: "abc12345",
        referredBy: null,
        createdAt: new Date(),
      });
    vi.mocked(db.getWaitlistByReferralCode).mockResolvedValue(undefined);
    vi.mocked(db.insertWaitlistEntry).mockResolvedValue(undefined);
    vi.mocked(db.getWaitlistRank).mockResolvedValue(5);
    vi.mocked(db.getWaitlistCount).mockResolvedValue(10);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.waitlist.register({
      email: "test@example.com",
      origin: "https://example.com",
    });

    expect(result.success).toBe(true);
    expect(typeof result.referralCode).toBe("string");
    expect(result.rank).toBe(5);
    expect(result.totalCount).toBe(10);
    expect(db.insertWaitlistEntry).toHaveBeenCalledOnce();
  });

  it("throws CONFLICT when email already exists", async () => {
    vi.mocked(db.getWaitlistByEmail).mockResolvedValue({
      id: 1,
      email: "dup@example.com",
      referralCode: "existing1",
      referredBy: null,
      createdAt: new Date(),
    });

    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.waitlist.register({
        email: "dup@example.com",
        origin: "https://example.com",
      })
    ).rejects.toThrow(TRPCError);
  });

  it("accepts a valid referral code", async () => {
    vi.mocked(db.getWaitlistByEmail)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        id: 6,
        email: "new@example.com",
        referralCode: "newcode1",
        referredBy: "refcode1",
        createdAt: new Date(),
      });
    vi.mocked(db.getWaitlistByReferralCode).mockResolvedValue({
      id: 1,
      email: "referrer@example.com",
      referralCode: "refcode1",
      referredBy: null,
      createdAt: new Date(),
    });
    vi.mocked(db.insertWaitlistEntry).mockResolvedValue(undefined);
    vi.mocked(db.getWaitlistRank).mockResolvedValue(6);
    vi.mocked(db.getWaitlistCount).mockResolvedValue(6);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.waitlist.register({
      email: "new@example.com",
      referredBy: "refcode1",
      origin: "https://example.com",
    });

    expect(result.success).toBe(true);
    const insertCall = vi.mocked(db.insertWaitlistEntry).mock.calls[0]?.[0];
    expect(insertCall?.referredBy).toBe("refcode1");
  });

  it("ignores invalid referral code", async () => {
    vi.mocked(db.getWaitlistByEmail)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        id: 7,
        email: "another@example.com",
        referralCode: "anothercd",
        referredBy: null,
        createdAt: new Date(),
      });
    vi.mocked(db.getWaitlistByReferralCode).mockResolvedValue(undefined); // invalid ref
    vi.mocked(db.insertWaitlistEntry).mockResolvedValue(undefined);
    vi.mocked(db.getWaitlistRank).mockResolvedValue(7);
    vi.mocked(db.getWaitlistCount).mockResolvedValue(7);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.waitlist.register({
      email: "another@example.com",
      referredBy: "invalid99",
      origin: "https://example.com",
    });

    expect(result.success).toBe(true);
    const insertCall = vi.mocked(db.insertWaitlistEntry).mock.calls[0]?.[0];
    expect(insertCall?.referredBy).toBeNull();
  });
});

describe("waitlist.getByEmail", () => {
  it("returns null for unregistered email", async () => {
    vi.mocked(db.getWaitlistByEmail).mockResolvedValue(undefined);
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.waitlist.getByEmail({ email: "notfound@example.com" });
    expect(result).toBeNull();
  });

  it("returns entry with rank and referralCount for registered email", async () => {
    vi.mocked(db.getWaitlistByEmail).mockResolvedValue({
      id: 3,
      email: "found@example.com",
      referralCode: "found1234",
      referredBy: null,
      createdAt: new Date(),
    });
    vi.mocked(db.getWaitlistRank).mockResolvedValue(3);
    vi.mocked(db.getReferralCount).mockResolvedValue(2);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.waitlist.getByEmail({ email: "found@example.com" });
    expect(result).not.toBeNull();
    expect(result?.rank).toBe(3);
    expect(result?.referralCount).toBe(2);
  });
});
