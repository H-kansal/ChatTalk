
type Code = 200 | 201 | 400 | 401 | 403 | 404 | 500 | 501 | 502;


class ApiResponse{
    statusCode:Code
    message:string
    success:boolean
    data:any
    constructor(statusCode:Code,message:string,data?:any){
        this.statusCode=statusCode;
        this.message=message;
        this.success=statusCode<400;
        this.data=data;
    }
}

export default ApiResponse;