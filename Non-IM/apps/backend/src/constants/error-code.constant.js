export var ErrorEnum;
(function (ErrorEnum) {
    ErrorEnum["DEFAULT"] = "0:\u672A\u77E5\u9519\u8BEF";
    ErrorEnum["SERVER_ERROR"] = "500:\u670D\u52A1\u7E41\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5";
    ErrorEnum["SYSTEM_USER_EXISTS"] = "1001:\u7CFB\u7EDF\u7528\u6237\u5DF2\u5B58\u5728";
    ErrorEnum["INVALID_VERIFICATION_CODE"] = "1002:\u9A8C\u8BC1\u7801\u586B\u5199\u6709\u8BEF";
    ErrorEnum["INVALID_USERNAME_PASSWORD"] = "1003:\u7528\u6237\u540D\u5BC6\u7801\u6709\u8BEF";
    ErrorEnum["NODE_ROUTE_EXISTS"] = "1004:\u8282\u70B9\u8DEF\u7531\u5DF2\u5B58\u5728";
    ErrorEnum["PERMISSION_REQUIRES_PARENT"] = "1005:\u6743\u9650\u5FC5\u987B\u5305\u542B\u7236\u8282\u70B9";
    ErrorEnum["ILLEGAL_OPERATION_DIRECTORY_PARENT"] = "1006:\u975E\u6CD5\u64CD\u4F5C\uFF1A\u8BE5\u8282\u70B9\u4EC5\u652F\u6301\u76EE\u5F55\u7C7B\u578B\u7236\u8282\u70B9";
    ErrorEnum["ILLEGAL_OPERATION_CANNOT_CONVERT_NODE_TYPE"] = "1007:\u975E\u6CD5\u64CD\u4F5C\uFF1A\u8282\u70B9\u7C7B\u578B\u65E0\u6CD5\u76F4\u63A5\u8F6C\u6362";
    ErrorEnum["ROLE_HAS_ASSOCIATED_USERS"] = "1008:\u8BE5\u89D2\u8272\u5B58\u5728\u5173\u8054\u7528\u6237\uFF0C\u8BF7\u5148\u5220\u9664\u5173\u8054\u7528\u6237";
    ErrorEnum["DEPARTMENT_HAS_ASSOCIATED_USERS"] = "1009:\u8BE5\u90E8\u95E8\u5B58\u5728\u5173\u8054\u7528\u6237\uFF0C\u8BF7\u5148\u5220\u9664\u5173\u8054\u7528\u6237";
    ErrorEnum["DEPARTMENT_HAS_ASSOCIATED_ROLES"] = "1010:\u8BE5\u90E8\u95E8\u5B58\u5728\u5173\u8054\u89D2\u8272\uFF0C\u8BF7\u5148\u5220\u9664\u5173\u8054\u89D2\u8272";
    ErrorEnum["PASSWORD_MISMATCH"] = "1011:\u65E7\u5BC6\u7801\u4E0E\u539F\u5BC6\u7801\u4E0D\u4E00\u81F4";
    ErrorEnum["LOGOUT_OWN_SESSION"] = "1012:\u5982\u60F3\u4E0B\u7EBF\u81EA\u8EAB\u53EF\u53F3\u4E0A\u89D2\u9000\u51FA";
    ErrorEnum["NOT_ALLOWED_TO_LOGOUT_USER"] = "1013:\u4E0D\u5141\u8BB8\u4E0B\u7EBF\u8BE5\u7528\u6237";
    ErrorEnum["PARENT_MENU_NOT_FOUND"] = "1014:\u7236\u7EA7\u83DC\u5355\u4E0D\u5B58\u5728";
    ErrorEnum["DEPARTMENT_HAS_CHILD_DEPARTMENTS"] = "1015:\u8BE5\u90E8\u95E8\u5B58\u5728\u5B50\u90E8\u95E8\uFF0C\u8BF7\u5148\u5220\u9664\u5B50\u90E8\u95E8";
    ErrorEnum["SYSTEM_BUILTIN_FUNCTION_NOT_ALLOWED"] = "1016:\u7CFB\u7EDF\u5185\u7F6E\u529F\u80FD\u4E0D\u5141\u8BB8\u64CD\u4F5C";
    ErrorEnum["USER_NOT_FOUND"] = "1017:\u7528\u6237\u4E0D\u5B58\u5728";
    ErrorEnum["UNABLE_TO_FIND_DEPARTMENT_FOR_USER"] = "1018:\u65E0\u6CD5\u67E5\u627E\u5F53\u524D\u7528\u6237\u6240\u5C5E\u90E8\u95E8";
    ErrorEnum["DEPARTMENT_NOT_FOUND"] = "1019:\u90E8\u95E8\u4E0D\u5B58\u5728";
    ErrorEnum["PARAMETER_CONFIG_KEY_EXISTS"] = "1022:\u53C2\u6570\u914D\u7F6E\u952E\u503C\u5BF9\u5DF2\u5B58\u5728";
    ErrorEnum["DEFAULT_ROLE_NOT_FOUND"] = "1023:\u6240\u5206\u914D\u7684\u9ED8\u8BA4\u89D2\u8272\u4E0D\u5B58\u5728";
    ErrorEnum["INVALID_LOGIN"] = "1101:\u767B\u5F55\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55";
    ErrorEnum["NO_PERMISSION"] = "1102:\u65E0\u6743\u9650\u8BBF\u95EE";
    ErrorEnum["ONLY_ADMIN_CAN_LOGIN"] = "1103:\u4E0D\u662F\u7BA1\u7406\u5458\uFF0C\u65E0\u6CD5\u767B\u5F55";
    ErrorEnum["REQUEST_INVALIDATED"] = "1104:\u5F53\u524D\u8BF7\u6C42\u5DF2\u5931\u6548";
    ErrorEnum["ACCOUNT_LOGGED_IN_ELSEWHERE"] = "1105:\u60A8\u7684\u8D26\u53F7\u5DF2\u5728\u5176\u4ED6\u5730\u65B9\u767B\u5F55";
    ErrorEnum["GUEST_ACCOUNT_RESTRICTED_OPERATION"] = "1106:\u6E38\u5BA2\u8D26\u53F7\u4E0D\u5141\u8BB8\u64CD\u4F5C";
    ErrorEnum["REQUESTED_RESOURCE_NOT_FOUND"] = "1107:\u6240\u8BF7\u6C42\u7684\u8D44\u6E90\u4E0D\u5B58\u5728";
    ErrorEnum["TOO_MANY_REQUESTS"] = "1201:\u8BF7\u6C42\u9891\u7387\u8FC7\u5FEB\uFF0C\u8BF7\u4E00\u5206\u949F\u540E\u518D\u8BD5";
    ErrorEnum["MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY"] = "1202:\u4E00\u5929\u6700\u591A\u53D1\u90015\u6761\u9A8C\u8BC1\u7801";
    ErrorEnum["VERIFICATION_CODE_SEND_FAILED"] = "1203:\u9A8C\u8BC1\u7801\u53D1\u9001\u5931\u8D25";
    ErrorEnum["INSECURE_MISSION"] = "1301:\u4E0D\u5B89\u5168\u7684\u4EFB\u52A1\uFF0C\u786E\u4FDD\u6267\u884C\u7684\u52A0\u5165@Mission\u6CE8\u89E3";
    ErrorEnum["EXECUTED_MISSION_NOT_FOUND"] = "1302:\u6240\u6267\u884C\u7684\u4EFB\u52A1\u4E0D\u5B58\u5728";
    ErrorEnum["MISSION_EXECUTION_FAILED"] = "1303:\u4EFB\u52A1\u6267\u884C\u5931\u8D25";
    ErrorEnum["MISSION_NOT_FOUND"] = "1304:\u4EFB\u52A1\u4E0D\u5B58\u5728";
    // OSS相关
    ErrorEnum["OSS_FILE_OR_DIR_EXIST"] = "1401:\u5F53\u524D\u521B\u5EFA\u7684\u6587\u4EF6\u6216\u76EE\u5F55\u5DF2\u5B58\u5728";
    ErrorEnum["OSS_NO_OPERATION_REQUIRED"] = "1402:\u65E0\u9700\u64CD\u4F5C";
    ErrorEnum["OSS_EXCEE_MAXIMUM_QUANTITY"] = "1403:\u5DF2\u8D85\u51FA\u652F\u6301\u7684\u6700\u5927\u5904\u7406\u6570\u91CF";
})(ErrorEnum || (ErrorEnum = {}));
//# sourceMappingURL=error-code.constant.js.map