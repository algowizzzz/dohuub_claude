"use client";

import { useState, useEffect, useCallback } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, ThumbsUp, Flag, Loader2, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import api, { ENDPOINTS } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  vendorResponse?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  booking?: {
    id: string;
    category: string;
  };
}

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`${ENDPOINTS.REVIEWS}/vendor`);
      setReviews(response.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch reviews:", err);
      // If vendor reviews endpoint doesn't exist, try general reviews
      try {
        const generalRes = await api.get(ENDPOINTS.REVIEWS);
        setReviews(generalRes.data.data || []);
      } catch {
        setReviews([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const distribution: RatingDistribution[] = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return {
      stars,
      count,
      percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
    };
  });

  const filteredReviews = reviews.filter((review) => {
    if (filter === "ALL") return true;
    if (filter === "REPLIED") return !!review.vendorResponse;
    if (filter === "PENDING") return !review.vendorResponse;
    return review.rating === parseInt(filter);
  });

  const getCustomerName = (review: Review) => {
    if (review.user.profile) {
      return `${review.user.profile.firstName} ${review.user.profile.lastName}`;
    }
    return review.user.email.split("@")[0];
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await api.put(`${ENDPOINTS.REVIEWS}/${reviewId}/reply`, {
        response: replyText,
      });
      toast({ title: "Success", description: "Reply sent successfully" });
      setReplyingTo(null);
      setReplyText("");
      fetchReviews();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalLayout title="Reviews" subtitle="Manage customer feedback and ratings">
      <div className="space-y-6">
        {/* Rating Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="p-6 text-center">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              ) : (
                <>
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${
                          star <= Math.round(averageRating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500">Based on {totalReviews} reviews</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-3">
                  {distribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium">{item.stars}</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-20 text-right">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          {["ALL", "5", "4", "3", "2", "1", "PENDING", "REPLIED"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "ALL"
                ? "All Reviews"
                : f === "PENDING"
                ? "Needs Reply"
                : f === "REPLIED"
                ? "Replied"
                : `${f} Stars`}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={fetchReviews} className="ml-auto">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Loading reviews...</p>
            </CardContent>
          </Card>
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No reviews found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-lg">
                        {getCustomerName(review).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{getCustomerName(review)}</p>
                          {review.booking && (
                            <p className="text-sm text-gray-500">{review.booking.category}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>

                      {review.comment && (
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                      )}

                      {/* Vendor Reply */}
                      {review.vendorResponse && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Your Reply:</p>
                          <p className="text-sm text-gray-600">{review.vendorResponse}</p>
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingTo === review.id && (
                        <div className="space-y-3 mb-4">
                          <textarea
                            rows={3}
                            placeholder="Write your reply..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleReply(review.id)}
                              disabled={isSubmitting || !replyText.trim()}
                            >
                              {isSubmitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                              Send Reply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!review.vendorResponse && replyingTo !== review.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReplyingTo(review.id)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Thank
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <Flag className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
