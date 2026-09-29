'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, ShoppingBag, Star, ShieldCheck } from 'lucide-react';
import { QUIZ_QUESTIONS, PRODUCTS_DATA } from '@/lib/productsData';
import { Product } from '@/types';
import { useCart } from '@/lib/cartContext';
import { formatPrice } from '@/lib/formatPrice';
import confetti from 'canvas-confetti';

export default function QuizPage() {
  const { addToCart, applyPromoCode, setIsCartOpen } = useCart();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [skinDiagnosis, setSkinDiagnosis] = useState<string>('');

  const handleSelectOption = (option: any) => {
    const updatedAnswers = { ...answers, [currentStep]: option };
    setAnswers(updatedAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate recommendations
      calculateRoutine(updatedAnswers);
    }
  };

  const calculateRoutine = (finalAnswers: Record<number, any>) => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0B1F3A', '#174EA6', '#DCEBFA'],
      });
    } catch (e) {}

    const q1Skin = finalAnswers[0]?.skinType || 'All';
    const q2TargetSlug = finalAnswers[1]?.targetSlug || 'lumiere-hydra-dew-serum';
    const q3TargetSlug = finalAnswers[2]?.targetSlug || 'luminous-silk-skin-tint';

    setSkinDiagnosis(
      `${q1Skin} skin seeking radiant hydration and urban environmental defense.`
    );

    const match1 = PRODUCTS_DATA.find((p) => p.slug === q2TargetSlug) || PRODUCTS_DATA[0];
    const match2 = PRODUCTS_DATA.find((p) => p.slug === q3TargetSlug) || PRODUCTS_DATA[1];
    const cleanser = PRODUCTS_DATA.find((p) => p.slug === 'cloud-melt-cleansing-balm') || PRODUCTS_DATA[4];

    // Unique list
    const matched = [match1, match2, cleanser].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );

    setRecommendedProducts(matched);
    setIsCompleted(true);
  };

  const handleAddAllToCart = () => {
    applyPromoCode('CITYGLOW15');
    recommendedProducts.forEach((prod) => {
      addToCart(prod, 1, prod.variants?.[0]);
    });
    setIsCartOpen(true);
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
    setRecommendedProducts([]);
  };

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F9FE] to-white py-12 md:py-20 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6">
        {!isCompleted ? (
          /* Quiz Question Stage */
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-[#E5E7EB] animate-fadeIn">
            {/* Top Indicator */}
            <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB] mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#174EA6]" />
                <span className="text-xs uppercase tracking-widest text-[#174EA6] font-semibold">
                  Skin & Routine Diagnostic
                </span>
              </div>
              <span className="text-xs text-[#6B7280] font-semibold">
                Step {currentStep + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#DCEBFA] h-2 rounded-full overflow-hidden mb-8">
              <div
                className="bg-gradient-to-r from-[#174EA6] to-[#0B1F3A] h-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            {/* Question title */}
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#0B1F3A] text-center mb-8">
              {currentQ.question}
            </h2>

            {/* Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className="p-5 rounded-xl border border-[#E5E7EB] hover:border-[#0B1F3A] bg-[#F5F9FE] hover:bg-white text-left transition-all duration-200 hover:shadow-xs group flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-[#1F2937] group-hover:text-[#0B1F3A]">
                    {option.text}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#174EA6] group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Previous Step Button */}
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="mt-8 text-xs text-[#6B7280] hover:text-[#0B1F3A] transition-colors"
              >
                &larr; Back to previous question
              </button>
            )}
          </div>
        ) : (
          /* Results Stage */
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-[#E5E7EB] animate-fadeIn space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBFA] text-[#0B1F3A] text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#174EA6]" /> Diagnostic Complete
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0B1F3A]">
                Your Bespoke City Glow Ritual
              </h2>

              <p className="text-xs sm:text-sm text-[#4B5563] bg-[#F5F9FE] p-4 rounded-xl border border-[#E5E7EB]">
                <strong className="text-[#0B1F3A]">Profile:</strong> {skinDiagnosis}
              </p>
            </div>

            {/* Recommended Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedProducts.map((p, index) => (
                <div
                  key={p.id}
                  className="p-4 rounded-none bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between hover:border-[#0B1F3A] transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#174EA6] tracking-widest block mb-1">
                      Step 0{index + 1} &bull; {p.category}
                    </span>
                    <div className="aspect-square rounded-none overflow-hidden mb-3 bg-[#F5F9FE] border border-[#E5E7EB]">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-serif-luxury text-sm font-semibold text-[#0B1F3A] line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-[#6B7280] mt-0.5 line-clamp-1">{p.subtitle}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B1F3A]">{formatPrice(p.price)}</span>
                    <Link
                      href={`/product/${p.slug}`}
                      className="text-[11px] text-[#174EA6] font-semibold hover:underline"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo banner callout */}
            <div className="bg-[#DCEBFA]/50 p-4 rounded-xl border border-[#DCEBFA] flex items-center justify-between text-xs text-[#0B1F3A]">
              <span>
                ✨ 15% VIP code <strong className="text-[#174EA6]">CITYGLOW15</strong> will be automatically applied to your ritual bag.
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={handleAddAllToCart}
                className="w-full sm:flex-1 bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-md flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#DCEBFA]" /> Add Complete Ritual to Bag
              </button>

              <button
                onClick={restartQuiz}
                className="text-xs text-[#6B7280] hover:text-[#0B1F3A] flex items-center gap-1.5 px-4 py-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Diagnostic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
