'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

interface SimulationStatusProps {
  isActive: boolean;
}

export function SimulationStatus({ isActive }: SimulationStatusProps) {
  const t = useTranslations('sidebar');

  if (isActive) {
    return (
      <div className='px-2 py-6'>
        <div className='relative'>
          {/* Subtle divider line */}
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-slate-700/30'></div>
          </div>

          <div className='relative flex justify-center'>
            <motion.div
              className='relative overflow-hidden'
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Premium glassmorphism container */}
              <motion.div
                className='relative px-4 py-3 rounded-xl backdrop-blur-xl border border-white/[0.08] shadow-2xl'
                style={{
                  background: 'rgba(15, 23, 42, 0.4)'
                }}
                animate={{
                  borderColor: [
                    'rgba(255, 20, 147, 0.15)',
                    'rgba(0, 191, 255, 0.15)',
                    'rgba(139, 92, 246, 0.15)',
                    'rgba(255, 20, 147, 0.15)'
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {/* Ambient light effect */}
                <motion.div
                  className='absolute inset-0 rounded-xl opacity-20'
                  animate={{
                    background: [
                      'radial-gradient(circle at 30% 50%, #FF149310, transparent 70%)',
                      'radial-gradient(circle at 70% 50%, #00BFFF10, transparent 70%)',
                      'radial-gradient(circle at 50% 30%, #8B5CF610, transparent 70%)',
                      'radial-gradient(circle at 30% 50%, #FF149310, transparent 70%)'
                    ]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />

                <div className='relative flex items-center gap-2'>
                  {/* Animated status indicator */}
                  <motion.div
                    className='relative'
                    animate={{
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <div className='w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400'></div>
                    <motion.div
                      className='absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400'
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [0.8, 0, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut'
                      }}
                    />
                  </motion.div>

                  {/* Premium text */}
                  <motion.span
                    className='text-xs font-semibold text-slate-100 uppercase tracking-wider'
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      letterSpacing: '0.05em'
                    }}
                    animate={{
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    {t('activeSimulation')}
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Inactive state - sophisticated call to action (smaller version)
  return (
    <div className='px-2 py-5'>
      <div className='relative group'>
        {/* Subtle divider */}
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-slate-700/30'></div>
        </div>

        <div className='relative flex justify-center'>
          <motion.button
            className='relative cursor-pointer bg-transparent border-0 p-0 w-full flex justify-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              // TODO: Navigate to simulations page
              console.log('Navigate to simulations');
            }}
          >
            {/* Premium invitation container - smaller version */}
            <motion.div
              className='relative px-3 py-2.5 rounded-lg backdrop-blur-sm border border-slate-600/20 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-[180px]'
              style={{
                background:
                  'linear-gradient(135deg, rgba(30, 41, 59, 0.3), rgba(15, 23, 42, 0.5))'
              }}
              whileHover={{
                borderColor: 'rgba(59, 130, 246, 0.4)',
                background:
                  'linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.7))',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)'
              }}
            >
              {/* Subtle hover glow */}
              <motion.div
                className='absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500'
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, #3B82F620, transparent 70%)'
                }}
              />

              <div className='relative flex items-center gap-2'>
                {/* Motivational copy - no icon */}
                <div className='flex flex-col flex-1'>
                  <motion.span
                    className='text-xs font-medium text-slate-300 group-hover:text-slate-100 transition-colors duration-300'
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      lineHeight: '1.2'
                    }}
                  >
                    {t('exploreOpportunities')}
                  </motion.span>
                  <motion.span
                    className='text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors duration-300 mt-0.5'
                    style={{
                      letterSpacing: '0.02em'
                    }}
                  >
                    {t('nextChallenge')}
                  </motion.span>
                </div>

                {/* Interactive arrow indicator */}
                <motion.div
                  className='opacity-40 group-hover:opacity-80 transition-all duration-300'
                  animate={{
                    x: [0, 2, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <ArrowRight
                    size={12}
                    className='text-blue-400 group-hover:text-blue-300 transition-colors duration-300'
                  />
                </motion.div>
              </div>

              {/* Subtle pulse animation on hover */}
              <motion.div
                className='absolute inset-0 rounded-lg border border-blue-400/0 group-hover:border-blue-400/20 transition-colors duration-500'
                animate={{
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
