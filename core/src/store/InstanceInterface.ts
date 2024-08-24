import { ProxyInstanceObject } from "./instance"
import { MainInstanceInterfaceObject } from "./interface"

export class MainInstanceInterface<T extends MainInstanceInterfaceObject = MainInstanceInterfaceObject> extends ProxyInstanceObject<T> {
  /**页面状态名称*/
  namespace = '';
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
    super();
    this.namespace = namespace
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
