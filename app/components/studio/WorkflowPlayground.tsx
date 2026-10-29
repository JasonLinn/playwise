"use client";

import { useState } from "react";
import styles from "./studio.module.css";
import ConsultationBrief from "./ConsultationBrief";

const scenarios = [
  {
    label: "民宿日常",
    before: ["回覆入住問題", "整理預約資料", "提醒入住事項"],
    after: ["常見問題先回覆", "預約資料集中看", "入住提醒按時送"],
    title: "把好好接待，留給你。",
    description:
      "讓固定資訊先被看見，預約與提醒依流程處理。特殊需求仍交給你判斷。",
    question: "我經營民宿，想整理預約、入住提醒與常見問題回覆的流程。",
  },
  {
    label: "小店經營",
    before: ["抄寫訂單內容", "確認取貨時間", "逐筆通知客人"],
    after: ["訂單欄位先整理", "取貨時間有紀錄", "進度通知依序送"],
    title: "把用心製作，留給你。",
    description:
      "把訂單、取貨與通知串成清楚的步驟，減少重複抄寫；例外狀況保留人工確認。",
    question: "我經營小店，想整理訂單、取貨預約與進度通知的流程。",
  },
  {
    label: "個人接案",
    before: ["來回詢問需求", "整理各處訊息", "記住交件日期"],
    after: ["需求表單先收齊", "專案資訊集中看", "待辦到期前提醒"],
    title: "把專心創作，留給你。",
    description:
      "先把需求與時程整理好，減少在訊息之間切換，讓每個案子的下一步更清楚。",
    question: "我是個人接案者，想整理需求收集、專案資訊與交件提醒的流程。",
  },
];

export default function WorkflowPlayground() {
  const [selected, setSelected] = useState(0);
  const [organized, setOrganized] = useState(false);
  const scenario = scenarios[selected];
  return (
    <section className={styles.playground} aria-labelledby="playground-title">
      <div className={styles.playIntro}>
        <p className={styles.eyebrow}>LESS BUSY. MORE LIVING.</p>
        <h2 id="playground-title">
          少一點忙亂。
          <br />
          多一點<span className={styles.serif}>餘裕。</span>
        </h2>
        <p>
          你的日常，卡在哪一步？
          <br />
          選一種情境，試著把事情理順。
        </p>
        <div className={styles.scenarios} aria-label="選擇工作情境">
          {scenarios.map((item, index) => (
            <button
              key={item.label}
              aria-pressed={selected === index}
              onClick={() => {
                setSelected(index);
                setOrganized(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.demoNote}>互動情境示範，實際串接依需求評估。</p>
      </div>
      <div
        className={`${styles.flowBoard} ${organized ? styles.organized : ""}`}
      >
        <div className={styles.boardTop}>
          <span>YOUR EVERYDAY / 0{selected + 1}</span>
          <span>{organized ? "理順之後" : "忙碌的日常"}</span>
        </div>
        <div className={styles.flowStage} role="list" aria-label="流程步驟">
          <svg
            className={styles.flowLine}
            viewBox="0 0 500 180"
            fill="none"
            aria-hidden="true"
          >
            <path
              d={
                organized
                  ? "M40 90H460"
                  : "M35 120C100-70 360 250 260 70S30 220 460 55"
              }
            />
          </svg>
          {(organized ? scenario.after : scenario.before).map((text, index) => (
            <div className={styles.task} role="listitem" key={index}>
              <span>{organized ? "✓" : `0${index + 1}`}</span>
              {text}
            </div>
          ))}
        </div>
        <div
          className={styles.flowResult}
          aria-live="polite"
          aria-atomic="true"
        >
          <h3>{organized ? scenario.title : "事情很多，不必全靠你記住。"}</h3>
          <p>
            {organized
              ? scenario.description
              : scenario.before.join("、") + "。讓每件事有自己的位置。"}
          </p>
        </div>
        <button
          className={styles.flowButton}
          aria-pressed={organized}
          onClick={() => setOrganized(!organized)}
        >
          {organized ? "再看一次原本的日常" : "試著理順日常"}{" "}
          <span aria-hidden="true">{organized ? "↺" : "↗"}</span>
        </button>
        <details className={styles.brief}>
          <summary>
            這也是我的困擾，準備諮詢內容 <span aria-hidden="true">＋</span>
          </summary>
          <ConsultationBrief
            key={selected}
            id="workflow-message"
            initialText={scenario.question + "\n目前最常卡住的地方："}
          />
        </details>
      </div>
    </section>
  );
}
