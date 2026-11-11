"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export const CONTROLS_HIDE_DELAY = 8000;

/**
 * Player control-bar visibility.
 *
 * - Normal view: hidden 8 s after load or after the pointer leaves the
 *   player; visible while the pointer is over it.
 * - Fullscreen: the pointer is always "over" the player, so hovering can't
 *   be the signal. The bar (and the cursor) hide after 8 s without pointer
 *   movement, and any movement brings them back for another 8 s.
 * - Touch and keyboard focus show the bar for 8 s in both modes.
 */
export function useAutoHideControls(stageRef: RefObject<HTMLElement | null>, delay = CONTROLS_HIDE_DELAY) {
  const [timedVisible, setTimedVisible] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  /** Show now, hide after `delay`. */
  const flash = useCallback(() => {
    setTimedVisible(true);
    clearTimer();
    timerRef.current = window.setTimeout(() => setTimedVisible(false), delay);
  }, [clearTimer, delay]);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => setTimedVisible(false), delay);
    return clearTimer;
  }, [clearTimer, delay]);

  useEffect(() => {
    const onChange = () => {
      const stage = stageRef.current;
      const element = document.fullscreenElement;
      setFullscreen(Boolean(stage && element && (element === stage || stage.contains(element))));
      flash();
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [stageRef, flash]);

  const onPointerActivity = useCallback(() => {
    setHovering(true);
    if (fullscreen) {
      flash();
    } else {
      setTimedVisible(true);
      clearTimer();
    }
  }, [fullscreen, flash, clearTimer]);

  const handlers = {
    onMouseEnter: onPointerActivity,
    onMouseMove: onPointerActivity,
    onMouseLeave: () => {
      setHovering(false);
      flash();
    },
    onTouchStart: flash,
    onFocus: flash,
  };

  const visible = timedVisible || (hovering && !fullscreen);

  return { visible, fullscreen, handlers };
}
