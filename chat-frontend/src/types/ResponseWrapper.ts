type ResponseWrapper<T = void> = BaseResponse & (SuccessResponse<T> | FailedResponse);

type BaseResponse = { status: number };

type Ok = { ok: true };

type SuccessResponse<T> = T extends void ? Ok : Ok & { data: T };

type FailedResponse = { ok: false };

export default ResponseWrapper;
