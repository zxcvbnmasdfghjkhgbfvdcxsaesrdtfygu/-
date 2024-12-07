import axios from "axios";
import { ElMessage } from "element-plus";
import config from "@/config";

// const service = axios.create();
const service = axios.create({
    baseURL:config.baseApi,
});
const NETWORK_ERROR = '网络错误...'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error); 
  });

// 添加响应拦截器
service.interceptors.response.use((res)=>{
        const {code,data,msg} = res.data;
        if(code === 200){
            return data;
        }else{
            const NETWORK_ERROR = '网络错误...';
            ElMessage.error(msg || NETWORK_ERROR);
            return Promise.reject(msg || NETWORK_ERROR);

        }
  });

  function request(options){
    options.method = options.method || "get";
    if(options.method.toLowerCase() === "get"){
        options.params = options.data;
    }
    let isMock = config.mock;
    if(typeof  options.mock !== "undefined"){
        isMock = options.mock;
    }

    if(config.env === 'prod'){
        service.defaults.baseURL = config.baseApi;
    }else{
        service.defaults.baseURL = isMock ? config.mockApi :config.baseApi;
    }
    return service(options);
  }

  export default request;