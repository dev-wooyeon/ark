'use client';

import { useEffect, ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useDragControls,
  PanInfo,
} from 'framer-motion';
import { clsx } from 'clsx';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  height?: 'auto' | 'half' | 'full';
}

const heightStyles = {
  auto: 'max-h-[80vh]',
  half: 'h-[50vh]',
  full: 'h-[90vh]',
};

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
}: BottomSheetProps) {
  const dragControls = useDragControls();

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (typeof window === 'undefined') return null;

  const overlayRoot = document.getElementById('overlay-root');
  if (!overlayRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[var(--z-modal)]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={clsx(
              'fixed bottom-0 left-0 right-0 z-[var(--z-modal)]',
              'bg-white rounded-t-[var(--radius-lg)] overflow-hidden',
              heightStyles[height]
            )}
          >
            {/* Handle */}
            <div
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-[var(--color-grey-300)] rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-6 pb-4 border-b border-[var(--color-grey-100)]">
                <h2 className="text-lg font-bold text-[var(--color-grey-900)]">
                  {title}
                </h2>
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    overlayRoot
  );
}

export type { BottomSheetProps };
