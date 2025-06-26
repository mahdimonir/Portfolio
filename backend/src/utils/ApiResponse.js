class ApiResponse {
  constructor(statusCode, data, message = "Success", meta = {}) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = "Success", meta = {}) {
    return new ApiResponse(200, data, message, meta);
  }

  static created(data, message = "Resource created successfully", meta = {}) {
    return new ApiResponse(201, data, message, meta);
  }

  static noContent(message = "No content") {
    return new ApiResponse(204, null, message);
  }

  static paginated(data, page, limit, total, message = "Success") {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return new ApiResponse(200, data, message, {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null,
      },
    });
  }
}

export { ApiResponse };
