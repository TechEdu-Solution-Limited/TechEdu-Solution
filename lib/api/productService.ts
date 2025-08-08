import { getApiRequest, postApiRequest } from "../apiFetch";
import type {
  Product,
  ProductFilters,
  ProductSort,
  ProductSearchResult,
  ApiResponse,
} from "@/types";

export class ProductService {
  private static baseUrl = "/api/products";

  /**
   * Get all products with filtering and pagination
   */
  static async getProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    productType?: string;
    category?: string;
    deliveryMode?: string;
    sessionType?: string;
    difficultyLevel?: string;
    hasCertificate?: boolean;
    requiresBooking?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<ProductSearchResult>> {
    return getApiRequest(`${this.baseUrl}/public`, undefined, params);
  }

  /**
   * Get a single product by ID
   */
  static async getProduct(id: string): Promise<ApiResponse<Product>> {
    return getApiRequest(`${this.baseUrl}/public/${id}`);
  }

  /**
   * Get product categories
   */
  static async getCategories(
    productType?: string
  ): Promise<ApiResponse<string[]>> {
    const params = productType ? { productType } : undefined;
    return getApiRequest(`${this.baseUrl}/categories`, undefined, params);
  }

  /**
   * Get product subcategories
   */
  static async getSubcategories(
    productType?: string
  ): Promise<ApiResponse<string[]>> {
    const params = productType ? { productType } : undefined;
    return getApiRequest(`${this.baseUrl}/subcategories`, undefined, params);
  }

  /**
   * Search products
   */
  static async searchProducts(
    query: string,
    filters?: ProductFilters
  ): Promise<ApiResponse<ProductSearchResult>> {
    const { priceRange, ...otherFilters } = filters || {};

    const params: Record<string, string | number | boolean> = {
      search: query,
      ...otherFilters,
    };

    // Handle priceRange separately if it exists
    if (priceRange) {
      params.minPrice = priceRange.min;
      params.maxPrice = priceRange.max;
    }

    return getApiRequest(`${this.baseUrl}/search`, undefined, params);
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(
    limit: number = 6
  ): Promise<ApiResponse<Product[]>> {
    return getApiRequest(`${this.baseUrl}/featured`, undefined, { limit });
  }

  /**
   * Get popular products
   */
  static async getPopularProducts(
    limit: number = 6
  ): Promise<ApiResponse<Product[]>> {
    return getApiRequest(`${this.baseUrl}/popular`, undefined, { limit });
  }

  /**
   * Get new products
   */
  static async getNewProducts(
    limit: number = 6
  ): Promise<ApiResponse<Product[]>> {
    return getApiRequest(`${this.baseUrl}/new`, undefined, { limit });
  }

  /**
   * Get products by instructor
   */
  static async getProductsByInstructor(
    instructorId: string
  ): Promise<ApiResponse<Product[]>> {
    return getApiRequest(`${this.baseUrl}/instructor/${instructorId}`);
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(
    productId: string,
    limit: number = 4
  ): Promise<ApiResponse<Product[]>> {
    return getApiRequest(`${this.baseUrl}/${productId}/related`, undefined, {
      limit,
    });
  }

  /**
   * Get product availability
   */
  static async getProductAvailability(productId: string): Promise<
    ApiResponse<{
      isAvailable: boolean;
      availableSlots?: number;
      nextAvailableDate?: string;
    }>
  > {
    return getApiRequest(`${this.baseUrl}/${productId}/availability`);
  }

  /**
   * Get product pricing
   */
  static async getProductPricing(productId: string): Promise<
    ApiResponse<{
      price: number;
      originalPrice?: number;
      discountPercentage?: number;
      currency: string;
    }>
  > {
    return getApiRequest(`${this.baseUrl}/${productId}/pricing`);
  }

  /**
   * Get product materials
   */
  static async getProductMaterials(productId: string): Promise<
    ApiResponse<{
      materials: string[];
      syllabus?: string;
      videoUrl?: string;
    }>
  > {
    return getApiRequest(`${this.baseUrl}/${productId}/materials`);
  }

  /**
   * Get product reviews
   */
  static async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<
    ApiResponse<{
      reviews: any[];
      totalCount: number;
      averageRating: number;
    }>
  > {
    return getApiRequest(`${this.baseUrl}/${productId}/reviews`, undefined, {
      page,
      limit,
    });
  }

  /**
   * Add product to wishlist (requires authentication)
   */
  static async addToWishlist(
    productId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `${this.baseUrl}/${productId}/wishlist`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Remove product from wishlist (requires authentication)
   */
  static async removeFromWishlist(
    productId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `${this.baseUrl}/${productId}/wishlist/remove`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Get user's wishlist (requires authentication)
   */
  static async getWishlist(token: string): Promise<ApiResponse<Product[]>> {
    return getApiRequest(`${this.baseUrl}/wishlist`, token);
  }

  /**
   * Get product analytics (admin only)
   */
  static async getProductAnalytics(
    productId: string,
    token: string
  ): Promise<
    ApiResponse<{
      totalEnrollments: number;
      totalRevenue: number;
      averageRating: number;
      completionRate: number;
      popularTimeSlots: any[];
    }>
  > {
    return getApiRequest(`${this.baseUrl}/${productId}/analytics`, token);
  }
}
