"use client";

export default function ConsultationLink({ service }: { service: string }) {
  return (
    <a
      href="#contact"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("playwise:consultation-service", { detail: service }),
        );
      }}
    >
      聊聊{service}需求
    </a>
  );
}
