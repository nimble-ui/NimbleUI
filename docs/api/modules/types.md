[API Docs - v0.2.1-nightly.1](../README.md) / types

# Module: types

## Table of contents

### Type Aliases

- [Accessor](types.md#accessor)
- [Attrs](types.md#attrs)
- [Block](types.md#block)
- [Component](types.md#component)
- [LifecycleHooks](types.md#lifecyclehooks)
- [Middleware](types.md#middleware)
- [MiddlewareContext](types.md#middlewarecontext)
- [Render](types.md#render)

## Type Aliases

### Accessor

Ƭ **Accessor**<`Value`\>: () => `Value`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |

#### Type declaration

▸ (): `Value`

A factory function that is used to access dynamic values.

##### Returns

`Value`

#### Defined in

[internal/shared/types.ts:5](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/shared/types.ts#L5)

___

### Attrs

Ƭ **Attrs**: <A\>(`a`: { `attr`: (`name`: `string`, `value`: [`Accessor`](types.md#accessor)<`any`\>) => `A` ; `on`: (`name`: `string`, `listener`: [`Accessor`](types.md#accessor)<`undefined` \| ``null`` \| `void` \| <E\>(`e`: `E`) => `void`\>) => `A`  }) => `A`

#### Type declaration

▸ <`A`\>(`a`): `A`

An algebraic data type for declaring attributes.

##### Type parameters

| Name |
| :------ |
| `A` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `Object` |
| `a.attr` | (`name`: `string`, `value`: [`Accessor`](types.md#accessor)<`any`\>) => `A` |
| `a.on` | (`name`: `string`, `listener`: [`Accessor`](types.md#accessor)<`undefined` \| ``null`` \| `void` \| <E\>(`e`: `E`) => `void`\>) => `A` |

##### Returns

`A`

#### Defined in

[internal/shared/types.ts:10](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/shared/types.ts#L10)

___

### Block

Ƭ **Block**: <T\>(`block`: <Context\>(`id`: `string`, `template`: (`context`: [`Accessor`](types.md#accessor)<`Context`\>) => [`Render`](types.md#render), `context`: `Context`) => `T`) => `T`

#### Type declaration

▸ <`T`\>(`block`): `T`

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `block` | <Context\>(`id`: `string`, `template`: (`context`: [`Accessor`](types.md#accessor)<`Context`\>) => [`Render`](types.md#render), `context`: `Context`) => `T` |

##### Returns

`T`

#### Defined in

[internal/shared/types.ts:53](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/shared/types.ts#L53)

___

### Component

Ƭ **Component**<`Props`\>: (`use`: <T\>(`m`: [`Middleware`](types.md#middleware)<`Props`, `T`\>) => `T`) => [`Render`](types.md#render)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | extends `Record`<`string`, `any`\> |

#### Type declaration

▸ (`use`): [`Render`](types.md#render)

##### Parameters

| Name | Type |
| :------ | :------ |
| `use` | <T\>(`m`: [`Middleware`](types.md#middleware)<`Props`, `T`\>) => `T` |

##### Returns

[`Render`](types.md#render)

#### Defined in

[internal/shared/types.ts:51](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/shared/types.ts#L51)

___

### LifecycleHooks

Ƭ **LifecycleHooks**: `Object`

A representation component lifecycle hooks

#### Type declaration

| Name | Type |
| :------ | :------ |
| `mounted` | (`cb`: () => `void` \| () => `void`) => `void` |
| `update` | (`cb`: () => `void`) => `void` |

#### Defined in

[internal/shared/types.ts:18](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/shared/types.ts#L18)

___

### Middleware

Ƭ **Middleware**<`Props`, `T`\>: (`ctx`: [`MiddlewareContext`](types.md#middlewarecontext)<`Props`\>) => `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | extends `Record`<`string`, `any`\> |
| `T` | `T` |

#### Type declaration

▸ (`ctx`): `T`

A function to access a component's internal API.

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`MiddlewareContext`](types.md#middlewarecontext)<`Props`\> |

##### Returns

`T`

#### Defined in

[internal/shared/types.ts:49](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/shared/types.ts#L49)

___

### MiddlewareContext

Ƭ **MiddlewareContext**<`Props`\>: `Object`

A context for middleware to hook into components.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Props` | extends `Record`<`string`, `any`\> |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `on` | [`LifecycleHooks`](types.md#lifecyclehooks) | Contains a component's lifecycle hooks. |
| `props` | () => `Props` | Accesses a component's properties |
| `refresh` | () => `void` | Tells a component to update. |
| `use` | <T\>(`m`: [`Middleware`](types.md#middleware)<`Props`, `T`\>) => `T` | Allows middleware to use other middleware. |

#### Defined in

[internal/shared/types.ts:26](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/shared/types.ts#L26)

___

### Render

Ƭ **Render**: <T\>(`render`: { `component`: <Props\>(`comp`: [`Component`](types.md#component)<`Props`\>, `props`: [`Accessor`](types.md#accessor)<`Props`\>) => `T` ; `directive`: (`blocks`: [`Accessor`](types.md#accessor)<[`Block`](types.md#block)[]\>) => `T` ; `dynamic`: (`text`: [`Accessor`](types.md#accessor)<`any`\>) => `T` ; `element`: (`el`: `string`, `attrs`: [`Attrs`](types.md#attrs)[], `children`: [`Render`](types.md#render)[]) => `T` ; `fragment`: (`children`: [`Render`](types.md#render)[]) => `T` ; `text`: (`text`: `string`) => `T`  }) => `T`

#### Type declaration

▸ <`T`\>(`render`): `T`

A render instruction used for CSR or SSR.

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `render` | `Object` |
| `render.component` | <Props\>(`comp`: [`Component`](types.md#component)<`Props`\>, `props`: [`Accessor`](types.md#accessor)<`Props`\>) => `T` |
| `render.directive` | (`blocks`: [`Accessor`](types.md#accessor)<[`Block`](types.md#block)[]\>) => `T` |
| `render.dynamic` | (`text`: [`Accessor`](types.md#accessor)<`any`\>) => `T` |
| `render.element` | (`el`: `string`, `attrs`: [`Attrs`](types.md#attrs)[], `children`: [`Render`](types.md#render)[]) => `T` |
| `render.fragment` | (`children`: [`Render`](types.md#render)[]) => `T` |
| `render.text` | (`text`: `string`) => `T` |

##### Returns

`T`

#### Defined in

[internal/shared/types.ts:58](https://github.com/nimble-ui/NimbleUI/blob/de15fef/src/internal/shared/types.ts#L58)
