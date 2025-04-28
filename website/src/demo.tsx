
import { MainProxyProvider, useMainProxyStore, ProxyInstanceObject } from "@carefrees/valtio"

const proxyInstance = new ProxyInstanceObject()._ctor({ a: 2 })
const Demo1 = () => {
  const { state, dispatch, namespace, proxyInstance, } = useMainProxyStore()
  console.log("demo1", state, state.a, namespace, proxyInstance);
  return <div>
    <button onClick={() => { dispatch({ a: new Date().getTime() }) }}  >点击</button>
  </div>
}
const Main1 = () => {
  return (<MainProxyProvider proxyInstance={proxyInstance} namespace='demo' >
    <Demo1 />
  </MainProxyProvider>)
}
export default Main1
