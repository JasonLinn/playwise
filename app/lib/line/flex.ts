// Webhook 回覆與通知用的訊息（Flex Message / Quick Reply）。
import { CASES, FAQS, SERVICES, SITE_URL, STUDIO, liffUrl } from "./content";
import { FORM_TAGS, summarize, type FormPayload, type FormType } from "./forms";
import type { LineMessage } from "./server";

const BLUE = "#1a73e8";
const TEAL = "#14b8a6";
const INK = "#0f172a";
const MUTED = "#64748b";
const LINE_GREEN = "#06c755";

type Action = Record<string, unknown>;

const uri = (label: string, url: string): Action => ({ type: "uri", label, uri: url });
const postback = (label: string, data: string, displayText?: string): Action => ({
  type: "postback",
  label,
  data,
  ...(displayText ? { displayText } : {}),
});

/** 每則回覆底下的快速選項，讓對話可以一直往下走。 */
export function quickReply(skip: string[] = []) {
  const items: [string, Action][] = [
    ["inquiry", uri("填需求諮詢", liffUrl("/inquiry"))],
    ["services", postback("服務項目", "action=services", "服務項目")],
    ["cases", postback("作品案例", "action=cases", "作品案例")],
    ["price", postback("費用怎麼算", "action=faq&id=price", "費用怎麼算？")],
    ["faq", postback("常見問題", "action=faq", "常見問題")],
    ["handoff", postback("找真人聊", "action=handoff", "我想找真人聊聊")],
  ];
  return {
    items: items
      .filter(([key]) => !skip.includes(key))
      .slice(0, 13)
      .map(([, action]) => ({ type: "action", action })),
  };
}

const text = (t: string, extra: Record<string, unknown> = {}): LineMessage => ({ type: "text", text: t, ...extra });

function button(action: Action, style: "primary" | "secondary" | "link" = "primary", color?: string) {
  return { type: "button", action, style, height: "sm", ...(color ? { color } : style === "primary" ? { color: BLUE } : {}) };
}

function heading(title: string, sub?: string, colors: [string, string] = [BLUE, TEAL]) {
  return {
    type: "box",
    layout: "vertical",
    paddingAll: "20px",
    background: { type: "linearGradient", angle: "135deg", startColor: colors[0], endColor: colors[1] },
    contents: [
      { type: "text", text: `${STUDIO.name} ${STUDIO.nameEn}`, size: "xs", color: "#ffffffcc" },
      { type: "text", text: title, size: "xl", weight: "bold", color: "#ffffff", wrap: true, margin: "sm" },
      ...(sub ? [{ type: "text", text: sub, size: "sm", color: "#ffffffe6", wrap: true, margin: "sm" }] : []),
    ],
  };
}

const flex = (altText: string, contents: unknown, extra: Record<string, unknown> = {}): LineMessage => ({
  type: "flex",
  altText,
  contents,
  ...extra,
});

export function welcome(name?: string): LineMessage[] {
  const hi = name ? `嗨 ${name}，謝謝你加入！` : "嗨，謝謝你加入！";
  return [
    flex(
      `${hi}我們是宜蘭的智遊工作室`,
      {
        type: "bubble",
        header: heading(hi, "我們幫民宿、小店、個人工作者與在地協會，做網站、LINE 服務與自動化流程。"),
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            ...[
              ["🧭", "下方選單可以看服務、作品，或直接填需求"],
              ["📱", "你正在用的選單和表單，就是我們幫客戶做的 LINE 功能"],
              ["💬", "想直接聊，在這裡打字就好，我們會親自回覆"],
            ].map(([icon, t]) => ({
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                { type: "text", text: icon, flex: 0, size: "sm" },
                { type: "text", text: t, size: "sm", color: INK, wrap: true },
              ],
            })),
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            button(uri("3 分鐘填需求諮詢", liffUrl("/inquiry"))),
            button(uri("體驗 LIFF 能做什麼", liffUrl("/demo")), "secondary"),
          ],
        },
      },
      { quickReply: quickReply(["inquiry"]) },
    ),
  ];
}

