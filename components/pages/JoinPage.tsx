
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FadeIn } from '../ui/FadeIn';
import { Button } from '../ui/Button';
import { ChevronRight, Send } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { AccordionItem } from '../common/AccordionItem';

type JoinPageProps = {
  onComplete: () => void;
};

const joinFormSchema = z.object({
  name: z
    .string()
    .min(2, '請輸入至少 2 個字')
    .max(50, '名字長度請少於 50 個字'),
  email: z
    .string()
    .min(1, '請輸入 Email')
    .email('Email 格式似乎不正確'),
  context: z
    .string()
    .min(10, '請簡單描述目前想關注的職場情境（至少 10 個字）')
    .max(500, '描述長度請少於 500 個字'),
});

type JoinFormValues = z.infer<typeof joinFormSchema>;

export const JoinPage: React.FC<JoinPageProps> = ({ onComplete }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      name: '',
      email: '',
      context: '',
    },
  });

  const onSubmit = async (values: JoinFormValues) => {
    // 這裡暫時只做前端紀錄，未串接後端
    console.log('Join form submitted:', values);

    // 模擬輕微延遲，讓使用者有按鈕 loading 的感覺
    await new Promise((resolve) => setTimeout(resolve, 400));

    onComplete();
  };

  const faqs = [
    {
      question: '參與目前的體驗計畫需要付費嗎？',
      answer:
        '目前處於 Beta 測試階段，體驗介面與覺察流程皆可免費使用。我們會依照實際使用情況持續調整功能，若有變動會在官網部落格公告。',
    },
    {
      question: '資料隱私如何保障？',
      answer:
        '在目前的測試階段，帳號與相關使用紀錄，會主要用於提供與維護本服務、調整介面與覺察流程，以及必要的登入與帳號管理。除隱私頁與平台約定中另有說明或法律要求外，不會以可識別個人身分的方式對外公開，也不會被用於與本計畫無關的其他用途。',
    },
    {
      question: '我不確定自己是否為高敏感族群 (HSP)？',
      answer:
        'Unload 的設計初衷是服務高敏感與在意邊界的人，但不限於正式被量表標註為 HSP。只要你經常覺得職場刺激過載、邊界模糊或情緒難以安放，都可以透過這套工具來整理與覺察。',
    },
    {
      question: '計畫將持續多久？',
      answer:
        '目前本服務仍處於長期測試階段，沒有固定的截止日期。我們會依照開發進度與使用回饋持續調整方向；若有重大變更（例如:服務中止），會在官方網站或相關管道事先說明。',
    },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-secondary-light/10">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <span className="text-secondary-accent text-xs tracking-[0.2em] uppercase block mb-4">Experimental Access</span>
          <h1 className="text-4xl md:text-5xl font-light text-primary mb-8 leading-tight">參與體驗介面實驗計畫</h1>

          <div className="space-y-16 text-primary-light font-light leading-loose">
            <section>
              <p className="text-base md:text-lg mb-6">
                Unload 目前處於「體驗介面」與覺察流程的實驗階段。透過實際互動與使用紀錄，觀察不同職場情境下，高敏感與在意邊界的使用者，如何與這套工具對話，做為後續調整與迭代的參考。
              </p>
              <p className="text-sm md:text-base">
                如果你願意幫忙分享真實的工作情境與使用感受，這會成為我們調整系統很重要的依據。
              </p>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-secondary-light/30 hover:border-secondary-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6 md:p-10">
              <h2 className="text-xl font-medium text-primary mb-4">問卷調查與實驗計畫</h2>
              <p className="text-sm text-primary-light leading-relaxed mb-6">
                若你願意提供更完整的使用經驗與職場情境，歡迎透過問卷調查分享給我們。這份問卷將作為後續調整介面與覺察流程的重要參考，不會用於與本計畫無關的其他用途。
              </p>

              <div className="flex flex-col items-center gap-3">
                <Button
                  type="button"
                  className="inline-flex items-center space-x-2 px-8"
                  onClick={onComplete}
                >
                  <span>前往問卷調查</span>
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </Button>
                <p className="text-[11px] text-primary-light/60 text-center">
                  你也可以選擇直接體驗系統，之後再決定是否填寫問卷。
                </p>
              </div>
            </section>

            <section>
              <SectionHeading title="常見問題" subtitle="FAQ" />
              <div className="bg-white rounded-xl border border-secondary-light/30 px-6 md:px-10 py-4 shadow-sm hover:border-secondary-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </section>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
