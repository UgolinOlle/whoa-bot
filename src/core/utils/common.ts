import Whoa from '../structures/Whoa';

export function isDev(client: Whoa, userId: string) {
  return client.config.developers.includes(userId);
}

const isConstructorProxyHandler = {
  construct() {
    return Object.prototype;
  },
};

export function isConstructor(func: any, _class: any) {
  try {
    new new Proxy(func, isConstructorProxyHandler)();
    if (!_class) return true;
    return func.prototype instanceof _class;
  } catch (err) {
    return false;
  }
}
