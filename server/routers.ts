import { nanoid } from "nanoid";
import { z } from "zod";
import {
  getWaitlistByEmail,
  getWaitlistByReferralCode,
  getWaitlistCount,
  getReferralCount,
  getWaitlistRank,
  insertWaitlistEntry,
} from "./db";
import { buildWelcomeEmailHtml, sendEmail } from "./email";
import { notifyOwner } from "./_core/notification";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  waitlist: router({
    /**
     * 대기자 수 조회 (공개)
     */
    count: publicProcedure.query(async () => {
      const count = await getWaitlistCount();
      return { count };
    }),

    /**
     * 이메일로 대기자 정보 조회 (추천 코드, 순위 등)
     */
    getByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        const entry = await getWaitlistByEmail(input.email);
        if (!entry) return null;
        const rank = await getWaitlistRank(entry.id);
        const referralCount = await getReferralCount(entry.referralCode);
        return { ...entry, rank, referralCount };
      }),

    /**
     * 대기자 등록
     */
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email("올바른 이메일 주소를 입력해주세요."),
          referredBy: z.string().optional(),
          origin: z.string().url(),
        })
      )
      .mutation(async ({ input }) => {
        // 중복 체크
        const existing = await getWaitlistByEmail(input.email);
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "이미 등록된 이메일 주소입니다.",
          });
        }

        // 추천인 코드 유효성 검사
        let validReferredBy: string | undefined;
        if (input.referredBy) {
          const referrer = await getWaitlistByReferralCode(input.referredBy);
          if (referrer) {
            validReferredBy = input.referredBy;
          }
        }

        // 고유 추천 코드 생성 (8자)
        const referralCode = nanoid(8);

        // DB 저장
        await insertWaitlistEntry({
          email: input.email,
          referralCode,
          referredBy: validReferredBy ?? null,
        });

        // 등록된 항목 조회 (순위 포함)
        const entry = await getWaitlistByEmail(input.email);
        const rank = entry ? await getWaitlistRank(entry.id) : 0;
        const totalCount = await getWaitlistCount();

        // 환영 이메일 발송 (비동기, 실패해도 등록은 성공)
        const welcomeHtml = buildWelcomeEmailHtml(input.email, referralCode, input.origin);
        sendEmail({
          to: input.email,
          subject: "소마다이어리 사전 등록 완료 🎉 — 추천 링크를 확인하세요",
          html: welcomeHtml,
        }).catch(err => console.warn("[Email] Welcome email failed:", err));

        // 오너 알림
        notifyOwner({
          title: "새 대기자 등록",
          content: `${input.email}이 대기자 명단에 등록되었습니다. 현재 총 ${totalCount}명이 등록되어 있습니다.${validReferredBy ? ` (추천인: ${validReferredBy})` : ""}`,
        }).catch(err => console.warn("[Notify] Owner notification failed:", err));

        return {
          success: true,
          referralCode,
          rank,
          totalCount,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
