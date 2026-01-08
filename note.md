# fetchHandler 代码解析

## 1. 代码整体作用

这个函数 `fetchHandler` 的作用是：**封装原生的 `fetch` API，增加了超时控制、错误处理和日志记录功能**。

可以理解为：它是一个"升级版的快递员"，不仅帮你发送请求，还能：
- 设定等待时间（超时就放弃）
- 遇到问题时记录日志
- 统一处理各种错误

---

## 2. 逐段解析

### 第 6-8 行：定义配置类型

```typescript
interface FetchOptions extends RequestInit {
    timeout?: number;
}
```

**通俗解释**：这里定义了一个"配置清单"。
- `RequestInit` 是浏览器原生 fetch 的配置（方法、请求头等）
- 我们额外加了一个 `timeout` 选项（超时时间）

---

### 第 10-12 行：类型守卫函数

```typescript
function isError(error: unknown): error is Error {
    return error instanceof Error;
}
```

**通俗解释**：这是一个"检查员"，用来判断捕获的错误是不是标准的 Error 对象。

为什么需要？因为 JavaScript 的 `catch` 可能捕获到任何东西（字符串、数字等），我们需要确认它是 Error 类型才能安全地使用 `.message` 等属性。

---

### 第 14-22 行：函数签名和参数解构

```typescript
export async function fetchHanlder<T>(
    url: string,
    options: FetchOptions = {}
): Promise<ActionResponse<T>> {
    const {
        timeout = 5000,
        headers: customHeaders = {},
        ...restOptions
    } = options;
```

**通俗解释**：
- `<T>` 是泛型，表示返回数据的类型由调用者决定
- 参数：`url`（请求地址）和 `options`（配置，默认空对象）
- 解构时：
  - `timeout` 默认 5000 毫秒（5秒）
  - `customHeaders` 提取自定义请求头
  - `...restOptions` 收集其他所有配置

---

### 第 24-36 行：准备请求配置

```typescript
const controller = new AbortController();
const id = setTimeout(() => controller.abort(), timeout);

const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
};
```

**通俗解释**：

1. **AbortController** - 这是一个"取消器"
   - 想象成一个遥控器，按下按钮就能取消请求
   - `setTimeout` 设置了一个定时器：超过指定时间就自动按下取消按钮

2. **默认请求头** - 告诉服务器：
   - 我发的是 JSON 数据
   - 我也想收到 JSON 数据

3. **合并配置** - 用户的自定义头会覆盖默认头，最后把 `signal`（取消信号）也加进去

---

### 第 38-49 行：发送请求（成功路径）

```typescript
try {
    const response = await fetch(url, config);
    clearTimeout(id);  // 请求成功，取消超时定时器

    if (!response.ok) {
        throw new RequestError(
            response.status,
            `HTTP error: ${response.status}`
        );
    }

    return await response.json();
}
```

**通俗解释**：
1. 发送请求，等待响应
2. 收到响应后，立刻取消超时定时器（因为请求已经完成了）
3. 检查状态码：如果不是 2xx（如 404、500），抛出错误
4. 成功则返回解析后的 JSON 数据

---

### 第 50-59 行：错误处理

```typescript
catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    if (error.name === "AbortError") {
        logger.warn(`Request to ${url} timed out`);
    } else {
        logger.error(`Error fetching ${url}:${error.message}`);
    }

    return handleError(error) as ActionResponse<T>;
}
```

**通俗解释**：
1. 先用 `isError` 确认错误类型，不是标准 Error 就包装成一个
2. 如果是 `AbortError`，说明是超时了，记录警告日志
3. 其他错误则记录错误日志
4. 最后用 `handleError` 统一处理，返回标准格式的错误响应

---

## 3. 流程图

```
调用 fetchHandler(url, options)
         ↓
    设置超时定时器
         ↓
    发送 fetch 请求
         ↓
    ┌────┴────┐
    ↓         ↓
成功响应    请求失败/超时
    ↓         ↓
清除定时器   判断错误类型
    ↓         ↓
状态码ok?   记录日志
    ↓         ↓
返回JSON   返回错误响应
```

---

## 4. 使用示例

```typescript
// 调用示例
const result = await fetchHandler<User>('/api/users/1', {
    method: 'GET',
    timeout: 3000  // 3秒超时
});

if (result.success) {
    console.log(result.data);  // User 类型的数据
} else {
    console.log(result.error); // 错误信息
}
```

---

## 5. 小提示

代码第 14 行有个拼写错误：`fetchHanlder` 应该是 `fetchHandler`（少了个 d）。这个可能需要修正。
