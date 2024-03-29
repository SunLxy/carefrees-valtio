
import { proxy, ref } from "valtio"


/**
 * 基础操作 Proxy 对象
 * */
export class ProxyInstanceObject<T extends Object = any> {
  store: T;
  /**初始store对象*/
  _cstor = <K = typeof this>(state: T) => {
    this.store = proxy(state) as T;
    return this as unknown as K;
  }
  /**设置对象属性值*/
  _setStore = <K = T>(value?: Partial<K>) => {
    if (value) {
      Object.keys(value).forEach((key) => {
        this.store[key] = value[key]
      })
    }
  }
  /**设置不做监听的ref对象属性值*/
  _setRefStore = <K = T>(value?: Partial<K>) => {
    if (value) {
      Object.keys(value).forEach((key) => {
        this.store[key] = this._createRef(value[key])
      })
    }
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
      instProxy = new ProxyInstanceObject<T>()._cstor(inital || {} as T) as K
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