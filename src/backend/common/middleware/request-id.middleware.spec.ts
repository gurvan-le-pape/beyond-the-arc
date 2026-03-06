// src/backend/common/middleware/request-id.middleware.spec.ts
import { RequestIdMiddleware } from "./request-id.middleware";

describe("RequestIdMiddleware", () => {
  let middleware: RequestIdMiddleware;
  let mockRequest: Partial<{ id?: string; headers: Record<string, string> }>;
  let mockResponse: Partial<{ setHeader: jest.Mock }>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
    mockRequest = { headers: {} };
    mockResponse = { setHeader: jest.fn() };
    mockNext = jest.fn();
  });

  it("should use x-request-id header when provided", () => {
    mockRequest.headers = { "x-request-id": "my-request-id" };

    middleware.use(mockRequest as any, mockResponse as any, mockNext);

    expect(mockRequest.id).toBe("my-request-id");
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      "X-Request-Id",
      "my-request-id",
    );
  });

  it("should generate a UUID when x-request-id header is not provided", () => {
    middleware.use(mockRequest as any, mockResponse as any, mockNext);

    expect(mockRequest.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      "X-Request-Id",
      mockRequest.id,
    );
  });

  it("should call next()", () => {
    middleware.use(mockRequest as any, mockResponse as any, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
