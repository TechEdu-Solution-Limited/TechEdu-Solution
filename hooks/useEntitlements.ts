'use client';

import { useState, useEffect } from 'react';
import { getTokenFromCookies } from '@/lib/cookies';
import { apiRequest } from '@/lib/apiFetch';

export interface EntitlementSubject {
  subjectType: 'feature' | 'tool' | 'product';
  subjectId: string;
  subjectKey: string;
}

export interface EntitlementResponse {
  ok: boolean;
  hasAccess: boolean;
  subject: EntitlementSubject;
}

export interface UseEntitlementsOptions {
  subjectKey: string;
  subjectType?: 'feature' | 'tool' | 'product';
  enabled?: boolean;
}

export interface UseEntitlementsReturn {
  hasAccess: boolean | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEntitlements({
  subjectKey,
  subjectType = 'tool',
  enabled = true,
}: UseEntitlementsOptions): UseEntitlementsReturn {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkEntitlement = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError('Authentication required');
        setHasAccess(false);
        return;
      }

      const response = await apiRequest(
        `/api/me/entitlements/check?subjectKey=${encodeURIComponent(subjectKey)}&subjectType=${subjectType}`,
        'GET',
        {},
        token
      );

      if (response.status === 200 && response.data) {
        const data = response.data as EntitlementResponse;
        setHasAccess(data.ok && data.hasAccess);
      } else {
        setError('Failed to check entitlement');
        setHasAccess(false);
      }
    } catch (err: any) {
      console.error('Entitlement check failed:', err);
      setError(err?.message || 'Failed to check access');
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkEntitlement();
  }, [subjectKey, subjectType, enabled]);

  return {
    hasAccess,
    loading,
    error,
    refetch: checkEntitlement,
  };
}
