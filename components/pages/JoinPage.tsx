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
      question: '參與實驗計畫需要付費嗎？',
      answer:
        '不需要。在此實驗階段，所有功能與覺察練習皆完全免費。使用回饋將用於優化整體系統體驗。',
    },
    {
      question: '資料隱私如何保障？',
      answer:
        '在目前的實驗階段，帳號與表單相關資訊主要用於介面體驗與覺察流程的調整，以及必要的登入與帳號管理。相關資訊不會對外公開，也不會被用於與本計畫無關的用途。',
    },
    {
      question: '我不確定自己是否為高敏感族群 (HSP)？',
      answer:
        'Unload 的機制適用於所有希望提升職場心理邊界的人。無論是否經由量表確認為 HSP，只要常感到環境刺激過載或情緒邊界模糊，此系統皆能提供協助。',
    },
    {
      question: '計畫將持續多久？',
      answer: '目前仍處於實驗計畫階段，將持續進行直至正式版上線。',
    },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-secondary-light/10">
      <div className="max-w-xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="text-secondary-accent text-xs tracking-[0.2em] uppercase block mb-4">Experimental Access</span>
            <h1 className="text-3xl font-light text-primary mb-6">參與體驗介面實驗計畫</h1>
            <p className="text-primary-light font-light text-sm leading-loose">
              Unload 目前處於「體驗介面」與覺察流程的實驗階段。
              <br />
              透過實際互動紀錄界面使用情境，做為後續調整與迭代的參考。
            </p>
          </div>

          <form
            className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-secondary-light/30 hover:border-secondary-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 mb-20 space-y-6 text-left"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <p className="text-sm text-primary-light leading-relaxed">
              目前實驗計畫聚焦在介面體驗與覺察流程的設計。若有意參與，
              歡迎在下方留下基本聯絡方式與你當前想關注的職場情境，我們會在後續實驗批次中優先通知。
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary-light/80 mb-1">稱呼（必填）</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-secondary-light/50 bg-secondary-light/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-secondary-accent focus:border-secondary-accent/60"
                  placeholder="例如：Sarah"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-light/80 mb-1">Email（實驗通知用）</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-secondary-light/50 bg-secondary-light/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-secondary-accent focus:border-secondary-accent/60"
                  placeholder="example@unload.app"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-light/80 mb-1">目前想關注的職場情境</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-secondary-light/50 bg-secondary-light/10 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-secondary-accent focus:border-secondary-accent/60 resize-none"
                  placeholder="可以簡單描述讓你最近感到困擾、想釐清或想保護邊界的情境。"
                  {...register('context')}
                />
                {errors.context && (
                  <p className="mt-1 text-xs text-red-500">{errors.context.message}</p>
                )}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full flex justify-center items-center space-x-2 group"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? '送出中…' : '送出表單並前往登入體驗'}</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Button>
              <p className="text-center text-[10px] text-primary-light/50">
                表單僅用於本次實驗計畫的聯絡與安排，不會對外公開或用於其他用途。
              </p>

              <button
                type="button"
                className="mx-auto block text-[11px] text-primary-light/70 hover:text-primary underline underline-offset-4 decoration-secondary-accent/40 hover:decoration-secondary-accent transition-colors"
                onClick={() => onComplete()}
              >
                暫時只想先看看介面？先跳過，直接體驗。
              </button>
            </div>
          </form>

          <div className="max-w-2xl mx-auto">
            <SectionHeading title="常見問題" subtitle="FAQ" />
            <div className="bg-white rounded-xl border border-secondary-light/30 px-6 md:px-10 py-2 shadow-sm hover:border-secondary-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