export function services(): LineMessage[] {
  return [
    flex(
      "智遊工作室的服務項目：品牌網站、LINE 官方帳號與 LIFF、工作流程自動化",
      {
        type: "carousel",
        contents: SERVICES.map((s) => ({
          type: "bubble",
          size: "kilo",
          header: heading(s.title, s.short, [s.hue, s.id === "line" ? TEAL : "#5b9cf6"]),
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              { type: "text", text: s.description, size: "sm", color: MUTED, wrap: true },
              { type: "separator", margin: "md" },
              ...s.items.map((item) => ({
                type: "box",
                layout: "baseline",
                spacing: "sm",
                margin: "sm",
                contents: [
                  { type: "text", text: "✓", flex: 0, size: "sm", color: TEAL, weight: "bold" },
                  { type: "text", text: item, size: "sm", color: INK, wrap: true },
                ],
              })),
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              button(uri("諮詢這項服務", liffUrl("/inquiry", `need=${s.id === "web" ? "website" : s.id === "line" ? "liff" : "automation"}`))),
              button(uri("看完整介紹", liffUrl("/services")), "link"),
            ],
          },
        })),
      },
      { quickReply: quickReply(["services"]) },
    ),
  ];
}

export function cases(): LineMessage[] {
  return [
    flex(
      "已上線的真實案例：宜蘭旅遊通、衿日林民宿、冬山河漫遊護照",
      {
        type: "carousel",
        contents: CASES.map((c) => ({
          type: "bubble",
          size: "kilo",
          hero: {
            type: "image",
            url: `${SITE_URL}${c.image}`,
            size: "full",
            aspectRatio: "3:2",
            aspectMode: "cover",
            action: uri("開啟", c.url),
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              { type: "text", text: c.type, size: "xxs", color: BLUE, weight: "bold" },
              { type: "text", text: c.name, size: "lg", weight: "bold", color: INK },
              { type: "text", text: c.summary, size: "sm", color: MUTED, wrap: true, maxLines: 4 },
              { type: "text", text: `我們做的：${c.did.join("、")}`, size: "xs", color: INK, wrap: true, margin: "md" },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [button(uri("看看這個作品", c.url), "secondary")],
          },
        })),
      },
      { quickReply: quickReply(["cases"]) },
    ),
  ];
}

export function faqMenu(): LineMessage[] {
  return [
    text("想了解哪一題？點下方選項就會回答你 👇", {
      quickReply: {
        items: FAQS.map((f) => ({
          type: "action",
          action: postback(f.q.length > 20 ? `${f.q.slice(0, 19)}…` : f.q, `action=faq&id=${f.id}`, f.q),
        })),
      },
    }),
  ];
}

export function faqAnswer(id: string): LineMessage[] {
  const faq = FAQS.find((f) => f.id === id);
  if (!faq) return faqMenu();
  return [
    flex(
      `${faq.q} ${faq.a}`,
      {
        type: "bubble",
        size: "mega",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            { type: "text", text: "Q", size: "xs", color: BLUE, weight: "bold" },
            { type: "text", text: faq.q, weight: "bold", size: "md", color: INK, wrap: true },
            { type: "text", text: faq.a, size: "sm", color: MUTED, wrap: true },
          ],
        },
        footer: {
          type: "box",
          layout: "horizontal",
          spacing: "sm",
          contents: [
            button(postback("其他問題", "action=faq", "其他常見問題"), "secondary"),
            button(uri("填需求諮詢", liffUrl("/inquiry"))),
          ],
        },
      },
      { quickReply: quickReply(id === "price" ? ["price"] : []) },
    ),
  ];
}

