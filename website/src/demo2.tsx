import { createCommonMainStore, ProxyInstanceObject } from "@carefrees/valtio"

const proxyInstance = new ProxyInstanceObject("demo")._ctor({ a: 2 })

const { MainProxyProvider, useMainProxyStore } = createCommonMainStore({ proxyInstance, namespace: proxyInstance.namespace })

const Demo = () => {

  const { state, dispatch, proxyInstance, } = useMainProxyStore()
  console.log("demo2", state, state.a, proxyInstance);

  return <div>
    <button onClick={() => { dispatch({ a: new Date().getTime() }) }}  >点击</button>
  </div>
}

const Main = () => {
  return (<MainProxyProvider >
    <Demo />
  </MainProxyProvider>)
}
export default Main