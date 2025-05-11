type HttpHeader = {
    name : Text;
    value : Text;
};

type HttpMethod = {
    #get;
    #post;
    #head;
};

type TransformContext = {
    function : shared () -> async ();
    context : Blob;
};

type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    headers : [HttpHeader];
    body : ?[Nat8];
    method : HttpMethod;
    transform : ?TransformContext;
};

type HttpResponsePayload = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
};

module ICManagement = {
    public type IC = actor {
        http_request : HttpRequestArgs -> async HttpResponsePayload;
    };
};