export function contact(): LineMessage[] {
  return [
    flex(`智遊工作室 電話 ${STUDIO.phone}・地址 ${STUDIO.address}`, {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          { type: "text", text: "聯絡智遊工作室", weight: "bold", size: "lg", color: INK },
          ...[
            ["電話", STUDIO.phone],
            ["地址", STUDIO.address],
            ["回覆時間", STUDIO.hours],
          ].map(([k, v]) => ({
            type: "box",
            layout: "baseline",
            spacing: "md",
            contents: [
              { type: "text", text: k, size: "sm", color: MUTED, flex: 2 },
              { type: "text", text: v, size: "sm", color: INK, flex: 5, wrap: true },
            ],
          })),
        ],
      },
      footer: {
        type: "box",
        layout: "horizontal",
        spacing: "sm",
        contents: [button(uri("撥打電話", STUDIO.tel), "secondary"), button(uri("開啟地圖", STUDIO.mapUrl), "secondary")],
      },
    }),
  ];
}

export function handoff(): LineMessage[] {
  return [
    text(
      `好的，已經通知工作室 🙌\n我們會在${STUDIO.hours}親自回覆你，通常${STUDIO.replyPromise}。\n\n可以先在這裡寫下想問的事，或傳截圖、網址給我們，回覆時就能直接接上。`,
      { quickReply: quickReply(["handoff"]) },
    ),
  ];
}

export function handoffNotice(name: string): LineMessage[] {
  return [text(`🙋 ${name} 想找真人聊聊\n請到 LINE 官方帳號聊天室回覆：https://chat.line.biz/`)];
}

const RECEIVED_COPY: Record<FormType, string> = {
  inquiry: "我們會先看過你的狀況，再回覆適合的做法與下一步。",
  booking: "我們確認時間後會在這裡回覆你；如果時段不方便，也會提議其他時間。",
  support: "我們會依急迫度安排處理，有進度會在這裡告訴你。緊急狀況也可以直接打電話。",
};

/** 使用者送出表單後，在聊天室收到的確認。 */
export function formReceived(type: FormType): LineMessage[] {
  return [
    flex(
      `已收到你的${FORM_TAGS[type]}`,
      {
        type: "bubble",
        size: "kilo",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            { type: "text", text: "✅ 已收到", weight: "bold", color: LINE_GREEN, size: "sm" },
            { type: "text", text: `謝謝你的${FORM_TAGS[type]}`, weight: "bold", size: "lg", color: INK, wrap: true },
            { type: "text", text: RECEIVED_COPY[type], size: "sm", color: MUTED, wrap: true },
            { type: "text", text: `回覆時間：${STUDIO.hours}`, size: "xs", color: MUTED, wrap: true },
          ],
        },
      },
      { quickReply: quickReply(["inquiry"]) },
    ),
  ];
}

/** 通知工作室：有新的表單。 */
export function adminNotification(payload: FormPayload, who: { name: string; userId?: string }): LineMessage[] {
  const rows = summarize(payload);
  const color = payload.type === "support" ? "#f97316" : payload.type === "booking" ? TEAL : BLUE;
  return [
    flex(`📥 新的${FORM_TAGS[payload.type]}：${who.name}`, {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: color,
        paddingAll: "16px",
        contents: [
          { type: "text", text: `📥 新的${FORM_TAGS[payload.type]}`, color: "#ffffff", weight: "bold", size: "lg" },
          { type: "text", text: `來自 ${who.name}`, color: "#ffffffdd", size: "sm", wrap: true },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: rows.map(([k, v]) => ({
          type: "box",
          layout: "baseline",
          spacing: "md",
          contents: [
            { type: "text", text: k, size: "sm", color: MUTED, flex: 3 },
            { type: "text", text: v, size: "sm", color: INK, flex: 7, wrap: true },
          ],
        })),
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          button(uri("到聊天室回覆", "https://chat.line.biz/"), "secondary"),
          ...(who.userId ? [{ type: "text", text: who.userId, size: "xxs", color: "#94a3b8", align: "center", margin: "sm" }] : []),
        ],
      },
    }),
  ];
}

export { text };
