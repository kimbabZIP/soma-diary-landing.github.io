import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

/**
 * waitlist 기능은 구글 폼으로 이전되어 서버 라우터가 제거되었습니다.
 * 이 파일은 auth 라우터가 여전히 정상 동작하는지 확인합니다.
 */

function createPublicContext(): TrpcContext {
  const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as unknown as TrpcContext["res"],
  };
}

describe("auth router (waitlist removed — google form integration)", () => {
  it("auth.me returns null for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("waitlist router no longer exists on appRouter", () => {
    // @ts-expect-error — waitlist should not exist after removal
    expect((appRouter as unknown as Record<string, unknown>)._def?.procedures?.["waitlist.register"]).toBeUndefined();
  });
});
