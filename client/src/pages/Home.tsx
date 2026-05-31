import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Heart,
  Sparkles,
  BookOpen,
  Send,
  MessageCircleHeart,
  Copy,
  Check,
  Twitter,
  Instagram,
  Github,
  ArrowRight,
  Feather,
} from "lucide-react";

// ── Google Form URL ───────────────────────────────────────────────────────────
const GOOGLE_FORM_BASE =
  "https://docs.google.com/forms/d/e/1FAIpQLScla7Lqeh_ULXdNmHfBLy_BhiKXyID19096K-j4ei54N-5f-w/formResponse";
const EMAIL_FIELD = "entry.1346893337";

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm border-b-2 border-black" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sketch-border flex items-center justify-center bg-black shrink-0">
            <Feather className="w-4 h-4 text-white" />
          </div>
          <span
            className="font-black text-base md:text-lg text-black tracking-tight"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            소마다이어리
          </span>
        </div>
        <a href="#register" className="sketch-btn-outline text-xs md:text-sm px-3 md:px-4 py-1.5 inline-block whitespace-nowrap">
          사전 등록 및 클로즈 베타 신청 →
        </a>
      </div>
    </nav>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ onRegistered }: { onRegistered: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setIsSubmitting(true);

    try {
      // 구글 폼에 no-cors 모드로 제출 (응답 본문은 읽을 수 없지만 전송은 됨)
      await fetch(GOOGLE_FORM_BASE, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ [EMAIL_FIELD]: trimmed }).toString(),
      });
    } catch {
      // no-cors 특성상 에러가 발생해도 실제로는 전송된 경우가 많으므로 무시
    } finally {
      setIsSubmitting(false);
      onRegistered(trimmed);
      setEmail("");
    }
  };

  return (
    <section
      id="register"
      className="relative min-h-screen flex items-center dot-grid-bg pt-16 overflow-hidden"
    >
      {/* Decorative scribbles */}
      <div className="absolute top-24 left-8 opacity-10 pointer-events-none select-none text-7xl font-black text-black rotate-[-8deg]">✦</div>
      <div className="absolute top-32 right-12 opacity-10 pointer-events-none select-none text-5xl font-black text-black rotate-[12deg]">◇</div>
      <div className="absolute bottom-24 left-16 opacity-10 pointer-events-none select-none text-4xl font-black text-black rotate-[-5deg]">○</div>
      <div className="absolute bottom-20 right-8 opacity-10 pointer-events-none select-none text-6xl font-black text-black rotate-[7deg]">△</div>

      <div className="container relative">
        <div className="py-15 flex flex-col gap-8 max-w-5xl">
          <div className="animate-fade-in-up">
            <span className="sketch-tag inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              얼리 어답터 모집 중 (선착순 100명)
            </span>
          </div>

          {/* Headline + Cat side by side */}
          <div className="animate-fade-in-up-delay-1 flex flex-col md:flex-row items-center md:items-start justify-between gap-12 md:gap-6 w-full">
            <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[1.1] tracking-tight shrink-0"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              말 못했던
              <br />
              이야기를
              <br />
              <span
                className="relative inline-block"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "wavy",
                  textUnderlineOffset: "6px",
                  textDecorationColor: "oklch(0.50 0 0)",
                }}
              >
                익명으로
              </span>
              <br />
              꺼내보세요
            </h1>
            <div className="animate-fade-in-up-delay-1">
            <p className="text-base text-gray-600 leading-relaxed max-w-sm">
              친구에게도, 가족에게도 말하기 어려웠던 고민들.
              <br className="hidden md:block" />
              소마다이어리에서 익명으로 공유하고,
              <br className="hidden md:block" />
              비슷한 마음을 가진 누군가로부터 위로를 받으세요.
            </p>
          </div>
            </div>
            
            <div className="flex-1 flex justify-center items-center w-full md:w-auto mt-4 md:mt-0 md:ml-12">
              <div className="animate-float">
              <PhoneMockup imageSrc="/screen-main_78f8190e.png" imageAlt="메인 화면" />
              </div>
            </div>
          </div>

          {/* Sub copy */}
          

          {/* Email Form */}
          <div className="animate-fade-in-up-delay-2 w-full flex flex-col items-center md:items-start mt-4 md:mt-0">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="sketch-input flex-1 h-12 px-4 text-sm w-full"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="sketch-btn h-12 px-6 text-sm whitespace-nowrap flex items-center gap-2 justify-center w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    등록 중...
                  </>
                ) : (
                  <>
                    사전 등록하기
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            <p className="mt-2.5 text-xs text-gray-500 text-center md:text-left">
              스팸 없음 · 언제든 구독 취소 가능 · 출시 소식을 가장 먼저 받아보세요
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Registration Success ──────────────────────────────────────────────────────
function SuccessSection({
  email,
  onReset,
}: {
  email: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareText = `소마다이어리 얼리 어답터로 사전 등록했어요! 익명으로 감정을 나누는 새로운 공간 ✍️ https://soma-diary-landinggithubio.vercel.app/`;

  const handleCopy = () => {
    navigator.clipboard.writeText("https://soma-diary-landinggithubio.vercel.app/");
    setCopied(true);
    toast.success("링크가 복사되었습니다!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center dot-grid-bg pt-16 overflow-hidden">
      <div className="absolute top-24 left-8 opacity-10 pointer-events-none select-none text-7xl font-black text-black rotate-[-8deg]">✦</div>
      <div className="absolute bottom-20 right-8 opacity-10 pointer-events-none select-none text-6xl font-black text-black rotate-[7deg]">△</div>

      <div className="container py-20 max-w-2xl">
        <div className="flex flex-col gap-7">
          {/* Success mark */}
          <div className="animate-fade-in-up">
            <div className="w-16 h-16 sketch-border flex items-center justify-center bg-black animate-float">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </div>

          <div className="animate-fade-in-up-delay-1">
            <h2
              className="text-4xl font-black text-black tracking-tight mb-3"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              등록 완료! 🎉
            </h2>
            <p className="text-gray-600 leading-relaxed">
              <strong className="text-black">{email}</strong>으로 사전 등록이 완료되었습니다.
              <br />
              출시 소식을 가장 먼저 알려드릴게요.
            </p>
          </div>

          {/* Share card */}
          <div className="animate-fade-in-up-delay-2 sketch-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5" />
              <h3 className="font-black text-black">친구에게도 알려주세요</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              소마다이어리를 친구와 함께 시작해보세요.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 sketch-border bg-gray-50 px-3 py-2.5 text-xs font-mono text-gray-700 truncate">
                https://soma-diary-landinggithubio.vercel.app/
              </div>
              <button
                onClick={handleCopy}
                className="sketch-btn-outline px-3 py-2.5 shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="animate-fade-in-up-delay-3 flex flex-wrap gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sketch-btn-outline flex items-center gap-2 px-4 py-2.5 text-sm"
            >
              <Twitter className="w-4 h-4" />
              X에 공유
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="sketch-btn-outline flex items-center gap-2 px-4 py-2.5 text-sm"
            >
              <Instagram className="w-4 h-4" />
              인스타그램
            </a>
          </div>

          <button
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-black transition-colors underline underline-offset-4 text-left w-fit"
          >
            다른 이메일로 등록하기
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Benefits Grid ─────────────────────────────────────────────────────────────
function BenefitsSection() {
  const benefits = [
    {
      icon: <ShieldCheck className="w-8 h-8 stroke-[1.5]" />,
      number: "01",
      title: "익명성 보장",
      description:
        "누가 보냈는지, 누가 받았는지 알 수 없습니다. 완벽한 익명성 속에서 진짜 나의 이야기를 꺼낼 수 있어요.",
      tag: "완전한 익명 보장",
    },
    {
      icon: <Heart className="w-8 h-8 stroke-[1.5]" />,
      number: "02",
      title: "감정 공유",
      description:
        "비슷한 감정과 상황을 가진 사람에게 일기가 전달됩니다. AI가 공감 가능한 상대를 찾아 연결해 드려요.",
      tag: "AI 감정 매칭",
    },
    {
      icon: <Sparkles className="w-8 h-8 stroke-[1.5]" />,
      number: "03",
      title: "얼리 어답터 혜택",
      description:
        "선착순 100명 안에 들면 클로즈 베타 참여권이 주어지며, 한정판 아이템 증정 및 출시 후 선물 꾸러미를 배송해드립니다.",
      tag: "클로즈 베타 & 선물 증정",
    },
  ];

  return (
    <section id="benefits" className="py-24 bg-white border-t-2 border-black">
      <div className="container">
        <div className="mb-14">
          <span className="sketch-tag inline-flex items-center gap-1.5 mb-4">
            ✦ 지금 가입해야 하는 이유
          </span>
          <h2
            className="text-3xl md:text-4xl font-black text-black tracking-tight"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            얼리 어답터만의
            <br />
            특별한 경험
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="sketch-card p-8 flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 sketch-border flex items-center justify-center bg-black text-white">
                  {b.icon}
                </div>
                <span className="text-5xl font-black text-gray-100 leading-none select-none">
                  {b.number}
                </span>
              </div>
              <div>
                <span className="sketch-tag mb-3 inline-block">{b.tag}</span>
                <h3
                  className="text-xl font-black text-black mb-2"
                  style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  {b.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features Section ──────────────────────────────────────────────────────────
const features = [
  {
    icon: <BookOpen className="w-5 h-5 stroke-[1.5]" />,
    title: "메인 화면",
    tag: "홈 & 고양이 대화",
    description:
      "앱을 열면 고양이 마스코트가 오늘 하루를 물어봐요. 일기 쓰기, 상자(받은 일기), 상점에 바로 접근할 수 있어요.",
    detail:
      "고양이와 대화하기 버튼으로 AI 대화 모드를 시작하거나, 일기 쓰기 버튼으로 바로 작성 화면으로 이동할 수 있습니다.",
    imageSrc: "/screen-main_78f8190e.png",
    imageAlt: "메인 화면",
  },
  {
    icon: <BookOpen className="w-5 h-5 stroke-[1.5]" />,
    title: "혼자 쓰기",
    tag: "혼자 쓰기 모드",
    description:
      "조용히 혼자만의 공간에서 일기를 씁니다. 작성이 끝나면 익명으로 바다에 띄워 보낼 수 있어요.",
    detail:
      "하단의 '내 일기를 익명으로 바다에 띄워 보내기' 옵션을 체크하면 비슷한 감정의 누군가에게 전달됩니다.",
    imageSrc: "/screen-solo_9268035d.png",
    imageAlt: "혼자 쓰기 화면",
  },
  {
    icon: <Send className="w-5 h-5 stroke-[1.5]" />,
    title: "함께 쓰기",
    tag: "AI 고양이와 대화",
    description:
      "고양이 마스코트가 먼저 말을 건네며 오늘 하루를 이끌어냅니다. 대화하듯 자연스럽게 일기를 완성해요.",
    detail:
      "AI가 감정을 파악하며 적절한 질문을 이어갑니다. 대화가 끝나면 자동으로 일기 형태로 정리되어 저장됩니다.",
    imageSrc: "/screen-together_3c1400f7.png",
    imageAlt: "함께 쓰기 화면",
  },
  {
    icon: <MessageCircleHeart className="w-5 h-5 stroke-[1.5]" />,
    title: "받은 일기",
    tag: "익명 답장 받기",
    description:
      "누군가 바다에 띄워 보낸 일기가 상자에 도착합니다. 읽고 위로의 한 마디를 남길 수 있어요.",
    detail:
      "답장은 1회만 가능하며 이후 대화로 이어지지 않습니다. 발신자는 완전히 익명으로 보호됩니다.",
    imageSrc: "/screen-reply_566ee307.jpg",
    imageAlt: "받은 일기 화면",
  },
];

function PhoneMockup({ imageSrc, imageAlt }: { imageSrc: string; imageAlt: string }) {
  return (
    <div className="phone-mockup w-52 h-[420px] mx-auto flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full flex-1 object-cover object-top"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 paper-bg border-t-2 border-black">
      <div className="container">
        <div className="mb-16">
          <span className="sketch-tag inline-flex items-center gap-1.5 mb-4">
            <Feather className="w-3.5 h-3.5" />
            핵심 기능
          </span>
          <h2
            className="text-4xl font-black text-black tracking-tight"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            소마다이어리가
            <br />
            특별한 이유
          </h2>
          <p className="text-gray-600 mt-3 max-w-md leading-relaxed">
            SNS의 과시가 아닌, 진짜 나의 감정을 안전하게 표현하는 공간입니다.
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {features.map((f, i) => {
            const phoneLeft = i % 2 === 0;
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {phoneLeft ? (
                  <>
                    <div className="flex justify-center">
                      <PhoneMockup imageSrc={f.imageSrc} imageAlt={f.imageAlt} />
                    </div>
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sketch-border flex items-center justify-center bg-black text-white">
                          {f.icon}
                        </div>
                        <span className="sketch-tag">{f.tag}</span>
                      </div>
                      <h3
                        className="text-2xl font-black text-black"
                        style={{ fontFamily: "'Caveat', cursive" }}
                      >
                        {f.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{f.description}</p>
                      <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-gray-300 pl-4">
                        {f.detail}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-5 order-2 md:order-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sketch-border flex items-center justify-center bg-black text-white">
                          {f.icon}
                        </div>
                        <span className="sketch-tag">{f.tag}</span>
                      </div>
                      <h3
                        className="text-2xl font-black text-black"
                        style={{ fontFamily: "'Caveat', cursive" }}
                      >
                        {f.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{f.description}</p>
                      <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-gray-300 pl-4">
                        {f.detail}
                      </p>
                    </div>
                    <div className="flex justify-center order-1 md:order-2">
                      <PhoneMockup imageSrc={f.imageSrc} imageAlt={f.imageAlt} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ───────────────────────────────────────────────────────────────
function CTASection({ onScrollToRegister }: { onScrollToRegister: () => void }) {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-7">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <Feather className="w-8 h-8 text-white" />
          </div>
          <h2
            className="text-4xl font-black tracking-tight"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            마음의 짐을
            <br />
            내려놓을 준비가 되셨나요?
          </h2>
          <p className="text-gray-400 leading-relaxed">
            소마다이어리가 출시되면 가장 먼저 알려드릴게요.
            <br />
            지금 등록하고 선착순 100명에게 주어지는 클로즈 베타 참여권 등 얼리 어답터 혜택을 받으세요.
          </p>
          <button
            onClick={onScrollToRegister}
            className="border-2 border-white text-white font-black px-8 py-3 flex items-center gap-2 hover:bg-white hover:text-black transition-colors duration-200"
          >
            지금 사전 등록하기
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t-2 border-black py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sketch-border flex items-center justify-center bg-black">
                <Feather className="w-4 h-4 text-white" />
              </div>
              <span
                className="font-black text-lg text-black"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                소마다이어리
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              익명으로 감정을 나누고,
              <br />
              비슷한 마음을 가진 누군가로부터
              <br />
              위로를 받는 공간.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-black text-black mb-3">서비스</h4>
              <ul className="flex flex-col gap-2 text-gray-600">
                <li>
                  <a href="#benefits" className="hover:text-black transition-colors">
                    혜택 안내
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-black transition-colors">
                    핵심 기능
                  </a>
                </li>
                <li>
                  <a href="#register" className="hover:text-black transition-colors">
                    사전 등록
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-black mb-3">팀 IDLE</h4>
              <ul className="flex flex-col gap-2 text-gray-600">
                <li>권기혁 · 박윤수 · 정우찬</li>
                <li>
                  <a
                    href="mailto:idle.soma@gmail.com"
                    className="hover:text-black transition-colors"
                  >
                    idle.soma@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h4 className="font-black text-black text-sm">소셜 미디어</h4>
            <div className="flex gap-3">
              {[
                {
                  href: "https://x.com/soma_diary_serv",
                  icon: <Twitter className="w-4 h-4" />,
                  label: "X",
                },
                {
                  href: "https://www.instagram.com/soma_diary_serv/",
                  icon: <Instagram className="w-4 h-4" />,
                  label: "Instagram",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 sketch-border-sm flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t-2 border-black pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© 2026 IDLE Team. All rights reserved.</p>
          <p>2026 AI·SW 마에스트로 제17기 프로젝트</p>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleRegistered = (email: string) => {
    setRegisteredEmail(email);
    toast.success("사전 등록이 완료되었습니다! 🎉");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Navbar />

      {registeredEmail ? (
        <SuccessSection email={registeredEmail} onReset={() => setRegisteredEmail(null)} />
      ) : (
        <HeroSection onRegistered={handleRegistered} />
      )}

      <BenefitsSection />
      <FeaturesSection />
      <CTASection onScrollToRegister={scrollToRegister} />
      <Footer />
    </div>
  );
}
