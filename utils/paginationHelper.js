// utils/pagination.js
class PaginationHelper {
  /**
   * Get pagination parameters from request
   * @param {Object} req - Express request object
   * @returns {Object} - { page, limit, offset }
   */
  static getPaginationParams(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  /**
   * Format paginated response
   * @param {Array} data - Array of results
   * @param {Number} totalItems - Total count from database
   * @param {Number} page - Current page
   * @param {Number} limit - Items per page
   * @returns {Object} - Formatted response with pagination metadata
   */
  static formatResponse(data, totalItems, page, limit) {
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    };
  }
}

module.exports = PaginationHelper;

