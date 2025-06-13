import { useEffect, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';
import { sendHeartbeatRequest } from 'smt-v1-app/services/UserService';

// Constants
const HEARTBEAT_INTERVAL = 30 * 1000; // 30 seconds default
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds minimum between requests
const CHANNEL_NAME = 'heartbeat_channel';
const LEADER_MESSAGE = 'leader';
const FOLLOWER_MESSAGE = 'follower';
const TIMER_TICK_MESSAGE = 'timer_tick';

// LocalStorage keys
const LAST_REQUEST_KEY = 'last_heartbeat_request';
const LEADER_TAB_KEY = 'heartbeat_leader_tab';
const HEARTBEAT_STARTED_KEY = 'heartbeat_started';

interface HeartbeatOptions {
  interval?: number;
  stopWhenHidden?: boolean;
  endpoint?: string;
}

export const useHeartbeat = (options: HeartbeatOptions = {}) => {
  const {
    interval = HEARTBEAT_INTERVAL,
    stopWhenHidden = false,
    endpoint = '/user/heartbeat'
  } = options;

  const channelRef = useRef<BroadcastChannel | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLeaderRef = useRef<boolean>(false);
  const tabIdRef = useRef<string>('');

  // Helper functions
  const getLastRequestTime = () => {
    const time = localStorage.getItem(LAST_REQUEST_KEY);
    return time ? parseInt(time) : 0;
  };

  const updateLastRequestTime = (time: number) => {
    localStorage.setItem(LAST_REQUEST_KEY, time.toString());
  };

  const getLeaderTab = () => localStorage.getItem(LEADER_TAB_KEY);
  const updateLeaderTab = (tabId: string) =>
    localStorage.setItem(LEADER_TAB_KEY, tabId);

  // Send heartbeat request
  const sendHeartbeat = useCallback(async () => {
    console.log(
      '🔵 [Heartbeat] sendHeartbeat called, isLeader:',
      isLeaderRef.current
    );
    if (!isLeaderRef.current) {
      console.log('🔵 [Heartbeat] Not the leader tab, skipping request');
      return;
    }

    const now = Date.now();
    const lastRequestTime = getLastRequestTime();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      console.log(
        '🔵 [Heartbeat] Skipping request, too soon since last request'
      );
      return;
    }

    const url = window.location.pathname;
    console.log('🔵 [Heartbeat] Sending request for URL:', url);

    try {
      const response = await sendHeartbeatRequest(url);
      if (response.status === 200 || response.data?.statusCode === 200) {
        console.log('🔵 [Heartbeat] Request sent successfully via UserService');
        updateLastRequestTime(now);
      } else {
        console.error(
          '🔵 [Heartbeat] Request failed with status:',
          response.status
        );
      }
    } catch (error) {
      console.error('🔵 [Heartbeat] Request failed:', error);
    }
  }, []);

  // Setup tab management
  const setupTabManagement = useCallback(() => {
    if (!channelRef.current) {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME);
    }

    const channel = channelRef.current;
    tabIdRef.current = Math.random().toString(36).substring(2);

    // Initial leader election
    if (!getLeaderTab()) {
      console.log(
        '🔵 [Tab Management] Becoming leader with ID:',
        tabIdRef.current
      );
      updateLeaderTab(tabIdRef.current);
      isLeaderRef.current = true;
      channel.postMessage(LEADER_MESSAGE);
    } else {
      console.log('🔵 [Tab Management] Leader exists:', getLeaderTab());
      isLeaderRef.current = false;
    }

    // Message handler
    channel.onmessage = event => {
      console.log('🔵 [Channel] Received message:', event.data);

      if (event.data === LEADER_MESSAGE) {
        console.log('🔵 [Channel] Another tab became leader');
        isLeaderRef.current = false;
      } else if (event.data === TIMER_TICK_MESSAGE) {
        console.log(
          '🔵 [Channel] Timer tick received, isLeader:',
          isLeaderRef.current
        );
        if (isLeaderRef.current) {
          sendHeartbeat();
        }
      }
    };

    // Handle tab visibility
    const handleVisibilityChange = () => {
      if (document.hidden && stopWhenHidden) {
        if (isLeaderRef.current) {
          console.log('🔵 [Tab Management] Tab hidden, removing leader status');
          localStorage.removeItem(LEADER_TAB_KEY);
          channel.postMessage(FOLLOWER_MESSAGE);
          isLeaderRef.current = false;
        }
      } else if (!document.hidden && !getLeaderTab()) {
        console.log(
          '🔵 [Tab Management] Tab visible and no leader, becoming leader'
        );
        updateLeaderTab(tabIdRef.current);
        isLeaderRef.current = true;
        channel.postMessage(LEADER_MESSAGE);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sendHeartbeat, stopWhenHidden]);

  // Start timer
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    console.log('🔵 [Timer] Starting with interval:', interval);
    timerRef.current = setInterval(() => {
      sendHeartbeat();
    }, interval);
  }, [interval, sendHeartbeat]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (channelRef.current) {
      if (isLeaderRef.current) {
        localStorage.removeItem(LEADER_TAB_KEY);
        channelRef.current.postMessage(FOLLOWER_MESSAGE);
      }
      channelRef.current.close();
      channelRef.current = null;
    }
  }, []);

  // Main effect
  useEffect(() => {
    const cleanupTabManagement = setupTabManagement();
    startTimer();

    // Handle tab close
    const handleBeforeUnload = () => {
      if (isLeaderRef.current) {
        console.log('🔵 [Tab Management] Tab closing, removing leader status');
        localStorage.removeItem(LEADER_TAB_KEY);
        channelRef.current?.postMessage(FOLLOWER_MESSAGE);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      cleanup();
      cleanupTabManagement?.();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [setupTabManagement, startTimer, cleanup]);

  return {
    isLeader: isLeaderRef.current,
    tabId: tabIdRef.current
  };
};
