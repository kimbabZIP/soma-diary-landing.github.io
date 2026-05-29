/**
 * Email sending helper using Manus built-in LLM API (no external SMTP required).
 * We use the built-in notification channel for owner alerts,
 * and a simple fetch-based approach for user emails via the Forge API.
 */

import { ENV } from "./_core/env";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send a transactional email via Manus Forge built-in email API.
 * Falls back gracefully if the service is unavailable.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  try {
    const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
    const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

    if (!apiUrl || !apiKey) {
      console.warn("[Email] Forge API credentials not available, skipping email send");
      return false;
    }

    const response = await fetch(`${apiUrl}/v1/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.warn("[Email] Failed to send email:", response.status, text);
      return false;
    }

    console.log("[Email] Sent successfully to:", opts.to);
    return true;
  } catch (err) {
    console.warn("[Email] Error sending email:", err);
    return false;
  }
}

export function buildWelcomeEmailHtml(email: string, referralCode: string, origin: string): string {
  const referralUrl = `${origin}?ref=${referralCode}`;
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>소마다이어리 사전 등록 완료</title>
</head>
<body style="margin:0;padding:0;background:#f8faf9;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6ee7b7 0%,#3b82f6 100%);padding:40px 48px 32px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.5px;">소마다이어리</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.85);margin-top:6px;">SomaDiary</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <h2 style="margin:0 0 12px;font-size:22px;color:#1a2e2a;font-weight:700;">사전 등록을 완료했어요 🎉</h2>
              <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.7;">
                안녕하세요! <strong>${email}</strong>으로 소마다이어리 대기자 명단에 등록되었습니다.<br/>
                익명으로 감정을 나누고, 비슷한 마음을 가진 누군가로부터 위로를 받는 공간 — 곧 만나요.
              </p>

              <!-- Referral Box -->
              <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:14px;padding:24px 28px;margin-bottom:28px;">
                <div style="font-size:13px;color:#16a34a;font-weight:600;margin-bottom:8px;">✨ 나만의 추천 링크</div>
                <div style="font-size:13px;color:#4b5563;margin-bottom:14px;line-height:1.6;">
                  친구에게 공유하면 대기 순번이 올라가요.<br/>추천인 1명당 순번이 앞당겨집니다.
                </div>
                <div style="background:#fff;border:1px solid #d1fae5;border-radius:10px;padding:12px 16px;font-size:13px;color:#065f46;font-family:monospace;word-break:break-all;">
                  ${referralUrl}
                </div>
                <a href="${referralUrl}" style="display:inline-block;margin-top:14px;background:#10b981;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 22px;border-radius:8px;">
                  링크 공유하기 →
                </a>
              </div>

              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
                출시 소식과 얼리 어답터 혜택은 이 이메일로 가장 먼저 전달드립니다.<br/>
                궁금한 점이 있으시면 언제든지 연락해 주세요.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 48px;border-top:1px solid #f3f4f6;text-align:center;">
              <div style="font-size:12px;color:#9ca3af;">
                © 2026 IDLE Team · 소마다이어리<br/>
                본 메일은 사전 등록 시 자동으로 발송됩니다.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
