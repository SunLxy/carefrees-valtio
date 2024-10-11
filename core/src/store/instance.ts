
import { proxy, ref } from "valtio"
import type { ProxyInstanceObjectStoreType } from "./interface"
/**
 * 基础操作 Proxy 对象
 * */
export class ProxyInstanceObject<T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType> {
  store = proxy({ loading: {} } as T);
  /**页面状态名称*/
  namespace?: string
  /**是否加载loading*/
  isPageLoading?: boolean
  /**判断是否已经实例化*/
  is_main_page_ctor = false;
  /**默认值*/
  defaultInital = {
    /**loading加载数据*/
    loading: {}
  }
  constructor(namespace?: string) {
    this.namespace = namespace
  }
  /**初始store对象*/
  _ctor = <K extends T = T>(state: K) => {
    this.store = proxy(state);
    return this
  }
  /**设置对象属性值*/
  _setStore = <K extends T = T>(value?: Partial<K>) => {
    if (!this.store) {
      this.store = proxy({ ...this.defaultInital } as K);
    }
    if (value) {
      Object.keys(value).forEach((key) => {
        // @ts-ignore
        this.store[key] = value[key]
      })
    }
    return this;
  }
  /**设置不做监听的ref对象属性值*/
  _setRefStore = <K extends T = T>(value?: Partial<K>) => {
    if (!this.store) {
      this.store = proxy({ ...this.defaultInital } as K);
    }
    if (value) {
      Object.keys(value).forEach((key) => {
        const newValue = value[key];
        if (typeof newValue === "object" && newValue) {
          // @ts-ignore
          this.store[key] = this._createRef(value[key])
        } else {
          // @ts-ignore
          this.store[key] = value[key]
        }
      })
    }
    return this;
  }
  /**创建 ref 对象 (ref对象不做监听更新)*/
  _createRef = <K extends Object = any>(inital?: K) => {
    return ref<K>(inital || {} as K) as K
  }
  /**删除字段值*/
  _deleteFieldValue = (names: string | string[]) => {
    if (Array.isArray(names)) {
      let cacheValue = this.store
      const newNames = [...names]
      const lastField = newNames.pop()
      for (let index = 0; index < newNames.length; index++) {
        cacheValue = cacheValue[newNames[index]]
      }
      if (cacheValue) {
        delete cacheValue[lastField]
      }
    } else {
      delete this.store[names]
    }
  }

  /**根据名称获取某个实例*/
  _getProxyCache = (name: string) => {
    return cacheInstance.getProxy(name);
  }
  /**获取缓存数据实例*/
  _getAllProxyCache = () => {
    return cacheInstance
  }

  /**初始化状态值*/
  main_store = (initalValues: Partial<T> = {}) => {
    const newStore = { ...this.defaultInital, ...initalValues } as unknown as T
    this._ctor(newStore)
  }

  /**更新页面级的 pageLoading */
  updatedPageLoading = (loading: boolean = true) => {
    if (typeof this.store?.loading === "object") {
      this.store.loading.pageLoading = loading
    } else {
      this.store.loading = { pageLoading: loading }
    }
  }

  /**默认实例化方法*/
  main_ctor = () => {
    if (this.is_main_page_ctor) {
      return this;
    }
    /**初始掉数据*/
    this.is_main_page_ctor = true;
    this.main_store();
    return this;
  }

}

export interface ProxyCacheInstanceOptions<T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>> {
  /**命名*/
  name?: string;
  /**初始值*/
  inital?: T
  /**传递一个已经对象*/
  instanceObject?: K
}

/**实例缓存*/
export class ProxyInstanceCache {
  /**存储的数据*/
  proxyMap: Map<string, ProxyInstanceObject<any>> = new Map([])
  /**创建一个Proxy*/
  createProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(options: ProxyCacheInstanceOptions<T, K> = {}, isNotCreate: boolean = false) => {
    const { name, inital, instanceObject: proxyObject } = options
    if (name && this.proxyMap.has(name)) {
      return this.proxyMap.get(name) as K
    }
    let instProxy: K;
    if (proxyObject) {
      instProxy = proxyObject
    } else if (!isNotCreate) {
      instProxy = new ProxyInstanceObject<T>()._ctor(inital || {} as T) as K
    }
    if (name && instProxy) {
      this.proxyMap.set(name, instProxy)
    }
    return instProxy as K
  }
  /**获取*/
  getProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(name: string) => {
    return this.proxyMap.get(name) as K
  }
  /**删除一个Proxy*/
  deleteProxy = (name: string) => {
    if (name)
      this.proxyMap.delete(name)
  }
  /**判断是否已经存在*/
  isProxy = (name: string) => {
    return this.proxyMap.has(name)
  }
  /**存储实例*/
  setProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(name: string, instance: K) => {
    return this.proxyMap.set(name, instance)
  }
}

/**内置缓存数据实例*/
export const cacheInstance = new ProxyInstanceCache()

export default cacheInstance
