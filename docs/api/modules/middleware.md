[API Docs - v0.0.28](../README.md) / middleware

# Module: middleware

## Table of contents

### Functions

- [Lifecycle](middleware.md#lifecycle)
- [Prop](middleware.md#prop)
- [Refresh](middleware.md#refresh)
- [State](middleware.md#state)

## Functions

### Lifecycle

▸ **Lifecycle**<`Props`\>(): [`Middleware`](types.md#middleware)<`Props`, [`LifecycleHooks`](types.md#lifecyclehooks)\>

Allows the component to access its lifecycle hooks

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | extends `Record`<`string`, `any`\> |

#### Returns

[`Middleware`](types.md#middleware)<`Props`, [`LifecycleHooks`](types.md#lifecyclehooks)\>

#### Defined in

[internal/core/middleware.ts:21](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/middleware.ts#L21)

___

### Prop

▸ **Prop**<`Props`, `Value`\>(`sel`): [`Middleware`](types.md#middleware)<`Props`, [`Accessor`](types.md#accessor)<`Value`\>\>

Gives access to the component's properties

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | extends `Record`<`string`, `any`\> |
| `Value` | `Value` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sel` | (`props`: `Props`) => `Value` | a function to select a component prop |

#### Returns

[`Middleware`](types.md#middleware)<`Props`, [`Accessor`](types.md#accessor)<`Value`\>\>

#### Defined in

[internal/core/middleware.ts:7](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/middleware.ts#L7)

___

### Refresh

▸ **Refresh**<`Props`\>(): [`Middleware`](types.md#middleware)<`Props`, () => `void`\>

Allows a function to manually refresh the component.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | extends `Record`<`string`, `any`\> |

#### Returns

[`Middleware`](types.md#middleware)<`Props`, () => `void`\>

#### Defined in

[internal/core/middleware.ts:14](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/middleware.ts#L14)

___

### State

▸ **State**<`Props`, `Value`\>(`init`): [`Middleware`](types.md#middleware)<`Props`, { `value`: `Value`  }\>

Allows the component to manage its own state.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | extends `Record`<`string`, `any`\> |
| `Value` | `Value` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `init` | `Value` | the initial state |

#### Returns

[`Middleware`](types.md#middleware)<`Props`, { `value`: `Value`  }\>

an object with a single property, `value`, so the component can read from and write to its internal state

#### Defined in

[internal/core/middleware.ts:30](https://github.com/nimble-ui/NimbleUI/blob/ed98e21/src/internal/core/middleware.ts#L30)
