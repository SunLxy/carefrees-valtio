# 使用 valtio 封装

1. 简化页面状态生成

## 安装

```bash
yarn add @carefrees/valtio # npm install @carefrees/valtio
```

## 解决中文输入问题

通过添加参数`sync`解决中文输入问题，[valtio中文输入问题](https://github.com/pmndrs/valtio?tab=readme-ov-file#update-synchronously)

```tsx

import { useProxyStore } from "@carefrees/valtio"

const Demo = ()=>{
  const { state, dispatch } = useProxyStore({ text:"" }, { sync: true })
  return <input value={state.text} onChange={(e) => dispatch({ text:e.target.value})} />
} 

```

## 使用

```tsx
import { MainProxyProvider , useMainProxyStore , ProxyInstanceObject} from "@carefrees/valtio"

const proxyInstance = new ProxyInstanceObject<T>()._ctor({ a:2 })

const Demo = ()=>{

  const { state, dispatch, namespace, proxyInstance,} = useMainProxyStore()
  console.log(state,state.a,namespace,proxyInstance);

  return <div>
    <button onClick={()=>{ dispatch({a:new Date().getTime()}) }}  >点击</button>
  </div>
} 

const Main = ()=>{
  return (<MainProxyProvider proxyInstance={proxyInstance} namespace='demo' >
      <Demo />
  </MainProxyProvider>)
}

```

## 自定义使用

```tsx
import { createCommonMainStore , ProxyInstanceObject } from "@carefrees/valtio"

const proxyInstance = new ProxyInstanceObject<T>()._ctor({ a:2 })

const { MainProxyProvider , useMainProxyStore } = createCommonMainStore({ proxyInstance, namespace:"demo" })

const Demo = ()=>{

  const { state, dispatch, namespace, proxyInstance,} = useMainProxyStore()
  console.log(state,state.a,namespace,proxyInstance);

  return <div>
    <button onClick={()=>{ dispatch({a:new Date().getTime()}) }}  >点击</button>
  </div>
} 

const Main = ()=>{
  return (<MainProxyProvider >
      <Demo />
  </MainProxyProvider>)
}

```

## 类react中useState

```tsx
import { useProxyStore } from "@carefrees/valtio"

const Demo = ()=>{
  const { state, dispatch, proxyInstance } = useProxyStore({ a:1 })
  console.log(state,state.a,dispatch,proxyInstance);
  return <div>
    <button onClick={()=>{ dispatch({a:new Date().getTime()}) }}  >点击</button>
  </div>
} 

```

## 类型

```ts
import type { INTERNAL_Snapshot as Snapshot } from 'valtio/vanilla';

export interface MainProxyProviderProps<T> {
  children: React.ReactNode,
  proxyInstance?: T
  namespace?: string,
}
export interface CreateMainProviderOptions<T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>> extends Omit<MainProxyProviderProps<K>, 'children'> {
  initalValue?: T
}

export interface ProxyInstanceObjectStoreType extends Object {
  /**loading存储*/
  loading?: Record<string, boolean>
  [s: string]: any
}

/**
 * 基础操作 Proxy 对象
 * */
export declare class ProxyInstanceObject<T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType> {
    store: T;
    /**页面状态名称*/
    namespace?: string;
    /**是否加载loading*/
    isPageLoading?: boolean;
    /**判断是否已经实例化*/
    is_main_page_ctor: boolean;
    /**所有缓存实体类*/
    proxyAllCacheInstance?: ProxyInstanceCache;
    /**默认值*/
    defaultInital: {
        /**loading加载数据*/
        loading: {};
    };
    constructor(namespace?: string);
    /**初始store对象*/
    _ctor: <K extends T = T>(state: K) => this;
    /**设置对象属性值*/
    _setStore: <K extends T = T>(value?: Partial<K>) => this;
    /**设置不做监听的ref对象属性值*/
    _setRefStore: <K extends T = T>(value?: Partial<K>) => this;
    /**创建 ref 对象 (ref对象不做监听更新)*/
    _createRef: <K extends Object = any>(inital?: K) => K;
    /**删除字段值*/
    _deleteFieldValue: (names: string | string[]) => this;
    /**根据名称获取某个实例*/
    _getProxyCache: (name: string) => ProxyInstanceObject<any>;
    /**设置namespace，把当前实体保存到缓存中*/
    _insertProxyCache: (namespace?: string) => this;
    /**设置namespace，把当前实体从缓存中删除*/
    _removeProxyCache: (namespace?: string) => this;
    /**获取缓存数据实例*/
    _getAllProxyCache: () => ProxyInstanceCache;
    /**初始化状态值*/
    main_store: (initalValues?: Partial<T>) => this;
    /**更新页面级的 pageLoading */
    updatedPageLoading: (loading?: boolean) => this;
    /**默认实例化方法*/
    main_ctor: () => this;
}
export interface ProxyCacheInstanceOptions<T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>> {
    /**命名*/
    name?: string;
    /**初始值*/
    inital?: T;
    /**传递一个已经对象*/
    instanceObject?: K;
}
/**实例缓存*/
export declare class ProxyInstanceCache {
    /**存储的数据*/
    proxyMap: Map<string, ProxyInstanceObject<any>>;
    /**创建一个Proxy*/
    createProxy: <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(options?: ProxyCacheInstanceOptions<T, K>, isNotCreate?: boolean) => K;
    /**获取*/
    getProxy: <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(name: string) => K;
    /**删除一个Proxy*/
    deleteProxy: (name: string) => void;
    /**判断是否已经存在*/
    isProxy: (name: string) => boolean;
    /**存储实例*/
    setProxy: <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(name: string, instance: K) => Map<string, ProxyInstanceObject<any>>;
}

/**创建自定义组合状态管理*/
export declare const createCommonMainStore: <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(options: CreateMainProviderOptions<T, K>) => {
    MainProxyProvider: (props: {
        children?: React.ReactNode;
        initAttr?: any;
    }) => import("react").FunctionComponentElement<import("react").ProviderProps<{
        namespace: string;
        proxyInstance: ProxyInstanceObject;
        initAttr?: any;
    }>>;
    useMainProxyStore: () => {
        state: Snapshot<T>;
        dispatch: (value: Partial<T>, type?: "ref" | "none") => void;
        proxyInstance: K;
        initAttr: any;
        temps: any;
    };
    MainProxyContext: import("react").Context<{
        namespace: string;
        proxyInstance: ProxyInstanceObject;
        initAttr?: any;
    }>;
};
export declare const MainProxyProvider: <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(props: MainProxyProviderProps<K>) => import("react").FunctionComponentElement<import("react").ProviderProps<{
    namespace: string;
    proxyInstance: ProxyInstanceObject<any>;
}>>;
/**获取页面的实例*/
export declare const useMainProxy: <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>() => {
    namespace?: string;
    proxyInstance: K;
};
/**
 * 当页面有页面级的实例
*/
export declare const useMainProxyStore: <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>() => {
    state: Snapshot<T>;
    dispatch: (value: Partial<T>, type?: "ref" | "none") => void;
    namespace: string;
    proxyInstance: K;
    temps: any;
};
/**
 * 状态管理(===>useState)
*/
export declare const useProxyStore: <T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType>(inital: T) => {
    state: Snapshot<T>;
    dispatch: (value: Partial<T>, type?: "ref" | "none") => void;
    proxyInstance: ProxyInstanceObject<T>;
    temps: any;
};
/**
 * 根据存储名称获取实例
*/
export declare const useMainProxyNameStore: <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(namespace: string) => {
    state: Snapshot<T>;
    dispatch: (value: Partial<T>, type?: "ref" | "none") => void;
    namespace: string;
    proxyInstance: K;
    temps: any;
};
export declare const connecMainProxy: <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>, M extends {
    new (...args: any[]): K;
} = new (...args: any[]) => K>(namespace: string, MainProxyInstance: M, Component: React.FC) => (props: any) => import("react").FunctionComponentElement<MainProxyProviderProps<ProxyInstanceObject<Object>>>;

```
