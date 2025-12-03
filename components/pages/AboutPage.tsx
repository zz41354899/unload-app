import React from 'react';
import { FadeIn } from '../ui/FadeIn';

export const AboutPage = () => (
  <div className="pt-32 pb-20">
    <div className="max-w-4xl mx-auto px-6">
      <FadeIn>
        <span className="text-secondary-accent text-xs tracking-[0.2em] uppercase block mb-4">About Unload</span>
        <h1 className="text-4xl md:text-5xl font-light text-primary mb-12 leading-tight">
          高敏特質：<br />通往無意識的鑰匙
        </h1>

        <div className="space-y-16 text-primary-light text-lg font-light leading-loose">
          <section>
            <p className="mb-6">
              榮格 (Carl Jung) 認為，所謂的「精神官能症」，往往是心靈為了勉強適應當下困境而做出的合理嘗試。
              對高敏感族群 (HSP) 來說，職場裡的焦慮與耗竭，並不是個人太脆弱，而是
              <strong>「人格面具 (Persona)」</strong>
              被迫維持在同一種樣子太久，慢慢與內在的
              <strong>「陰影 (Shadow)」</strong>
              失去連結所造成的結果。
            </p>
            <p>
              Unload 心輕日誌建構於阿德勒心理學基礎之上。不採用「治療」或「矯正」的觀點，而是提供一套心理學的<strong>「鏡像機制」</strong>。
            </p>
          </section>

          <section className="p-8 bg-secondary-light/30 rounded-lg border-l-2 border-secondary-accent/60">
            <h3 className="text-xl font-medium text-primary mb-4">核心哲學：個體化 (Individuation)</h3>
            <p className="text-base">
              這是一個心理整合的過程。透過區分「我」與「非我」，將過載的感官資訊轉化為意識的養分，最終回歸自性 (Self) 的完整。
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-light text-primary mb-6">四階段覺察循環</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { t: '01 覺察', d: '打開內在探照燈，純粹觀察身體緊繃與情緒波動。' },
                { t: '02 反思', d: '運用積極想像技術，分辨情緒源頭與情結投射。' },
                { t: '03 分離與洞察', d: '劃定心理疆界，將不屬於個體的集體情緒歸還環境。' },
                { t: '04 內化', d: '整合經驗為意識功能，鍛鍊心靈的穩定核心。' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded border border-secondary-light/30 hover:border-secondary-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <h4 className="text-primary font-medium mb-2">{item.t}</h4>
                  <p className="text-sm">{item.d}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </FadeIn>
    </div>
  </div>
);
