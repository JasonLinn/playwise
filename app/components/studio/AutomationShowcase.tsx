import Link from "next/link";
import styles from "./studio.module.css";

export default function AutomationShowcase() {
  return (
    <article className={styles.automation} aria-labelledby="automation-title">
      <div className={styles.automationCopy}>
        <p className={styles.serviceLabel}>洗衣廠 LINE 訂單原型 · 互動展示</p>
        <h3 id="automation-title">
          從一則訊息，
          <br />
          到一張清楚的訂單。
        </h3>
        <p>
          品項、數量、取送時間散在對話裡，容易反覆確認。我們把這些資訊收進同一段流程，送出前再讓客人核對。
        </p>
        <dl className={styles.scopeList}>
          <div>
            <dt>原型可體驗</dt>
            <dd>調整品項數量、選擇取送日期與時段、檢查金額與訂單摘要。</dd>
          </div>
          <div>
            <dt>正式導入另評估</dt>
            <dd>LINE 登入、後台接單、付款與通知串接；原型不會建立真實訂單。</dd>
          </div>
        </dl>
        <Link
          className={styles.textLink}
          href="/works/laundry"
          prefetch={false}
        >
          試用洗衣訂單原型 <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className={styles.orderPreview}>
        <div className={styles.orderHeading}>
          <span>洗衣廠 LIFF</span>
          <span>流程示意</span>
        </div>
        <ol className={styles.orderSteps}>
          <li>
            <span>1</span>
            <div>
              <h4>把需求收齊</h4>
              <p>品項與數量，在同一處選好。</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <h4>安排取送</h4>
              <p>先選收件，再選可用的送回日期。</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <h4>確認一張明細</h4>
              <p>數量、金額與時間，一起核對。</p>
            </div>
          </li>
        </ol>
        <div className={styles.orderReceipt}>
          <span>示範品項：襯衫 × 2</span>
          <strong>NT$ 160</strong>
          <p>依原型單價 NT$ 80 計算，僅供操作展示。</p>
        </div>
      </div>
    </article>
  );
}
