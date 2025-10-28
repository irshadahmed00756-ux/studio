'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPersonalizedRecommendations, PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-product-recommendations';
import { useProductHistory } from '@/hooks/use-product-history';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductRecommendations() {
  const { history } = useProductHistory();
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      if (history.length > 0) {
        setLoading(true);
        try {
          const result = await getPersonalizedRecommendations({
            browsingHistory: history,
            userPreferences: 'Likes traditional, golden, and premium handmade items for weddings.',
          });
          setRecommendations(result);
        } catch (error) {
          console.error("Failed to fetch recommendations:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [history]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-2 font-headline text-lg font-semibold">You Might Also Like</h3>
      <ul className="list-disc space-y-1 pl-5">
        {recommendations.recommendations.map((rec, index) => (
          <li key={index} className="text-sm">
            <Link href={`/products?query=${encodeURIComponent(rec)}`} className="text-muted-foreground hover:text-primary hover:underline">
              {rec}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
