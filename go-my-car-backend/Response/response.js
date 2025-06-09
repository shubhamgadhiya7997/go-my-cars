const RESPONSE_CODE = require("../Response/common");


 const SuccessResponse =(res,code,message,data,success = true) => {
  const response = {code,success,message, ...(data !== undefined && { data }),};
  res.status(code).send(response);
};

 const ErrorResponse = ( res, code, message,errors = {},success = false,stack) => {
  const response = { success,code,message};

  if (Object.keys(errors).length > 0) {
    response.errors = errors;
  }
  if (stack) {
    response.stack = stack;
  }
  res.status(code).send(response);
};

 const SuccessCreated = (res, message, data) =>
  SuccessResponse(res, RESPONSE_CODE.CREATED, message, data);

 const SuccessOk = (res, message, data) =>
  SuccessResponse(res, RESPONSE_CODE.OK, message, data);

 const SuccessNoContent = (res, message) =>
  SuccessResponse(res, RESPONSE_CODE.NO_CONTENT, message);

// ERROR RESPONSES
 const BadRequest = (res,message,errors = {}) => ErrorResponse(res, RESPONSE_CODE.BAD_REQUEST, message, errors);

 const Unauthorized = (res, message = 'Unauthorized') =>
  ErrorResponse(res, RESPONSE_CODE.UNAUTHORIZED, message);

 const Forbidden = (res, message = 'Forbidden') =>
  ErrorResponse(res, RESPONSE_CODE.FORBIDDEN, message);

 const NotFound = (
  res,
  message = 'Resource not found'
) => ErrorResponse(res, RESPONSE_CODE.NOT_FOUND, message);

 const InternalServerError = (
  res,
  message = 'Internal Server Error',
  stack
) =>
  ErrorResponse(
    res,
    RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    message,
    {},
    false,
    stack
  );
  
module.exports = {
  SuccessResponse,
  ErrorResponse,
  SuccessCreated,
  SuccessOk,
  SuccessNoContent,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  InternalServerError,
};